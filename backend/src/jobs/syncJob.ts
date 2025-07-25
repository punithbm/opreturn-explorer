import { BitcoinService } from "../services/bitcoinService";
import { DatabaseService } from "../services/databaseService";
import { BlockEntity, TransactionEntity, OpReturnDataEntity } from "../types/bitcoin";

export class SyncJob {
  private bitcoinService: BitcoinService;
  private databaseService: DatabaseService;
  private isRunning: boolean = false;

  constructor() {
    this.bitcoinService = new BitcoinService();
    this.databaseService = new DatabaseService();
  }

  async syncBlocks(): Promise<void> {
    if (this.isRunning) {
      console.log("Sync job already running, skipping...");
      return;
    }

    this.isRunning = true;
    console.log("Starting block sync job...");

    try {
      // Get starting height
      const dbLatestHeight = await this.databaseService.getLatestBlockHeight();
      const initialHeight = parseInt(process.env.INITIAL_BLOCK_HEIGHT || "905000");
      const startHeight = dbLatestHeight ? dbLatestHeight + 1 : initialHeight;

      // Get latest Bitcoin block height
      const latestHeight = await this.bitcoinService.getLatestBlockHeight();

      console.log(`Syncing blocks from ${startHeight} to ${latestHeight}`);

      if (startHeight > latestHeight) {
        console.log("Already up to date");
        return;
      }

      // Sync blocks in batches to avoid overwhelming the API
      const batchSize = 5; // Reduced batch size for better stability
      for (let height = startHeight; height <= latestHeight; height += batchSize) {
        const endHeight = Math.min(height + batchSize - 1, latestHeight);
        await this.syncBlockRange(height, endHeight);

        // Progress update
        const progress = ((height - startHeight) / (latestHeight - startHeight + 1)) * 100;
        console.log(`Sync progress: ${progress.toFixed(1)}% (Block ${height} / ${latestHeight})`);
      }

      console.log("Block sync completed successfully");
    } catch (error) {
      console.error("Error during block sync:", error);
    } finally {
      this.isRunning = false;
    }
  }

  private async syncBlockRange(startHeight: number, endHeight: number): Promise<void> {
    for (let height = startHeight; height <= endHeight; height++) {
      try {
        await this.syncSingleBlock(height);
      } catch (error) {
        console.error(`Error syncing block ${height}:`, error);
        // Continue with next block instead of stopping
      }
    }
  }

  private async syncSingleBlock(height: number): Promise<void> {
    try {
      // Get block hash
      const blockHash = await this.bitcoinService.getBlockHash(height);

      // Get block data
      const block = await this.bitcoinService.getBlock(blockHash);

      // Get all transactions in the block
      const txids = await this.bitcoinService.getBlockTransactions(blockHash);

      console.log(`Processing block ${height} with ${txids.length} transactions`);

      // Create block entity
      const blockEntity: BlockEntity = {
        hash: block.id,
        height: block.height,
        transaction_count: txids.length,
        timestamp: block.timestamp,
        size: block.size,
        weight: block.weight,
        merkle_root: block.merkle_root,
        difficulty: block.difficulty,
        nonce: block.nonce,
        version: block.version,
        previous_block_hash: block.previousblockhash,
      };

      // Save block to database
      await this.databaseService.saveBlock(blockEntity);

      // Process transactions in smaller batches
      const txBatchSize = 3; // Smaller batch size for transaction processing
      let opReturnCount = 0;

      for (let i = 0; i < txids.length; i += txBatchSize) {
        const batch = txids.slice(i, i + txBatchSize);
        const results = await Promise.allSettled(batch.map((txid) => this.processTransaction(txid, blockHash, height)));

        // Count successful OP_RETURN transactions
        results.forEach((result) => {
          if (result.status === "fulfilled" && result.value) {
            opReturnCount++;
          }
        });
      }

      if (opReturnCount > 0) {
        console.log(`Found ${opReturnCount} OP_RETURN transactions in block ${height}`);
      }
    } catch (error) {
      console.error(`Error processing block ${height}:`, error);
      throw error;
    }
  }

  private async processTransaction(txid: string, blockHash: string, blockHeight: number): Promise<boolean> {
    try {
      const transaction = await this.bitcoinService.getTransaction(txid);

      // Create transaction entity
      const transactionEntity: TransactionEntity = {
        hash: transaction.txid,
        block_hash: blockHash,
        block_height: blockHeight,
        fee_sats: transaction.fee,
        size: transaction.size,
        weight: transaction.weight,
        version: transaction.version,
        locktime: transaction.locktime,
        input_count: transaction.vin.length,
        output_count: transaction.vout.length,
        has_op_return: false, // Will be updated if OP_RETURN is found
        confirmation_time: transaction.status.block_time,
      };

      // Check for OP_RETURN data
      const opReturnData = this.bitcoinService.extractOpReturnData(transaction);

      if (opReturnData) {
        transactionEntity.has_op_return = true;

        // Save transaction with OP_RETURN flag
        await this.databaseService.saveTransaction(transactionEntity);

        // Create OP_RETURN data entity
        const opReturnEntity: OpReturnDataEntity = {
          tx_hash: transaction.txid,
          op_return_data: opReturnData.opReturnData,
          op_return_hex: opReturnData.opReturnHex,
          fee_sats: transaction.fee,
          sender_address: opReturnData.senderAddress,
          data_size: opReturnData.opReturnHex.length / 2, // Convert hex length to bytes
        };

        // Save OP_RETURN data
        await this.databaseService.saveOpReturnData(opReturnEntity);

        console.log(`Found OP_RETURN in tx ${txid}: ${opReturnData.opReturnData || opReturnData.opReturnHex.substring(0, 40)}...`);

        return true; // Indicates OP_RETURN transaction found
      } else {
        // Save regular transaction
        await this.databaseService.saveTransaction(transactionEntity);
        return false;
      }
    } catch (error) {
      console.error(`Error processing transaction ${txid}:`, error);
      // Don't throw - continue processing other transactions
      return false;
    }
  }
}

import { pool } from "../config/database";
import { BlockEntity, TransactionEntity, OpReturnDataEntity, OpReturnTransaction } from "../types/bitcoin";

export class DatabaseService {
  async getLatestBlockHeight(): Promise<number | null> {
    try {
      const [rows] = await pool.execute("SELECT MAX(height) as max_height FROM blocks");
      const result = rows as any[];
      return result[0].max_height;
    } catch (error) {
      console.error("Error fetching latest block height from DB:", error);
      throw error;
    }
  }

  async saveBlock(block: BlockEntity): Promise<void> {
    try {
      await pool.execute(
        `INSERT IGNORE INTO blocks 
         (hash, height, transaction_count, timestamp, size, weight, merkle_root, difficulty, nonce, version, previous_block_hash) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [block.hash, block.height, block.transaction_count || 0, block.timestamp, block.size || null, block.weight || null, block.merkle_root || null, block.difficulty || null, block.nonce || null, block.version || null, block.previous_block_hash || null]
      );
    } catch (error) {
      console.error(`Error saving block ${block.height}:`, error);
      throw error;
    }
  }

  async saveTransaction(transaction: TransactionEntity): Promise<void> {
    try {
      await pool.execute(
        `INSERT IGNORE INTO transactions 
         (hash, block_hash, block_height, fee_sats, size, weight, version, locktime, 
          input_count, output_count, has_op_return, confirmation_time) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [transaction.hash, transaction.block_hash, transaction.block_height, transaction.fee_sats || 0, transaction.size || null, transaction.weight || null, transaction.version || null, transaction.locktime || null, transaction.input_count || null, transaction.output_count || null, transaction.has_op_return, transaction.confirmation_time || null]
      );
    } catch (error) {
      console.error(`Error saving transaction ${transaction.hash}:`, error);
      throw error;
    }
  }

  async saveOpReturnData(opReturnData: OpReturnDataEntity): Promise<void> {
    try {
      // Determine data type
      let dataType: "text" | "hex" | "binary" | "json" | "other" = "hex";
      let isUtf8Valid = false;

      if (opReturnData.op_return_data) {
        isUtf8Valid = true;

        // Try to detect if it's JSON
        try {
          JSON.parse(opReturnData.op_return_data);
          dataType = "json";
        } catch {
          // Check if it's readable text (contains mostly printable ASCII)
          const printableRatio = (opReturnData.op_return_data.match(/[\x20-\x7E]/g) || []).length / opReturnData.op_return_data.length;
          dataType = printableRatio > 0.8 ? "text" : "other";
        }
      }

      await pool.execute(
        `INSERT INTO op_return_data 
         (tx_hash, op_return_data, op_return_hex, fee_sats, sender_address, 
          data_size, data_type, is_utf8_valid) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [opReturnData.tx_hash, opReturnData.op_return_data || null, opReturnData.op_return_hex, opReturnData.fee_sats || 0, opReturnData.sender_address || null, opReturnData.data_size || opReturnData.op_return_hex.length / 2, dataType, isUtf8Valid]
      );
    } catch (error) {
      console.error(`Error saving OP_RETURN data for tx ${opReturnData.tx_hash}:`, error);
      throw error;
    }
  }

  async getOpReturnTransactions(page: number = 1, limit: number = 10) {
    try {
      const offset = (page - 1) * limit;

      const [rows] = await pool.execute(
        `SELECT * FROM op_return_transactions_view
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      const [countResult] = await pool.execute("SELECT COUNT(*) as total FROM op_return_data");

      const total = (countResult as any[])[0].total;

      return {
        transactions: rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error fetching OP_RETURN transactions:", error);
      throw error;
    }
  }

  async getStats() {
    try {
      const [statsResult] = await pool.execute("SELECT * FROM op_return_stats_view");
      const [blocksResult] = await pool.execute("SELECT COUNT(*) as total_blocks FROM blocks");

      const stats = (statsResult as any[])[0];
      const blocks = (blocksResult as any[])[0];

      return {
        totalTransactions: stats?.total_op_return_transactions || 0,
        totalFees: stats?.total_fees_paid || 0,
        averageFee: Math.round(stats?.average_fee || 0),
        totalBlocks: blocks?.total_blocks || 0,
        firstBlock: stats?.first_block || 0,
        latestBlock: stats?.latest_block || 0,
        totalDataSize: stats?.total_data_size || 0,
        averageDataSize: Math.round(stats?.average_data_size || 0),
        blocksWithOpReturn: stats?.blocks_with_op_return || 0,
        textDataCount: stats?.text_data_count || 0,
        hexDataCount: stats?.hex_data_count || 0,
        binaryDataCount: stats?.binary_data_count || 0,
        jsonDataCount: stats?.json_data_count || 0,
      };
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw error;
    }
  }

  async getBlockInfo(height: number) {
    try {
      const [blockResult] = await pool.execute("SELECT * FROM blocks WHERE height = ?", [height]);

      const [txCountResult] = await pool.execute("SELECT COUNT(*) as op_return_count FROM transactions WHERE block_height = ? AND has_op_return = TRUE", [height]);

      const blocks = blockResult as any[];
      const txCount = (txCountResult as any[])[0];

      if (blocks.length === 0) {
        return null;
      }

      return {
        ...blocks[0],
        op_return_count: txCount.op_return_count,
      };
    } catch (error) {
      console.error(`Error fetching block info for height ${height}:`, error);
      throw error;
    }
  }

  async searchOpReturnData(searchTerm: string, page: number = 1, limit: number = 10) {
    try {
      const offset = (page - 1) * limit;

      const [rows] = await pool.execute(
        `SELECT * FROM op_return_transactions_view 
         WHERE op_return_data LIKE ? OR op_return_hex LIKE ? OR tx_hash LIKE ?
         ORDER BY block_height DESC, created_at DESC
         LIMIT ? OFFSET ?`,
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, limit, offset]
      );

      const [countResult] = await pool.execute(
        `SELECT COUNT(*) as total FROM op_return_transactions_view 
         WHERE op_return_data LIKE ? OR op_return_hex LIKE ? OR tx_hash LIKE ?`,
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
      );

      const total = (countResult as any[])[0].total;

      return {
        transactions: rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error searching OP_RETURN data:", error);
      throw error;
    }
  }
}

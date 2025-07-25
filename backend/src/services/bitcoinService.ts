import axios from "axios";
import { Block, Transaction, OpReturnExtractionResult } from "../types/bitcoin";

const ESPLORA_BASE_URL = process.env.ESPLORA_BASE_URL || "https://blockstream.info/api";

export class BitcoinService {
  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getBlockHash(height: number): Promise<string> {
    try {
      const response = await axios.get(`${ESPLORA_BASE_URL}/block-height/${height}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching block hash for height ${height}:`, error);
      throw error;
    }
  }

  async getBlock(hash: string): Promise<Block> {
    try {
      const response = await axios.get(`${ESPLORA_BASE_URL}/block/${hash}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching block ${hash}:`, error);
      throw error;
    }
  }

  async getBlockTransactions(hash: string): Promise<string[]> {
    try {
      const response = await axios.get(`${ESPLORA_BASE_URL}/block/${hash}/txids`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching block transactions for ${hash}:`, error);
      throw error;
    }
  }

  async getTransaction(txid: string): Promise<Transaction> {
    try {
      // Add delay to avoid rate limiting
      await this.delay(100);
      const response = await axios.get(`${ESPLORA_BASE_URL}/tx/${txid}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching transaction ${txid}:`, error);
      throw error;
    }
  }

  async getLatestBlockHeight(): Promise<number> {
    try {
      const response = await axios.get(`${ESPLORA_BASE_URL}/blocks/tip/height`);
      return response.data;
    } catch (error) {
      console.error("Error fetching latest block height:", error);
      throw error;
    }
  }

  extractOpReturnData(transaction: Transaction): OpReturnExtractionResult | null {
    // Find OP_RETURN output
    const opReturnOutput = transaction.vout.find((output) => output.scriptpubkey_type === "op_return" || output.scriptpubkey_asm.startsWith("OP_RETURN"));

    if (!opReturnOutput) {
      return null;
    }

    // Extract OP_RETURN data from scriptpubkey
    const scriptHex = opReturnOutput.scriptpubkey;
    let opReturnHex = "";
    let opReturnData = "";

    if (scriptHex.startsWith("6a")) {
      // OP_RETURN opcode is 0x6a
      // Skip OP_RETURN opcode and length byte(s)
      const dataStartIndex = 4; // Skip '6a' (OP_RETURN) and length byte
      opReturnHex = scriptHex.substring(dataStartIndex);

      // Try to decode as UTF-8
      try {
        const buffer = Buffer.from(opReturnHex, "hex");
        opReturnData = buffer.toString("utf8");
        // Check if it contains valid UTF-8 characters
        if (buffer.toString("utf8") !== buffer.toString("binary")) {
          opReturnData = opReturnHex; // Keep as hex if not valid UTF-8
        }
      } catch {
        opReturnData = opReturnHex;
      }
    }

    // Try to get sender address from first input
    let senderAddress: string | undefined;
    if (transaction.vin.length > 0 && transaction.vin[0].prevout) {
      senderAddress = transaction.vin[0].prevout.scriptpubkey_address;
    }

    return {
      blockHeight: transaction.status.block_height!,
      txid: transaction.txid,
      opReturnData: opReturnData || undefined,
      opReturnHex,
      feeSats: transaction.fee,
      senderAddress,
    };
  }
}

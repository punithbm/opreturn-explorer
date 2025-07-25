export interface Block {
  id: string;
  height: number;
  version: number;
  timestamp: number;
  tx_count: number;
  size: number;
  weight: number;
  merkle_root: string;
  previousblockhash?: string;
  mediantime: number;
  nonce: number;
  bits: number;
  difficulty: number;
}

export interface Transaction {
  txid: string;
  version: number;
  locktime: number;
  vin: TransactionInput[];
  vout: TransactionOutput[];
  size: number;
  weight: number;
  fee: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
}

export interface TransactionInput {
  txid: string;
  vout: number;
  prevout?: {
    scriptpubkey: string;
    scriptpubkey_asm: string;
    scriptpubkey_type: string;
    scriptpubkey_address?: string;
    value: number;
  };
  scriptsig: string;
  scriptsig_asm: string;
  witness?: string[];
  is_coinbase: boolean;
  sequence: number;
}

export interface TransactionOutput {
  scriptpubkey: string;
  scriptpubkey_asm: string;
  scriptpubkey_type: string;
  scriptpubkey_address?: string;
  value: number;
}

// For BitcoinService extraction result
export interface OpReturnExtractionResult {
  blockHeight: number;
  txid: string;
  opReturnData?: string;
  opReturnHex: string;
  feeSats: number;
  senderAddress?: string;
}

// Database entities
export interface BlockEntity {
  id?: number;
  hash: string;
  height: number;
  transaction_count: number;
  timestamp: number;
  size?: number;
  weight?: number;
  merkle_root?: string;
  difficulty?: number;
  nonce?: number;
  version?: number;
  previous_block_hash?: string;
}

export interface TransactionEntity {
  id?: number;
  hash: string;
  block_hash: string;
  block_height: number;
  fee_sats: number;
  size?: number;
  weight?: number;
  version?: number;
  locktime?: number;
  input_count?: number;
  output_count?: number;
  has_op_return: boolean;
  confirmation_time?: number;
}

export interface OpReturnDataEntity {
  id?: number;
  tx_hash: string;
  op_return_data?: string;
  op_return_hex: string;
  fee_sats: number;
  sender_address?: string;
  data_size?: number;
  data_type?: "text" | "hex" | "binary" | "json" | "other";
  is_utf8_valid?: boolean;
}

// For API responses
export interface OpReturnTransaction {
  id: number;
  tx_hash: string;
  block_hash: string;
  block_height: number;
  block_timestamp: number;
  op_return_data?: string;
  op_return_hex: string;
  fee_sats: number;
  sender_address?: string;
  data_size?: number;
  data_type?: string;
  is_utf8_valid?: boolean;
  tx_size?: number;
  tx_weight?: number;
  created_at: string;
}

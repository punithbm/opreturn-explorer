export interface OpReturnTransaction {
  block_height: number;
  txid: string;
  op_return_data?: string;
  op_return_hex: string;
  fee_sats: number;
  sender_address?: string;
  created_at: string;
  block_hash: string;
  block_timestamp: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Stats {
  totalTransactions: number;
  totalFees: number;
  averageFee: number;
  totalBlocks: number;
  firstBlock: number;
  latestBlock: number;
}

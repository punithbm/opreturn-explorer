import axios from "axios";
import { ApiResponse, OpReturnTransaction, Stats } from "../types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export async function fetchOpReturnTransactions(page: number = 1, limit: number = 10): Promise<ApiResponse<OpReturnTransaction[]>> {
  const response = await api.get(`/api/opreturns?page=${page}&limit=${limit}`);
  return response.data;
}

export async function fetchStats(): Promise<ApiResponse<Stats>> {
  const response = await api.get("/api/stats");
  return response.data;
}

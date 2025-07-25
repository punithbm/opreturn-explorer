"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Copy } from "lucide-react";
import { OpReturnTransaction } from "../types/api";
import { fetchOpReturnTransactions } from "../lib/api";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export default function OpReturnTable() {
  const [transactions, setTransactions] = useState<OpReturnTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const loadTransactions = async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await fetchOpReturnTransactions(pageNum, 10);
      setTransactions(response.data);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
        setTotal(response.pagination.total);
      }
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions(page);
  }, [page]);

  const formatAddress = (address?: string) => {
    if (!address) return "N/A";
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const formatTxid = (txid: string) => {
    return `${txid.slice(0, 8)}...${txid.slice(-8)}`;
  };

  const formatOpReturnData = (data?: string, hex?: string) => {
    if (!data && !hex) return "N/A";
    const displayData = data || hex || "";
    if (displayData.length > 50) {
      return `${displayData.slice(0, 50)}...`;
    }
    return displayData;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatSats = (sats: number) => {
    return sats.toLocaleString();
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Latest OP_RETURN Transactions</CardTitle>
          <span className="text-sm text-muted-foreground">{total.toLocaleString()} total</span>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Block</TableHead>
              <TableHead>TXID</TableHead>
              <TableHead>OP_RETURN Data</TableHead>
              <TableHead>Fee (sats)</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx, index) => (
              <TableRow key={`${tx.txid}-${index}`}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="text-primary font-mono text-sm">{tx.block_height.toLocaleString()}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(tx.block_height.toString())}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400 font-mono text-sm">{formatTxid(tx.txid)}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(tx.txid)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                      <a href={`https://blockstream.info/tx/${tx.txid}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs flex items-center space-x-2">
                    <span className="font-mono text-sm break-all">{formatOpReturnData(tx.op_return_data, tx.op_return_hex)}</span>
                    {(tx.op_return_data || tx.op_return_hex) && (
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(tx.op_return_data || tx.op_return_hex || "")}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-yellow-400 font-mono text-sm">{formatSats(tx.fee_sats)}</span>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground font-mono text-sm">{formatAddress(tx.sender_address)}</span>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm">{formatTime(tx.block_timestamp)}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

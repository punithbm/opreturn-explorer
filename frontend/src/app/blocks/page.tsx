"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ExternalLink, Copy, Clock, Hash } from "lucide-react";

// Mock data for blocks - replace with real API data
const mockBlocks = [
  {
    height: 827845,
    hash: "0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5",
    timestamp: 1704067200,
    txCount: 3245,
    opReturnCount: 15,
    size: "1.2 MB",
  },
  {
    height: 827844,
    hash: "00000000000000000002c3f4b8f5e8a1d2c3b4a5c6d7e8f9a0b1c2d3e4f5a6b7",
    timestamp: 1704066600,
    txCount: 2987,
    opReturnCount: 8,
    size: "1.1 MB",
  },
  {
    height: 827843,
    hash: "00000000000000000003a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2",
    timestamp: 1704066000,
    txCount: 3456,
    opReturnCount: 22,
    size: "1.3 MB",
  },
];

export default function BlocksPage() {
  const [blocks, setBlocks] = useState(mockBlocks);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 12)}...${hash.slice(-12)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Blocks</h1>
        <p className="text-muted-foreground mt-2">Browse Bitcoin blocks and their OP_RETURN transaction statistics</p>
      </div>

      {/* Blocks Grid */}
      <div className="grid gap-6">
        {blocks.map((block) => (
          <Card key={block.height} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <Hash className="w-5 h-5" />
                  Block {block.height.toLocaleString()}
                </CardTitle>
                <Badge variant="secondary" className="font-mono">
                  {block.opReturnCount} OP_RETURN txs
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Block Info */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Block Hash</label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-sm">{formatHash(block.hash)}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(block.hash)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                        <a href={`https://blockstream.info/block/${block.hash}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{formatTime(block.timestamp)}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Transactions</label>
                    <div className="text-2xl font-bold text-primary mt-1">{block.txCount.toLocaleString()}</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Block Size</label>
                    <div className="text-lg font-semibold mt-1">{block.size}</div>
                  </div>
                </div>

                {/* OP_RETURN Stats */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">OP_RETURN Transactions</label>
                    <div className="text-2xl font-bold text-green-400 mt-1">{block.opReturnCount}</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">OP_RETURN Percentage</label>
                    <div className="text-lg font-semibold mt-1">{((block.opReturnCount / block.txCount) * 100).toFixed(2)}%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Copy, Download, Eye, EyeOff } from "lucide-react";

// Mock raw data
const mockRawData = [
  {
    txid: "7d5e3f8c9b2a1d4e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9",
    blockHeight: 827845,
    rawHex: "6a4c4f4f524554555220474554205045504520544f4b454e20444154414241534520444154414241534520444154414241534520444154414241534520444154414241534520444154414241534520444154414241534520444154414241534520444154414241534520",
    decodedText: "ORETURN GET PEPE TOKEN DATABASE DATABASE DATABASE DATABASE DATABASE DATABASE DATABASE DATABASE DATABASE DATABASE DATABASE",
    size: 79,
  },
  {
    txid: "8e6f4a9d0c3b2e5f8a1b4c7d0e3f6a9b2c5d8e1f4a7b0c3d6e9f2a5b8c1d4e7",
    blockHeight: 827844,
    rawHex: "6a254920616d2053617473686921204920616d20746865206372656174206f6620426974636f696e21",
    decodedText: "I am Satoshi! I am the creator of Bitcoin!",
    size: 37,
  },
  {
    txid: "9f7a5b8e1d4c7f0a3b6c9e2f5a8b1d4c7e0f3a6b9c2d5e8f1a4b7c0d3e6f9a2b5",
    blockHeight: 827843,
    rawHex: "6a1568656c6c6f20776f726c642066726f6d20626974636f696e",
    decodedText: "hello world from bitcoin",
    size: 21,
  },
];

export default function RawDataPage() {
  const [showDecoded, setShowDecoded] = useState<Record<string, boolean>>({});

  const toggleDecoded = (txid: string) => {
    setShowDecoded((prev) => ({
      ...prev,
      [txid]: !prev[txid],
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportData = () => {
    const data = JSON.stringify(mockRawData, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "op_return_raw_data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Raw Data</h1>
          <p className="text-muted-foreground mt-2">Inspect raw OP_RETURN data in hex format and decoded text</p>
        </div>
        <Button onClick={exportData} className="gap-2">
          <Download className="w-4 h-4" />
          Export JSON
        </Button>
      </div>

      {/* Data Cards */}
      <div className="space-y-6">
        {mockRawData.map((item) => (
          <Card key={item.txid} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-mono text-lg">
                  {item.txid.slice(0, 16)}...{item.txid.slice(-16)}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Block {item.blockHeight.toLocaleString()}</Badge>
                  <Badge variant="outline">{item.size} bytes</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Raw Hex Data */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Raw Hex Data</label>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(item.rawHex)} className="gap-2">
                    <Copy className="w-3 h-3" />
                    Copy
                  </Button>
                </div>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm break-all">{item.rawHex}</div>
              </div>

              {/* Decoded Text */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Decoded Text</label>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleDecoded(item.txid)} className="gap-2">
                      {showDecoded[item.txid] ? (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3" />
                          Show
                        </>
                      )}
                    </Button>
                    {showDecoded[item.txid] && (
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(item.decodedText)} className="gap-2">
                        <Copy className="w-3 h-3" />
                        Copy
                      </Button>
                    )}
                  </div>
                </div>
                {showDecoded[item.txid] ? <div className="bg-muted p-4 rounded-lg font-mono text-sm">{item.decodedText}</div> : <div className="bg-muted p-4 rounded-lg text-muted-foreground text-sm italic">Click "Show" to reveal decoded text content</div>}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Transaction ID</label>
                  <div className="font-mono text-xs mt-1">
                    {item.txid.slice(0, 8)}...{item.txid.slice(-8)}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Block Height</label>
                  <div className="font-mono text-xs mt-1">{item.blockHeight}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Data Size</label>
                  <div className="font-mono text-xs mt-1">{item.size} bytes</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Type</label>
                  <div className="text-xs mt-1">Text Data</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

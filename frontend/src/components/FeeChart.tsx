"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// Mock data for fee analysis - you can replace this with real data from your API
const mockFeeData = [
  { range: "0-100", count: 450, avgFee: 85 },
  { range: "101-500", count: 1200, avgFee: 280 },
  { range: "501-1000", count: 800, avgFee: 720 },
  { range: "1001-5000", count: 340, avgFee: 2100 },
  { range: "5000+", count: 120, avgFee: 8500 },
];

export default function FeeChart() {
  const [data, setData] = useState(mockFeeData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>OP_RETURN Fee Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--popover-foreground))",
                }}
                formatter={(value, name) => [name === "count" ? `${value} transactions` : `${value} sats`, name === "count" ? "Transaction Count" : "Average Fee"]}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" name="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{data.reduce((sum, item) => sum + item.count, 0).toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{Math.round(data.reduce((sum, item) => sum + item.avgFee * item.count, 0) / data.reduce((sum, item) => sum + item.count, 0)).toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Avg Fee (sats)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{Math.min(...data.map((item) => item.avgFee)).toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Min Fee (sats)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{Math.max(...data.map((item) => item.avgFee)).toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Max Fee (sats)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

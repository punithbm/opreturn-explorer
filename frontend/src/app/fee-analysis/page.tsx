"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import FeeChart from "../../components/FeeChart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from "recharts";

// Mock data for fee analysis
const feeOverTime = [
  { date: "2024-01", avgFee: 2100, minFee: 500, maxFee: 15000 },
  { date: "2024-02", avgFee: 2450, minFee: 600, maxFee: 18000 },
  { date: "2024-03", avgFee: 1980, minFee: 450, maxFee: 12000 },
  { date: "2024-04", avgFee: 2800, minFee: 700, maxFee: 22000 },
  { date: "2024-05", avgFee: 3200, minFee: 800, maxFee: 25000 },
  { date: "2024-06", avgFee: 2650, minFee: 650, maxFee: 20000 },
];

const feeSizeCorrelation = [
  { size: 20, fee: 1200 },
  { size: 35, fee: 1800 },
  { size: 50, fee: 2400 },
  { size: 65, fee: 3000 },
  { size: 80, fee: 3600 },
  { size: 95, fee: 4200 },
];

export default function FeeAnalysisPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Fee Analysis</h1>
        <p className="text-muted-foreground mt-2">Deep dive into OP_RETURN transaction fees and their patterns</p>
      </div>

      {/* Fee Distribution */}
      <FeeChart />

      {/* Fee Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fee Trends Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={feeOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`${value} sats`, ""]}
                  />
                  <Line type="monotone" dataKey="avgFee" stroke="#22c55e" strokeWidth={2} name="Average Fee" />
                  <Line type="monotone" dataKey="minFee" stroke="#3b82f6" strokeWidth={1} name="Min Fee" />
                  <Line type="monotone" dataKey="maxFee" stroke="#ef4444" strokeWidth={1} name="Max Fee" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fee vs Data Size Correlation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={feeSizeCorrelation}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="size" stroke="hsl(var(--muted-foreground))" fontSize={12} name="Data Size (bytes)" />
                  <YAxis dataKey="fee" stroke="hsl(var(--muted-foreground))" fontSize={12} name="Fee (sats)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value, name) => [name === "fee" ? `${value} sats` : `${value} bytes`, name === "fee" ? "Fee" : "Data Size"]}
                  />
                  <Scatter dataKey="fee" fill="hsl(var(--primary))" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fee Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">42.5</div>
              <div className="text-sm text-muted-foreground">sats per byte average</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peak Fee Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">14:00-16:00</div>
              <div className="text-sm text-muted-foreground">UTC daily peak</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fee Volatility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">±18.5%</div>
              <div className="text-sm text-muted-foreground">30-day variance</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

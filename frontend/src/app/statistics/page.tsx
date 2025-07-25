"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import StatsCard from "../../components/StatsCard";
import FeeChart from "../../components/FeeChart";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Activity, DollarSign, Database } from "lucide-react";

// Mock data for charts
const timeSeriesData = [
  { date: "2024-01", count: 1200, fees: 45000 },
  { date: "2024-02", count: 1350, fees: 52000 },
  { date: "2024-03", count: 1180, fees: 41000 },
  { date: "2024-04", count: 1420, fees: 58000 },
  { date: "2024-05", count: 1650, fees: 67000 },
  { date: "2024-06", count: 1890, fees: 75000 },
];

const dataTypeDistribution = [
  { name: "Text Data", value: 45, color: "#22c55e" },
  { name: "Hex Data", value: 35, color: "#3b82f6" },
  { name: "Binary", value: 15, color: "#f59e0b" },
  { name: "Other", value: 5, color: "#ef4444" },
];

export default function StatisticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Statistics</h1>
        <p className="text-muted-foreground mt-2">Comprehensive analytics of OP_RETURN usage on the Bitcoin network</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Growth Rate" value="+24.5%" subtitle="Month over month" icon={<TrendingUp className="w-6 h-6" />} trend={{ value: "+12.5%", isPositive: true }} />
        <StatsCard title="Daily Average" value="127" subtitle="OP_RETURN transactions" icon={<Activity className="w-6 h-6" />} trend={{ value: "+8.2%", isPositive: true }} />
        <StatsCard title="Avg Fee Per TX" value="2,450 sats" subtitle="$0.67 USD" icon={<DollarSign className="w-6 h-6" />} trend={{ value: "-3.1%", isPositive: false }} />
        <StatsCard title="Data Size" value="15.2 MB" subtitle="Total embedded data" icon={<Database className="w-6 h-6" />} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Series Chart */}
        <Card>
          <CardHeader>
            <CardTitle>OP_RETURN Transactions Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Data Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Data Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dataTypeDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={5} dataKey="value">
                    {dataTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {dataTypeDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Analysis */}
      <FeeChart />
    </div>
  );
}

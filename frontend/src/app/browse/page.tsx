"use client";

import { useState, useEffect } from "react";
import StatsCard from "../../components/StatsCard";
import OpReturnTable from "../../components/OpReturnTable";
import { Bitcoin, Database, TrendingUp, DollarSign } from "lucide-react";
import { fetchStats } from "../../lib/api";
import { Stats } from "../../types/api";

export default function BrowsePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetchStats();
        setStats(response.data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();

    // Refresh stats every 60 seconds
    const interval = setInterval(loadStats, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Browse OP_RETURN Data</h1>
        <p className="text-muted-foreground mt-2">Explore Bitcoin OP_RETURN transactions and discover embedded data patterns</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Loading skeleton
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-card border rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </div>
          ))
        ) : (
          <>
            <StatsCard title="Total OP_RETURN Txs" value={stats?.totalTransactions || 0} icon={<Bitcoin className="w-6 h-6" />} trend={{ value: "+12.5%", isPositive: true }} />
            <StatsCard title="Total Fees Paid" value={`${((stats?.totalFees || 0) / 100000000).toFixed(4)} BTC`} subtitle={`${(stats?.totalFees || 0).toLocaleString()} sats`} icon={<DollarSign className="w-6 h-6" />} trend={{ value: "+8.2%", isPositive: true }} />
            <StatsCard title="Average Fee" value={`${stats?.averageFee || 0} sats`} icon={<TrendingUp className="w-6 h-6" />} trend={{ value: "-3.1%", isPositive: false }} />
            <StatsCard title="Blocks Scanned" value={stats?.totalBlocks || 0} subtitle={`From block ${stats?.firstBlock?.toLocaleString() || 0}`} icon={<Database className="w-6 h-6" />} />
          </>
        )}
      </div>

      {/* Transactions Table */}
      <OpReturnTable />
    </div>
  );
}

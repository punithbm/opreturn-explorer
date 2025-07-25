"use client";

import { Search, Activity, Database, BarChart3, Bitcoin, TrendingUp, FileText } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { id: "browse", label: "Browse", icon: Search, href: "/browse" },
    { id: "transactions", label: "OP_RETURN Txs", icon: Activity, href: "/transactions" },
    { id: "blocks", label: "Blocks", icon: Database, href: "/blocks" },
    { id: "statistics", label: "Statistics", icon: BarChart3, href: "/statistics" },
    { id: "fee-analysis", label: "Fee Analysis", icon: TrendingUp, href: "/fee-analysis" },
    { id: "raw-data", label: "Raw Data", icon: FileText, href: "/raw-data" },
  ];

  return (
    <div className="w-64 border-r bg-card h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <Link href="/browse" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Bitcoin className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Bitcoin Bomber 💣</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.id}>
                <Button variant={isActive ? "default" : "ghost"} className={cn("w-full justify-start", isActive && "bg-primary/10 text-primary border border-primary/20")} asChild>
                  <Link href={item.href}>
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Link>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground">Syncing blocks...</span>
        </div>
      </div>
    </div>
  );
}

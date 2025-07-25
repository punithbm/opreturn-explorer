import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export default function StatsCard({ title, value, subtitle, icon, trend, className = "" }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        {icon && <div className="text-primary">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        {trend && (
          <div className="flex items-center pt-1">
            <span className={`text-xs font-medium ${trend.isPositive ? "text-emerald-500" : "text-red-500"}`}>
              {trend.isPositive ? "↗" : "↘"} {trend.value}
            </span>
            <span className="text-muted-foreground text-xs ml-2">vs last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

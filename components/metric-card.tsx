import type React from "react"
import { Card } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  trend: "up" | "down"
}

export function MetricCard({ title, value, change, icon, trend }: MetricCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${trend === "up" ? "text-chart-1" : "text-chart-5"}`}
        >
          {trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>
    </Card>
  )
}

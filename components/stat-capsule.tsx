import type React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatCapsuleProps {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  trend: "up" | "down"
}

export function StatCapsule({ title, value, change, icon, trend }: StatCapsuleProps) {
  return (
    <div className="glass-card p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-white/[0.08] transition-colors">
      <div className="flex items-center gap-1.5 md:gap-2 mb-2">
        <div className="text-cyan-400">{icon}</div>
        <span className="text-[10px] md:text-xs text-white/40 font-medium">{title}</span>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-lg md:text-2xl font-bold text-white">{value}</div>
        <div
          className={`flex items-center gap-0.5 md:gap-1 text-[10px] md:text-xs font-medium ${trend === "up" ? "text-green-400" : "text-red-400"}`}
        >
          {trend === "up" ? (
            <TrendingUp className="h-2.5 md:h-3 w-2.5 md:w-3" />
          ) : (
            <TrendingDown className="h-2.5 md:h-3 w-2.5 md:w-3" />
          )}
          <span className="hidden md:inline">{change}</span>
        </div>
      </div>
    </div>
  )
}

export default StatCapsule

"use client"

import { LineChart, Line, ResponsiveContainer } from "recharts"

interface MiniSparklineProps {
  data: any[]
  dataKeys: string[]
  colors: string[]
}

export function MiniSparkline({ data, dataKeys, colors }: MiniSparklineProps) {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index]}
              strokeWidth={2}
              dot={false}
              animationDuration={1000}
              style={{
                filter: `drop-shadow(0 0 8px ${colors[index]}40)`,
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MiniSparkline

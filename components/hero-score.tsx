"use client"

import { useEffect, useState } from "react"

interface HeroScoreProps {
  score: number
}

export function HeroScore({ score }: HeroScoreProps) {
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = score / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= score) {
        setDisplayScore(score)
        clearInterval(timer)
      } else {
        setDisplayScore(Math.floor(current * 10) / 10)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [score])

  return (
    <div className="glass-card p-4 md:p-8 rounded-2xl md:rounded-3xl relative overflow-hidden h-full flex items-center justify-center">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 md:w-64 h-48 md:h-64 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 md:w-48 h-36 md:h-48 rounded-full bg-gradient-to-r from-blue-400/30 to-cyan-500/30 blur-2xl animate-pulse-slow" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative">
          <div className="absolute inset-0 -m-6 md:-m-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20 blur-2xl animate-pulse-slow" />

          <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-500/10 border-2 border-cyan-400/30 flex items-center justify-center backdrop-blur-sm">
            <div className="absolute inset-3 md:inset-4 rounded-full bg-gradient-to-br from-cyan-400/5 to-blue-500/5 border border-cyan-400/20" />

            <div className="relative text-center">
              <div className="text-4xl md:text-6xl font-bold text-white mb-1 animate-tick">
                {displayScore.toFixed(1)}
              </div>
              <div className="text-xs md:text-sm text-white/40 font-medium">/ 100</div>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-6 text-center">
          <p className="text-base md:text-lg font-semibold text-white mb-1">Base Activity Score</p>
          <p className="text-xs md:text-sm text-white/40">Network health is excellent</p>
        </div>
      </div>
    </div>
  )
}

export default HeroScore

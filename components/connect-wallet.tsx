"use client"

import { useAccount, useConnect } from "wagmi"
import { useState } from "react"
import { Wallet } from "lucide-react"

export function ConnectWallet() {
  const { isConnected, address } = useAccount()
  const { connect, connectors } = useConnect()
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = async () => {
    try {
      setIsLoading(true)
      if (connectors.length > 0) {
        connect({ connector: connectors[0] })
      }
    } catch (error) {
      console.error("Connection error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <div className="flex items-center gap-2 text-xs text-white/60">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Connected
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading}
      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      <Wallet className="w-4 h-4" />
      {isLoading ? "Connecting..." : "Connect Wallet"}
    </button>
  )
}

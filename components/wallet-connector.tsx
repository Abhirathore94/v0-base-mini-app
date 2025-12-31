"use client"

import { useState } from "react"
import { Wallet, X } from "lucide-react"

interface WalletProvider {
  id: string
  name: string
  icon: string
  detect: () => boolean
  connect: () => Promise<string[]>
}

const walletProviders: WalletProvider[] = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "🦊",
    detect: () => typeof window !== "undefined" && window.ethereum?.isMetaMask,
    connect: async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      return accounts
    },
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "🔷",
    detect: () => typeof window !== "undefined" && window.ethereum?.isCoinbaseWallet,
    connect: async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      return accounts
    },
  },
  {
    id: "okx",
    name: "OKX Wallet",
    icon: "⬜",
    detect: () => typeof window !== "undefined" && (window as any).okxwallet,
    connect: async () => {
      const okxwallet = (window as any).okxwallet
      const accounts = await okxwallet.request({
        method: "eth_requestAccounts",
      })
      return accounts
    },
  },
  {
    id: "rabby",
    name: "Rabby Wallet",
    icon: "🐰",
    detect: () => typeof window !== "undefined" && (window as any).rabby,
    connect: async () => {
      const rabby = (window as any).rabby
      const accounts = await rabby.request({
        method: "eth_requestAccounts",
      })
      return accounts
    },
  },
  {
    id: "farcaster",
    name: "Farcaster Wallet",
    icon: "Ⓜ️",
    detect: () => typeof window !== "undefined" && (window as any).farcaster,
    connect: async () => {
      const farcaster = (window as any).farcaster
      const accounts = await farcaster.request({
        method: "eth_requestAccounts",
      })
      return accounts
    },
  },
]

interface WalletConnectorProps {
  onConnect: (wallet: { provider: string; address: string }) => void
  onClose?: () => void
}

export function WalletConnector({ onConnect, onClose }: WalletConnectorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const availableWallets = walletProviders.filter((w) => w.detect())

  const handleConnect = async (provider: WalletProvider) => {
    setIsLoading(true)
    setError("")

    try {
      const accounts = await provider.connect()
      if (accounts && accounts.length > 0) {
        onConnect({
          provider: provider.id,
          address: accounts[0],
        })
      }
    } catch (err: any) {
      setError(err.message || `Failed to connect ${provider.name}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="glass-card p-8 rounded-3xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
          {onClose && (
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-3 mb-4 text-sm text-red-400">{error}</div>
        )}

        <div className="space-y-3">
          {availableWallets.length > 0 ? (
            availableWallets.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => handleConnect(wallet)}
                disabled={isLoading}
                className="w-full p-4 rounded-xl border border-white/10 hover:border-cyan-400/50 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-3 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-2xl">{wallet.icon}</span>
                <span className="flex-1 text-left font-medium">{wallet.name}</span>
                {isLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyan-400 border-t-transparent" />
                )}
              </button>
            ))
          ) : (
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 text-white/40 mx-auto mb-3" />
              <p className="text-white/60 text-sm mb-4">No web3 wallets detected</p>
              <p className="text-white/40 text-xs">
                Please install MetaMask, Coinbase Wallet, OKX Wallet, or Rabby Wallet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

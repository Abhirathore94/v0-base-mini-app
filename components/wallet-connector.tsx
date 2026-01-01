"use client"

import { useState, useEffect } from "react"
import { Wallet, X } from "lucide-react"

interface WalletProvider {
  id: string
  name: string
  icon: string
  description: string
  detect: () => boolean
  connect: () => Promise<string[]>
}

const walletProviders: WalletProvider[] = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "🦊",
    description: "Browser extension wallet",
    detect: () => {
      if (typeof window === "undefined") return false
      return !!(window.ethereum?.isMetaMask && !window.ethereum?.isCoinbaseWallet)
    },
    connect: async () => {
      if (!window.ethereum) throw new Error("MetaMask not found")
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
    description: "Coinbase extension wallet",
    detect: () => {
      if (typeof window === "undefined") return false
      return !!(window.ethereum?.isCoinbaseWallet || window.ethereum?.providers?.some?.((p: any) => p.isCoinbaseWallet))
    },
    connect: async () => {
      if (!window.ethereum) throw new Error("Coinbase Wallet not found")
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
    description: "OKX wallet extension",
    detect: () => {
      if (typeof window === "undefined") return false
      return !!(window as any).okxwallet
    },
    connect: async () => {
      const okxwallet = (window as any).okxwallet
      if (!okxwallet) throw new Error("OKX Wallet not found")
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
    description: "Rabby wallet extension",
    detect: () => {
      if (typeof window === "undefined") return false
      return !!(window as any).rabby
    },
    connect: async () => {
      const rabby = (window as any).rabby
      if (!rabby) throw new Error("Rabby Wallet not found")
      const accounts = await rabby.request({
        method: "eth_requestAccounts",
      })
      return accounts
    },
  },
  {
    id: "farcaster",
    name: "Farcaster In-App",
    icon: "Ⓜ️",
    description: "Farcaster app built-in wallet",
    detect: () => {
      if (typeof window === "undefined") return false
      return !!(
        (window as any).ethereum?.isFarcaster ||
        (window as any).farcaster ||
        navigator.userAgent?.includes?.("Farcaster")
      )
    },
    connect: async () => {
      let provider = (window as any).ethereum || (window as any).farcaster

      if (!provider && (window as any).ethereum?.isFarcaster) {
        provider = window.ethereum
      }

      if (!provider) {
        throw new Error("Farcaster wallet not available in this context")
      }

      try {
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        })
        return accounts
      } catch (err: any) {
        throw new Error(err.message || "Failed to connect Farcaster wallet")
      }
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
  const [availableWallets, setAvailableWallets] = useState<WalletProvider[]>([])

  useEffect(() => {
    const detectWallets = setTimeout(() => {
      const detected = walletProviders.filter((w) => {
        try {
          return w.detect()
        } catch {
          return false
        }
      })
      setAvailableWallets(detected)
    }, 500)

    return () => clearTimeout(detectWallets)
  }, [])

  const handleConnect = async (provider: WalletProvider) => {
    setIsLoading(true)
    setError("")

    try {
      console.log(`Attempting to connect ${provider.name}...`)
      const accounts = await provider.connect()
      if (accounts && accounts.length > 0) {
        console.log(`Successfully connected to ${provider.id}:`, accounts[0])
        onConnect({
          provider: provider.id,
          address: accounts[0],
        })
      }
    } catch (err: any) {
      console.error(`Connection error: ${err.message}`)
      setError(err.message || `Failed to connect ${provider.name}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-card p-8 rounded-3xl max-w-md w-full">
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
            <>
              {availableWallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleConnect(wallet)}
                  disabled={isLoading}
                  className="w-full p-4 rounded-xl border border-white/10 hover:border-cyan-400/50 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-3 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-2xl">{wallet.icon}</span>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm">{wallet.name}</p>
                    <p className="text-xs text-white/40">{wallet.description}</p>
                  </div>
                  {isLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyan-400 border-t-transparent" />
                  )}
                </button>
              ))}
            </>
          ) : (
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 text-white/40 mx-auto mb-3" />
              <p className="text-white/60 text-sm mb-4">No wallets detected</p>
              <div className="bg-white/5 rounded-xl p-4 text-left">
                <p className="text-white/60 text-xs mb-3 font-semibold">Supported wallets:</p>
                <ul className="text-white/40 text-xs space-y-2">
                  <li>🦊 MetaMask</li>
                  <li>🔷 Coinbase Wallet</li>
                  <li>⬜ OKX Wallet</li>
                  <li>🐰 Rabby Wallet</li>
                  <li>Ⓜ️ Farcaster In-App Wallet</li>
                </ul>
              </div>
              <p className="text-white/40 text-xs mt-4">
                If you're in Farcaster app, the wallet should appear once the app is fully loaded.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

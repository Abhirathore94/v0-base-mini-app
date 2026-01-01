"use client"

import { useState, useEffect } from "react"
import { Wallet, X } from "lucide-react"

interface WalletProvider {
  id: string
  name: string
  icon: string
  description: string
  detect: () => boolean | Promise<boolean>
  connect: () => Promise<string[]>
}

const walletProviders: WalletProvider[] = [
  {
    id: "farcaster-inapp",
    name: "Farcaster In-App",
    icon: "Ⓜ️",
    description: "Farcaster native wallet",
    detect: async () => {
      if (typeof window === "undefined") return false
      try {
        // Check if in Farcaster context via user agent
        const isFarcasterApp = /^Farcaster/.test(window.navigator?.userAgent || "")
        return isFarcasterApp
      } catch {
        return false
      }
    },
    connect: async () => {
      try {
        const { default: sdk } = await import("@farcaster/miniapp-sdk")
        const context = await sdk.context.getContext()
        const custody = context?.user?.farcasterUser?.custody_address
        if (custody) return [custody]
        throw new Error("No custody address")
      } catch (err) {
        // If SDK fails, try using ethereum provider
        if (window.ethereum) {
          try {
            const accounts = await window.ethereum.request({
              method: "eth_requestAccounts",
            })
            return accounts
          } catch {
            throw new Error("Failed to get Farcaster wallet")
          }
        }
        throw new Error("Farcaster wallet not available")
      }
    },
  },
  {
    id: "base-inapp",
    name: "Base In-App",
    icon: "⚡",
    description: "Base app native wallet",
    detect: () => {
      if (typeof window === "undefined") return false
      const isBase = /base/i.test(window.navigator?.userAgent || "")
      return isBase && !!window.ethereum
    },
    connect: async () => {
      try {
        if (!window.ethereum) throw new Error("No provider found")
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        return accounts
      } catch (err: any) {
        throw new Error(err.message || "Failed to connect Base wallet")
      }
    },
  },
  {
    id: "metamask",
    name: "MetaMask",
    icon: "🦊",
    description: "Browser extension or mobile app",
    detect: () => {
      if (typeof window === "undefined") return false
      return !!(
        window.ethereum?.isMetaMask &&
        !window.ethereum?.isCoinbaseWallet &&
        !window.ethereum?.isOKExWallet &&
        !window.ethereum?.isRabby
      )
    },
    connect: async () => {
      try {
        if (!window.ethereum?.isMetaMask) {
          throw new Error("MetaMask not found")
        }
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        return accounts
      } catch (err: any) {
        throw new Error(err.message || "Failed to connect MetaMask")
      }
    },
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "🔷",
    description: "Coinbase web3 wallet",
    detect: () => {
      if (typeof window === "undefined") return false
      return !!window.ethereum?.isCoinbaseWallet || !!window.ethereum?.providers?.some?.((p: any) => p.isCoinbaseWallet)
    },
    connect: async () => {
      try {
        if (!window.ethereum) throw new Error("Coinbase Wallet not found")
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        return accounts
      } catch (err: any) {
        throw new Error(err.message || "Failed to connect Coinbase Wallet")
      }
    },
  },
  {
    id: "okx",
    name: "OKX Wallet",
    icon: "⬜",
    description: "OKX web3 wallet",
    detect: () => {
      if (typeof window === "undefined") return false
      return !!(window as any).okxwallet || window.ethereum?.isOKExWallet
    },
    connect: async () => {
      try {
        const provider = (window as any).okxwallet || window.ethereum
        if (!provider) throw new Error("OKX Wallet not found")
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        })
        return accounts
      } catch (err: any) {
        throw new Error(err.message || "Failed to connect OKX Wallet")
      }
    },
  },
  {
    id: "rabby",
    name: "Rabby Wallet",
    icon: "🐰",
    description: "Rabby web3 wallet",
    detect: () => {
      if (typeof window === "undefined") return false
      return !!(window as any).rabby || window.ethereum?.isRabby
    },
    connect: async () => {
      try {
        const provider = (window as any).rabby || window.ethereum
        if (!provider) throw new Error("Rabby Wallet not found")
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        })
        return accounts
      } catch (err: any) {
        throw new Error(err.message || "Failed to connect Rabby Wallet")
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
  const [isDetecting, setIsDetecting] = useState(true)

  useEffect(() => {
    let mounted = true

    const detectWallets = async () => {
      try {
        const results: WalletProvider[] = []

        // Check each wallet sequentially to ensure proper detection
        for (const wallet of walletProviders) {
          try {
            const available = await wallet.detect()
            if (available && mounted) {
              results.push(wallet)
            }
          } catch (err) {
            // Silent fail for individual wallet detection
          }
        }

        if (mounted) {
          setAvailableWallets(results)
        }
      } catch (err) {
        console.error("[v0] Error detecting wallets:", err)
      } finally {
        if (mounted) {
          setIsDetecting(false)
        }
      }
    }

    // Add delay to allow window.ethereum to be injected
    const timer = setTimeout(detectWallets, 500)
    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [])

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
      console.error("[v0] Connection error:", err)
      setError(err.message || `Failed to connect ${provider.name}`)
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-card p-8 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
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
          {isDetecting ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-400 border-t-transparent mb-3" />
              <p className="text-white/60 text-sm">Detecting wallets...</p>
            </div>
          ) : availableWallets.length > 0 ? (
            <>
              {availableWallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleConnect(wallet)}
                  disabled={isLoading}
                  className="w-full p-4 rounded-xl border border-white/10 hover:border-cyan-400/50 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-3 text-white disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px]"
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
                <p className="text-white/60 text-xs mb-3 font-semibold">To use this app:</p>
                <ul className="text-white/40 text-xs space-y-2">
                  <li>📱 In Farcaster: Your wallet appears automatically</li>
                  <li>📱 In Base App: Your wallet appears automatically</li>
                  <li>🖥️ On Web: Install MetaMask, Coinbase, OKX, or Rabby</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

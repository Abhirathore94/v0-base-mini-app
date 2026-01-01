"use client"

import { useState, useEffect } from "react"
import { Wallet, X } from "lucide-react"

interface WalletConnectorProps {
  onConnect: (wallet: { provider: string; address: string }) => void
  onClose?: () => void
}

export function WalletConnector({ onConnect, onClose }: WalletConnectorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [detectingWallets, setDetectingWallets] = useState(true)
  const [hasAnyWallet, setHasAnyWallet] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      // Simple check - if window.ethereum exists, we have a wallet
      const hasWallet = typeof window !== "undefined" && !!window.ethereum
      setHasAnyWallet(hasWallet)
      setDetectingWallets(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const connectMetaMask = async () => {
    setIsLoading(true)
    setError("")

    try {
      if (!window.ethereum) {
        setError("MetaMask or Web3 wallet not found. Please install one.")
        setIsLoading(false)
        return
      }

      // Request accounts
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found")
      }

      // Switch to Base network (chainId: 8453)
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x2105" }], // 8453 in hex
        })
      } catch (switchError: any) {
        // If chain doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x2105",
                chainName: "Base",
                rpcUrls: ["https://mainnet.base.org"],
                blockExplorerUrls: ["https://basescan.org"],
                nativeCurrency: {
                  name: "Ethereum",
                  symbol: "ETH",
                  decimals: 18,
                },
              },
            ],
          })
        }
      }

      onConnect({
        provider: "web3",
        address: accounts[0],
      })
    } catch (err: any) {
      console.error("[v0] Connection error:", err)
      setError(err.message || "Failed to connect wallet")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-card p-8 rounded-3xl max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Connect Your Wallet</h2>
          {onClose && (
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors p-1">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <p className="text-white/60 text-sm mb-6">Use any Web3 wallet to view your Base network activity and score.</p>

        {error && (
          <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4 mb-6 text-sm text-red-400">{error}</div>
        )}

        {detectingWallets ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-400 border-t-transparent mb-4" />
            <p className="text-white/60 text-sm">Detecting wallets...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {hasAnyWallet ? (
              <>
                <button
                  onClick={connectMetaMask}
                  disabled={isLoading}
                  className="w-full p-4 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all flex items-center gap-3 text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium min-h-[56px]"
                >
                  <span className="text-2xl">🦊</span>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">MetaMask / Wallet</p>
                    <p className="text-xs text-white/60">Browser or mobile</p>
                  </div>
                  {isLoading && (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-cyan-400 border-t-transparent" />
                  )}
                </button>

                <div className="text-center text-xs text-white/40 py-2">or try another connected wallet</div>

                <button
                  onClick={connectMetaMask}
                  disabled={isLoading}
                  className="w-full p-4 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-3 text-white disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px]"
                >
                  <span className="text-2xl">🔷</span>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">Any Connected Wallet</p>
                    <p className="text-xs text-white/60">Use detected provider</p>
                  </div>
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <Wallet className="h-12 w-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60 text-sm mb-6">No wallet detected on this device</p>
                <div className="bg-white/5 rounded-xl p-4 space-y-3 text-left">
                  <div>
                    <p className="text-cyan-400 text-xs font-semibold mb-2">📱 On Phone:</p>
                    <ul className="text-white/50 text-xs space-y-1">
                      <li>• Open in Farcaster app (has built-in wallet)</li>
                      <li>• Open in Base app (has built-in wallet)</li>
                      <li>• Install MetaMask app and open link there</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-cyan-400 text-xs font-semibold mb-2">🖥️ On Desktop:</p>
                    <ul className="text-white/50 text-xs space-y-1">
                      <li>• Install MetaMask extension</li>
                      <li>• Or Coinbase Wallet extension</li>
                      <li>• Refresh and try again</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

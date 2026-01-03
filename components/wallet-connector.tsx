"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface WalletConnectorProps {
  onConnect: (wallet: { provider: string; address: string }) => void
  onClose?: () => void
}

export function WalletConnector({ onConnect, onClose }: WalletConnectorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [detectedWallets, setDetectedWallets] = useState<string[]>([])
  const [isDetecting, setIsDetecting] = useState(true)

  useEffect(() => {
    detectWallets()
  }, [])

  const detectWallets = async () => {
    setIsDetecting(true)
    const wallets: string[] = []

    // Check for window.ethereum (MetaMask, Coinbase, OKX, Rabby all inject this)
    if (typeof window !== "undefined" && window.ethereum) {
      // Detect which wallet provider
      const provider = window.ethereum as any

      // MetaMask
      if (provider.isMetaMask) {
        wallets.push("MetaMask")
      }
      // Coinbase Wallet
      if (provider.isCoinbaseWallet) {
        wallets.push("Coinbase Wallet")
      }
      // OKX Wallet
      if (provider.isOkxWallet) {
        wallets.push("OKX Wallet")
      }
      // Rabby Wallet
      if (provider.isRabby) {
        wallets.push("Rabby Wallet")
      }

      // Generic Web3 wallet
      if (wallets.length === 0) {
        wallets.push("Web3 Wallet")
      }
    }

    setDetectedWallets(wallets)
    setIsDetecting(false)
  }

  const switchToBase = async () => {
    const chainId = "0x2105" // Base mainnet chain ID in hex

    try {
      // Try to switch to Base
      await window.ethereum!.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      })
    } catch (switchError: any) {
      // Chain doesn't exist, add it
      if (switchError.code === 4902) {
        await window.ethereum!.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId,
              chainName: "Base",
              rpcUrls: ["https://mainnet.base.org"],
              blockExplorerUrls: ["https://basescan.org"],
              nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18,
              },
            },
          ],
        })
      } else {
        throw switchError
      }
    }
  }

  const connectWallet = async () => {
    setIsLoading(true)
    setError("")

    try {
      if (!window.ethereum) {
        setError("No wallet detected. Please install MetaMask or another Web3 wallet.")
        setIsLoading(false)
        return
      }

      // Request accounts
      const accounts = (await window.ethereum!.request({
        method: "eth_requestAccounts",
      })) as string[]

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found")
      }

      // Switch to Base network
      await switchToBase()

      // Get provider name
      const provider = window.ethereum as any
      let providerName = "Web3 Wallet"

      if (provider.isMetaMask) providerName = "MetaMask"
      else if (provider.isCoinbaseWallet) providerName = "Coinbase Wallet"
      else if (provider.isOkxWallet) providerName = "OKX Wallet"
      else if (provider.isRabby) providerName = "Rabby Wallet"

      onConnect({
        provider: providerName,
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
          <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
          {onClose && (
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors p-1">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <p className="text-white/60 text-sm mb-6">
          Connect any Ethereum or Base wallet to view your activity and score.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4 mb-6 text-sm text-red-400">{error}</div>
        )}

        {isDetecting ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-400 border-t-transparent mb-4" />
            <p className="text-white/60 text-sm">Detecting wallets...</p>
          </div>
        ) : detectedWallets.length > 0 ? (
          <div className="space-y-3">
            {detectedWallets.map((wallet) => (
              <button
                key={wallet}
                onClick={connectWallet}
                disabled={isLoading}
                className="w-full p-4 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium min-h-[56px] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-cyan-400 border-t-transparent" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  `Connect ${wallet}`
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="text-4xl">👛</div>
            <p className="text-white/60 text-sm">No wallet detected</p>
            <div className="bg-white/5 rounded-xl p-4 space-y-3 text-left text-xs text-white/60">
              <div>
                <p className="text-cyan-400 font-semibold mb-2">📱 On Mobile:</p>
                <ul className="space-y-1 ml-2">
                  <li>• Open in Farcaster app (built-in wallet)</li>
                  <li>• Open in Base app (built-in wallet)</li>
                  <li>• Install MetaMask app, then reopen</li>
                </ul>
              </div>
              <div>
                <p className="text-cyan-400 font-semibold mb-2">🖥️ On Desktop:</p>
                <ul className="space-y-1 ml-2">
                  <li>• Install MetaMask extension</li>
                  <li>• Or Coinbase Wallet extension</li>
                  <li>• Refresh page and try again</li>
                </ul>
              </div>
            </div>
            <button
              onClick={detectWallets}
              className="mt-4 px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 text-white/60 hover:text-white text-sm transition-colors"
            >
              Try Detecting Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface WalletConnectorProps {
  onConnect: (wallet: { provider: string; address: string }) => void
  onClose?: () => void
}

export function WalletConnector({ onConnect, onClose }: WalletConnectorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleConnect = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Check if wallet exists
      if (!window.ethereum) {
        setError("No wallet found. Please install MetaMask, Coinbase, or open in Farcaster/Base app.")
        setIsLoading(false)
        return
      }

      // Request accounts from any injected provider
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found")
      }

      const address = accounts[0]

      // Switch to Base network
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x2105" }],
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
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
              },
            ],
          })
        }
      }

      // Determine wallet provider
      const provider = window.ethereum as any
      let walletName = "Web3 Wallet"

      if (provider.isMetaMask) walletName = "MetaMask"
      else if (provider.isCoinbaseWallet) walletName = "Coinbase"
      else if (provider.isOkxWallet) walletName = "OKX"
      else if (provider.isRabby) walletName = "Rabby"

      onConnect({
        provider: walletName,
        address,
      })
    } catch (err: any) {
      console.error("[v0] Connection error:", err)
      if (err.code === 4001) {
        setError("Connection rejected by user")
      } else {
        setError(err.message || "Failed to connect wallet")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-8 rounded-3xl max-w-md w-full border border-cyan-500/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
          {onClose && (
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors p-1">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <p className="text-white/70 text-sm mb-8">Connect any Ethereum wallet to view your Base network activity.</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-sm text-red-400">{error}</div>
        )}

        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full p-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[56px] flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>Connecting...</span>
            </>
          ) : (
            "Connect Wallet"
          )}
        </button>

        <div className="mt-6 space-y-3 text-xs text-white/60">
          <p className="font-semibold text-white">Supported Wallets:</p>
          <ul className="space-y-1 ml-2">
            <li>✓ MetaMask</li>
            <li>✓ Coinbase Wallet</li>
            <li>✓ OKX Wallet</li>
            <li>✓ Rabby Wallet</li>
            <li>✓ Farcaster In-App (open in Farcaster app)</li>
            <li>✓ Base In-App (open in Base app)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

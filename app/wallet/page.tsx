"use client"

import { Sidebar } from "@/components/sidebar"
import { WalletConnector } from "@/components/wallet-connector"
import { Wallet, Plus, Trash2, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface ConnectedWallet {
  id: number
  address: string
  balance: string
  isConnected: boolean
  chainId?: number
  provider: string // Added provider field
}

declare global {
  interface Window {
    ethereum?: any
    okxwallet?: any
    rabby?: any
    farcaster?: any
  }
}

export default function WalletPage() {
  const [wallets, setWallets] = useState<ConnectedWallet[]>([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState("")
  const [showWalletModal, setShowWalletModal] = useState(false) // Added modal state

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          const balance = await window.ethereum.request({
            method: "eth_getBalance",
            params: [accounts[0], "latest"],
          })
          const balanceInEth = (Number.parseInt(balance, 16) / 1e18).toFixed(4)
          const chainId = await window.ethereum.request({ method: "eth_chainId" })

          setWallets([
            {
              id: Date.now(),
              address: accounts[0],
              balance: `${balanceInEth} ETH`,
              isConnected: true,
              chainId: Number.parseInt(chainId, 16),
              provider: window.ethereum?.isMetaMask ? "metamask" : "unknown", // Detect provider
            },
          ])
        }
      } catch (err) {
        console.error("[v0] Error checking connection:", err)
      }
    }
  }

  const handleWalletConnect = async (wallet: { provider: string; address: string }) => {
    const address = wallet.address

    // Check if wallet already added
    if (wallets.some((w) => w.address.toLowerCase() === address.toLowerCase())) {
      setError("Wallet already connected")
      return
    }

    if (wallets.length >= 5) {
      setError("Maximum 5 wallets allowed")
      return
    }

    try {
      // Get balance based on provider
      let balance: string
      if (wallet.provider === "metamask" || wallet.provider === "coinbase") {
        balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [address, "latest"],
        })
      } else if (wallet.provider === "okx") {
        balance = await (window as any).okxwallet.request({
          method: "eth_getBalance",
          params: [address, "latest"],
        })
      } else if (wallet.provider === "rabby") {
        balance = await (window as any).rabby.request({
          method: "eth_getBalance",
          params: [address, "latest"],
        })
      } else {
        balance = await (window as any).farcaster.request({
          method: "eth_getBalance",
          params: [address, "latest"],
        })
      }

      const balanceInEth = (Number.parseInt(balance, 16) / 1e18).toFixed(4)

      // Add wallet
      const newWallet: ConnectedWallet = {
        id: Date.now(),
        address,
        balance: `${balanceInEth} ETH`,
        isConnected: true,
        chainId: 8453,
        provider: wallet.provider, // Store provider
      }

      setWallets([...wallets, newWallet])
      setShowWalletModal(false)
      setError("")
    } catch (err: any) {
      console.error("[v0] Connection error:", err)
      setError(err.message || "Failed to connect wallet")
    }
  }

  const connectWallet = async () => {
    setError("")
    if (typeof window.ethereum === "undefined") {
      setError("Please install MetaMask or another Web3 wallet")
      return
    }

    if (wallets.length >= 5) {
      setError("Maximum 5 wallets allowed")
      return
    }

    setIsConnecting(true)

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      const address = accounts[0]

      // Check if wallet already added
      if (wallets.some((w) => w.address.toLowerCase() === address.toLowerCase())) {
        setError("Wallet already connected")
        setIsConnecting(false)
        return
      }

      // Get balance
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })
      const balanceInEth = (Number.parseInt(balance, 16) / 1e18).toFixed(4)

      // Get chain ID
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      const chainIdDecimal = Number.parseInt(chainId, 16)

      // Base mainnet chain ID is 8453
      if (chainIdDecimal !== 8453) {
        // Prompt to switch to Base
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x2105" }], // Base mainnet
          })
        } catch (switchError: any) {
          // Chain not added, try to add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x2105",
                  chainName: "Base",
                  nativeCurrency: {
                    name: "Ether",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  rpcUrls: ["https://mainnet.base.org"],
                  blockExplorerUrls: ["https://basescan.org"],
                },
              ],
            })
          } else {
            throw switchError
          }
        }
      }

      // Add wallet
      const newWallet: ConnectedWallet = {
        id: Date.now(),
        address,
        balance: `${balanceInEth} ETH`,
        isConnected: true,
        chainId: 8453,
        provider: window.ethereum?.isMetaMask ? "metamask" : "unknown", // Detect provider
      }

      setWallets([...wallets, newWallet])
      setIsConnecting(false)
    } catch (err: any) {
      console.error("[v0] Connection error:", err)
      setError(err.message || "Failed to connect wallet")
      setIsConnecting(false)
    }
  }

  const refreshBalance = async (wallet: ConnectedWallet) => {
    if (typeof window.ethereum === "undefined") return

    try {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [wallet.address, "latest"],
      })
      const balanceInEth = (Number.parseInt(balance, 16) / 1e18).toFixed(4)

      setWallets(wallets.map((w) => (w.id === wallet.id ? { ...w, balance: `${balanceInEth} ETH` } : w)))
    } catch (err) {
      console.error("[v0] Error refreshing balance:", err)
    }
  }
  // </CHANGE>

  const removeWallet = (id: number) => {
    setWallets(wallets.filter((w) => w.id !== id))
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0f0f16]">
      <Sidebar />

      {showWalletModal && <WalletConnector onConnect={handleWalletConnect} onClose={() => setShowWalletModal(false)} />}

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Wallet Management</h1>
            <p className="text-white/60">Connect and manage your Base wallets (max 5)</p>
          </div>

          {error && (
            <div className="glass-card p-4 rounded-2xl mb-4 border border-red-400/30 bg-red-500/10">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Wallets List */}
          <div className="space-y-4 mb-6">
            {wallets.map((wallet) => (
              <div key={wallet.id} className="glass-card p-6 rounded-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                      <Wallet className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-mono text-sm">{wallet.address}</p>
                      <p className="text-cyan-400/60 text-xs mt-1">
                        Provider: {wallet.provider.charAt(0).toUpperCase() + wallet.provider.slice(1)}
                      </p>
                      <button
                        onClick={() => refreshBalance(wallet)}
                        className="text-white/40 hover:text-cyan-400 text-xs mt-1 transition-colors"
                      >
                        {wallet.balance} (click to refresh)
                      </button>
                      {wallet.chainId && wallet.chainId !== 8453 && (
                        <p className="text-amber-400 text-xs mt-1">⚠️ Not on Base network</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {wallet.isConnected && (
                      <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-400/30 text-xs text-green-400">
                        Connected
                      </span>
                    )}
                    <button
                      onClick={() => removeWallet(wallet.id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {wallets.length < 5 && (
            <Button
              onClick={() => setShowWalletModal(true)} // Open wallet modal
              disabled={isConnecting}
              className="w-full glass-card p-6 rounded-3xl border-2 border-dashed border-white/[0.15] hover:border-cyan-400/50 transition-colors flex items-center justify-center gap-2 text-white/60 hover:text-cyan-400 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5" />
              Add Wallet ({wallets.length}/5)
            </Button>
          )}

          {wallets.length === 0 && (
            <div className="glass-card p-6 rounded-3xl mt-6">
              <h3 className="text-white font-semibold mb-3">Supported Wallets:</h3>
              <ul className="text-white/60 text-sm space-y-2">
                <li>🦊 MetaMask</li>
                <li>🔷 Coinbase Wallet (Base in-app)</li>
                <li>⬜ OKX Wallet</li>
                <li>🐰 Rabby Wallet</li>
                <li>Ⓜ️ Farcaster Wallet</li>
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

"use client"

import { Sidebar } from "@/components/sidebar"
import { Trophy, Wallet } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface LeaderboardUser {
  address: string
  rank: number
  volume: number
  nftActivity: number
  newContracts: number
  ethAmount: string
  score: number
}

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function AnalyticsPage() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [userRank, setUserRank] = useState(0)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)

  useEffect(() => {
    checkConnection()
  }, [])

  useEffect(() => {
    if (walletConnected && walletAddress) {
      fetchLeaderboard()
    }
  }, [walletConnected, walletAddress])

  const checkConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
          setWalletConnected(true)
        }
      } catch (err) {
        console.error("[v0] Error checking connection:", err)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask or another Web3 wallet")
      return
    }

    setIsConnecting(true)

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      const chainIdDecimal = Number.parseInt(chainId, 16)

      if (chainIdDecimal !== 8453) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x2105" }],
          })
        } catch (switchError: any) {
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
          }
        }
      }

      setWalletAddress(accounts[0])
      setWalletConnected(true)
      setIsConnecting(false)
    } catch (err: any) {
      console.error("[v0] Connection error:", err)
      setIsConnecting(false)
    }
  }

  const fetchLeaderboard = async () => {
    try {
      setIsLoadingData(true)
      const response = await fetch(`/api/leaderboard?userAddress=${walletAddress}`)
      const data = await response.json()

      setLeaderboard(data.leaderboard || [])
      setUserRank(data.userRank || 1)
      console.log("[v0] Leaderboard data for wallet:", walletAddress, data)
    } catch (err) {
      console.error("[v0] Error fetching leaderboard:", err)
    } finally {
      setIsLoadingData(false)
    }
  }

  if (!walletConnected) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0f0f16]">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="glass-card p-12 rounded-3xl max-w-md w-full text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Wallet className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Connect Your Wallet</h2>
            <p className="text-white/60 mb-6">Connect your wallet to view analytics and leaderboard</p>
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-6 rounded-2xl transition-all disabled:opacity-50"
            >
              {isConnecting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Connecting...
                </div>
              ) : (
                "Connect Wallet"
              )}
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const currentUser = leaderboard.length > 0 ? leaderboard[0] : null

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0f0f16]">
      <Sidebar />

      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Analytics & Leaderboard</h1>
            <p className="text-white/60 text-sm md:text-base">Your Base Chain activity metrics</p>
            <p className="text-white/40 text-xs md:text-sm mt-2">
              Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
          </div>

          {/* Your Stats Card */}
          {isLoadingData ? (
            <div className="glass-card p-12 rounded-3xl text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-cyan-400 border-t-transparent mx-auto mb-4" />
              <p className="text-white/60">Loading wallet data...</p>
            </div>
          ) : currentUser ? (
            <div className="glass-card p-6 md:p-8 rounded-3xl mb-6">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center glow-cyan">
                    <Trophy className="h-16 w-16 text-white" />
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Score: {currentUser.score}</h2>
                  <p className="text-white/60 mb-1">Based on your real Base Chain activity</p>
                  <p className="text-cyan-400 text-sm">Rank: #{currentUser.rank}</p>
                </div>
              </div>

              {/* Your Stats Grid */}
              {currentUser && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  <div className="bg-white/[0.05] rounded-2xl p-4">
                    <p className="text-white/60 text-xs md:text-sm mb-1">TX Volume</p>
                    <p className="text-lg md:text-2xl font-bold text-cyan-400">{currentUser.volume}</p>
                  </div>
                  <div className="bg-white/[0.05] rounded-2xl p-4">
                    <p className="text-white/60 text-xs md:text-sm mb-1">NFT Activity</p>
                    <p className="text-lg md:text-2xl font-bold text-blue-400">{currentUser.nftActivity}</p>
                  </div>
                  <div className="bg-white/[0.05] rounded-2xl p-4">
                    <p className="text-white/60 text-xs md:text-sm mb-1">New Contracts</p>
                    <p className="text-lg md:text-2xl font-bold text-purple-400">{currentUser.newContracts}</p>
                  </div>
                  <div className="bg-white/[0.05] rounded-2xl p-4">
                    <p className="text-white/60 text-xs md:text-sm mb-1">ETH Balance</p>
                    <p className="text-lg md:text-2xl font-bold text-green-400">{currentUser.ethAmount} ETH</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Full Leaderboard */}
          <div className="glass-card p-4 md:p-6 rounded-3xl">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Full Leaderboard</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-2 md:px-4 text-white/60 font-medium">Rank</th>
                    <th className="text-left py-3 px-2 md:px-4 text-white/60 font-medium">Wallet</th>
                    <th className="text-right py-3 px-2 md:px-4 text-white/60 font-medium">Volume</th>
                    <th className="text-right py-3 px-2 md:px-4 text-white/60 font-medium">NFT</th>
                    <th className="text-right py-3 px-2 md:px-4 text-white/60 font-medium">Contracts</th>
                    <th className="text-right py-3 px-2 md:px-4 text-white/60 font-medium">ETH</th>
                    <th className="text-right py-3 px-2 md:px-4 text-white/60 font-medium">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((user) => {
                    const isCurrentUser = user.address.toLowerCase() === walletAddress.toLowerCase()
                    return (
                      <tr
                        key={user.address}
                        className={`border-b border-white/5 ${
                          isCurrentUser ? "bg-cyan-500/10" : "hover:bg-white/[0.03]"
                        } transition-colors`}
                      >
                        <td className="py-3 px-2 md:px-4">
                          <span className={`font-semibold ${isCurrentUser ? "text-cyan-400" : "text-white"}`}>
                            #{user.rank}
                          </span>
                        </td>
                        <td className="py-3 px-2 md:px-4">
                          <span
                            className={`font-mono text-xs md:text-sm ${isCurrentUser ? "text-cyan-400" : "text-white/80"}`}
                          >
                            {user.address.slice(0, 6)}...{user.address.slice(-4)}
                            {isCurrentUser && <span className="ml-2 text-cyan-400">(You)</span>}
                          </span>
                        </td>
                        <td className="py-3 px-2 md:px-4 text-right text-white/80">{user.volume}</td>
                        <td className="py-3 px-2 md:px-4 text-right text-white/80">{user.nftActivity}</td>
                        <td className="py-3 px-2 md:px-4 text-right text-white/80">{user.newContracts}</td>
                        <td className="py-3 px-2 md:px-4 text-right text-green-400">{user.ethAmount} ETH</td>
                        <td className="py-3 px-2 md:px-4 text-right font-semibold text-cyan-400">{user.score}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

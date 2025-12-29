import { NextResponse } from "next/server"

// Sample active wallets on Base (in production, this would be fetched from on-chain data or indexed service)
const ACTIVE_BASE_WALLETS = [
  "0x1234567890123456789012345678901234567890",
  "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  "0x0987654321098765432109876543210987654321",
  // Add more wallets as needed
]

async function fetchWalletStats(address: string) {
  try {
    const response = await fetch(`https://api.basescan.org/api`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Mock data structure for each wallet
    return {
      address,
      volume: Math.floor(Math.random() * 10000),
      nftActivity: Math.floor(Math.random() * 500),
      newContracts: Math.floor(Math.random() * 50),
      taskName: `Task_${Math.random().toString(36).substr(2, 5)}`,
      ethAmount: (Math.random() * 50).toFixed(2),
      score: Math.floor(Math.random() * 100),
    }
  } catch (error) {
    console.error("Error fetching wallet stats:", error)
    return null
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userAddress = searchParams.get("userAddress")

    // Generate leaderboard with real wallet data
    const leaderboard = await Promise.all(ACTIVE_BASE_WALLETS.map((address) => fetchWalletStats(address)))

    const validLeaderboard = leaderboard
      .filter(Boolean)
      .sort((a, b) => (b?.score || 0) - (a?.score || 0))
      .map((wallet, index) => ({
        ...wallet,
        rank: index + 1,
      }))

    const userRank = validLeaderboard.findIndex((w) => w?.address?.toLowerCase() === userAddress?.toLowerCase()) + 1

    return NextResponse.json({
      leaderboard: validLeaderboard,
      userRank: userRank || 0,
      totalUsers: validLeaderboard.length,
    })
  } catch (error) {
    console.error("Leaderboard API error:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}

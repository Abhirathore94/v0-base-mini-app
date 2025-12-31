import { NextResponse } from "next/server"

// Function to fetch real wallet data from Basescan API
async function fetchWalletDataFromBlockchain(address: string) {
  try {
    const basescanApiKey = process.env.BASESCAN_API_KEY || ""

    // Fetch transaction count (tx volume)
    const txResponse = await fetch(
      `https://api.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10000&sort=desc&apikey=${basescanApiKey}`,
    )
    const txData = await txResponse.json()
    const txVolume = txData.result ? txData.result.length : 0

    // Fetch ERC721 transfers (NFT activity)
    const nftResponse = await fetch(
      `https://api.basescan.org/api?module=account&action=tokennfttx&address=${address}&page=1&offset=100&sort=asc&apikey=${basescanApiKey}`,
    )
    const nftData = await nftResponse.json()
    const nftActivity = nftData.result ? nftData.result.length : 0

    // Fetch internal transactions (contract deployments)
    const internalResponse = await fetch(
      `https://api.basescan.org/api?module=account&action=txlistinternal&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=asc&apikey=${basescanApiKey}`,
    )
    const internalData = await internalResponse.json()

    let newContracts = 0
    if (internalData.result) {
      newContracts = internalData.result.filter((tx: any) => tx.input !== "0x" && !tx.to).length
    }

    // Fetch ETH balance
    const balanceResponse = await fetch(
      `https://api.basescan.org/api?module=account&action=balance&address=${address}&tag=latest&apikey=${basescanApiKey}`,
    )
    const balanceData = await balanceResponse.json()
    const ethBalance = balanceData.result ? (Number.parseInt(balanceData.result) / 1e18).toFixed(4) : "0"

    // Calculate score based on real activity
    const baseScore = Math.min(35, txVolume * 1.5)
    const nftBonus = Math.min(25, nftActivity * 3)
    const contractBonus = Math.min(20, newContracts * 10)
    const score = Math.min(100, baseScore + nftBonus + contractBonus)

    return {
      address,
      volume: txVolume,
      nftActivity,
      newContracts,
      ethAmount: ethBalance,
      score: Math.round(score),
    }
  } catch (error) {
    console.error(`Error fetching blockchain data for ${address}:`, error)
    return null
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userAddress = searchParams.get("userAddress")

    if (!userAddress) {
      return NextResponse.json({ error: "userAddress is required" }, { status: 400 })
    }

    const userWalletData = await fetchWalletDataFromBlockchain(userAddress)

    if (!userWalletData) {
      return NextResponse.json(
        {
          leaderboard: [],
          userRank: 0,
          totalUsers: 0,
          error: "Unable to fetch wallet data",
        },
        { status: 200 },
      )
    }

    // Return single wallet data with real score calculation
    return NextResponse.json({
      leaderboard: [
        {
          rank: 1,
          ...userWalletData,
        },
      ],
      userRank: 1,
      totalUsers: 1,
      message: "Showing real wallet data from blockchain",
    })
  } catch (error) {
    console.error("Leaderboard API error:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}

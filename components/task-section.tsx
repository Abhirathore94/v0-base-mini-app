"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown, ChevronRight, Lock } from "lucide-react"

interface Task {
  id: number
  title: string
  description: string
  validator?: (walletData: WalletData) => boolean
}

interface TaskCategory {
  id: number
  category: string
  tasks: Task[]
  description: string
  points: number
}

interface WalletData {
  address?: string
  txVolume: number
  nftActivity: number
  newContracts: number
  baseName?: string
  recentTransactions: Array<{
    hash: string
    timestamp: number
    type: string
    value: string
  }>
}

const TASK_CATEGORIES: TaskCategory[] = [
  {
    id: 1,
    category: "Setup & Bridging",
    description: "Get on-chain early",
    points: 5,
    tasks: [
      {
        id: 1,
        title: "Bridge ETH from Ethereum mainnet to Base",
        description: "Use official Base Bridge (bridge.base.org)",
        validator: (data) => data.txVolume >= 1,
      },
      {
        id: 2,
        title: "Bridge via alternative protocols",
        description: "Across Protocol, Rhino.fi, Orbiter Finance, or Layerswap",
        validator: (data) => data.txVolume >= 3,
      },
      {
        id: 3,
        title: "Bridge gETH testnet tokens",
        description: "From Goerli to Base Sepolia testnet via official testnet bridge",
        validator: (data) => false,
      },
      {
        id: 4,
        title: "Verify your wallet via Coinbase",
        description: "Complete Onchain Verification at coinbase.com/onchain-verified",
        validator: (data) => data.txVolume >= 5,
      },
      {
        id: 5,
        title: "Register a .base ENS name",
        description: "~$4–$10/year at base.org/names and hold ≥0.001 ETH on Base",
        validator: (data) => !!(data.baseName && data.baseName.length > 0),
      },
    ],
  },
  {
    id: 2,
    category: "Guild Roles & Social",
    description: "Unlock Discord access and roles",
    points: 6,
    tasks: [
      {
        id: 6,
        title: "Become Based",
        description: "Visit base.org (optional: follow @base on X)",
        validator: (data) => data.txVolume >= 1,
      },
      {
        id: 7,
        title: "Based",
        description: "Own a .base name",
        validator: (data) => !!(data.baseName && data.baseName.length > 0),
      },
      {
        id: 8,
        title: "Onchain",
        description: "Hold ≥0.001 ETH + complete 1 on-chain tx",
        validator: (data) => data.txVolume >= 1,
      },
      {
        id: 9,
        title: "Builders & Founders",
        description: "GitHub account pre-July 1, 2025 + ≥1 commit + visit base.org/build",
        validator: (data) => data.newContracts >= 1,
      },
      {
        id: 10,
        title: "Creators & Voices",
        description: "Follow @base on X",
        validator: (data) => data.txVolume >= 2,
      },
      {
        id: 11,
        title: "Coinbase Onchain Verified",
        description: "Verify wallet",
        validator: (data) => data.txVolume >= 8,
      },
    ],
  },
  {
    id: 3,
    category: "NFT Minting",
    description: "Boost tx diversity with on-chain art",
    points: 8,
    tasks: [
      {
        id: 13,
        title: "Mint an Onchain Summer NFT",
        description: "Visit onchainsummer.xyz",
        validator: (data) => data.nftActivity >= 1,
      },
      {
        id: 14,
        title: "Mint any NFT on Mint.Fun",
        description: "Base Day One or !fundrop pass—type '!fundrop' in chat",
        validator: (data) => data.nftActivity >= 2,
      },
      {
        id: 15,
        title: "Mint Base, Introduced NFT",
        description: "Commemorative NFT on Zora.co for testnet launch",
        validator: (data) => data.nftActivity >= 3,
      },
      {
        id: 16,
        title: "Get Early Builders NFT",
        description: "Deploy smart contract on apetimism.com/launch + complete quests",
        validator: (data) => data.newContracts >= 1 && data.nftActivity >= 1,
      },
      {
        id: 17,
        title: "Complete Tokiemon Card tasks",
        description: "Coinbase Wallet Dashboard (Explore tab; earn 1000 points)",
        validator: (data) => data.nftActivity >= 4,
      },
      {
        id: 18,
        title: "Mint Cubs NFTs on Layer3",
        description: "Visit layer3.xyz for on-chain scoring",
        validator: (data) => data.nftActivity >= 5,
      },
      {
        id: 19,
        title: "Solve Clusters puzzles",
        description: "Visit clusters.xyz and mint related NFTs",
        validator: (data) => data.nftActivity >= 6,
      },
      {
        id: 20,
        title: "Purchase Onchain Summer NFTs",
        description: "From secondary markets (Zora or OpenSea on Base)",
        validator: (data) => data.nftActivity >= 7,
      },
    ],
  },
  {
    id: 4,
    category: "DEX Swaps & Liquidity",
    description: "Repeatable for volume",
    points: 6,
    tasks: [
      {
        id: 21,
        title: "Swap tokens on Uniswap",
        description: "Visit app.uniswap.org on Base",
        validator: (data) => {
          const swaps = data.recentTransactions.filter((tx) => tx.type === "Swap")
          return swaps.length >= 1
        },
      },
      {
        id: 22,
        title: "Swap on 1inch",
        description: "Aggregated DEX at app.1inch.io",
        validator: (data) => data.recentTransactions.filter((tx) => tx.type === "Swap").length >= 2,
      },
      {
        id: 23,
        title: "Swap/add liquidity on PancakeSwap",
        description: "Base deployment at pancakeswap.finance",
        validator: (data) => data.recentTransactions.filter((tx) => tx.type === "Swap").length >= 3,
      },
      {
        id: 24,
        title: "Swap/add liquidity on SushiSwap",
        description: "Visit sushi.com on Base",
        validator: (data) => data.recentTransactions.filter((tx) => tx.type === "Swap").length >= 4,
      },
      {
        id: 25,
        title: "Swap/add liquidity on Aerodrome",
        description: "Top Base DEX at aerodrome.finance",
        validator: (data) => data.recentTransactions.filter((tx) => tx.type === "Swap").length >= 5,
      },
      {
        id: 26,
        title: "Swap/add liquidity on Alien Base",
        description: "Visit alienbase.xyz",
        validator: (data) => data.recentTransactions.filter((tx) => tx.type === "Swap").length >= 6,
      },
    ],
  },
  {
    id: 5,
    category: "DeFi & Lending",
    description: "Yield-bearing apps for deeper engagement",
    points: 7,
    tasks: [
      {
        id: 28,
        title: "Provide liquidity on BaseSwap",
        description: "Visit baseswap.fi",
        validator: (data) => data.txVolume >= 10,
      },
      {
        id: 29,
        title: "Provide liquidity on RocketSwap",
        description: "Visit rocketswap.finance",
        validator: (data) => data.txVolume >= 12,
      },
      {
        id: 30,
        title: "Lend/borrow on Moonwell",
        description: "Visit moonwell.fi on Base",
        validator: (data) => data.txVolume >= 15,
      },
      {
        id: 31,
        title: "Stake/farm on Seamless",
        description: "Lending protocol at seamlessprotocol.com",
        validator: (data) => data.txVolume >= 18,
      },
      {
        id: 32,
        title: "Yield farm on Base",
        description: "Official opportunities at base.org/yield",
        validator: (data) => data.txVolume >= 20,
      },
      {
        id: 33,
        title: "Use Pendle on Base",
        description: "Cross-chain yield aggregator at pendle.finance",
        validator: (data) => data.txVolume >= 25,
      },
      {
        id: 34,
        title: "Participate in liquidity mining",
        description: "Emerging Base DeFi (check defillama.com/chain/Base)",
        validator: (data) => data.txVolume >= 30,
      },
    ],
  },
  {
    id: 6,
    category: "DApps & Games",
    description: "Diversify interactions",
    points: 6,
    tasks: [
      {
        id: 35,
        title: "Play DackieSwap",
        description: "Visit dackieswap.com or other Base games",
        validator: (data) => data.txVolume >= 6,
      },
      {
        id: 36,
        title: "Interact with Friend.tech clones",
        description: "SocialFi on Base (e.g., Farcaster frames)",
        validator: (data) => data.txVolume >= 8,
      },
      {
        id: 37,
        title: "Use Base-native DApps",
        description: "From DefiLlama's Base chain page (top protocols by TVL)",
        validator: (data) => data.txVolume >= 10,
      },
      {
        id: 38,
        title: "Complete Layer3 quests",
        description: "Visit layer3.xyz/campaigns?chain=base",
        validator: (data) => data.txVolume >= 12,
      },
      {
        id: 39,
        title: "Complete Bankless Citizen quests",
        description: "Visit citizen.bankless.com (10 ecosystem quests)",
        validator: (data) => data.txVolume >= 15,
      },
      {
        id: 40,
        title: "Test emerging DApps",
        description: "Abstract Chain integrations or Opinion Labs points farming",
        validator: (data) => data.txVolume >= 18,
      },
    ],
  },
  {
    id: 7,
    category: "Development",
    description: "For higher-tier rewards",
    points: 3,
    tasks: [
      {
        id: 41,
        title: "Star Base GitHub repos",
        description: "Visit github.com/base-org and make 1 commit",
        validator: (data) => data.newContracts >= 1,
      },
      {
        id: 42,
        title: "Deploy a smart contract",
        description: "Via Remix or Hardhat on Base",
        validator: (data) => data.newContracts >= 1,
      },
      {
        id: 43,
        title: "Complete builder quests",
        description: "Visit base.org/build (e.g., hackathon sign-ups)",
        validator: (data) => data.newContracts >= 2,
      },
    ],
  },
  {
    id: 8,
    category: "Daily/Repeatable",
    description: "Do these weekly for consistency",
    points: 5,
    tasks: [
      {
        id: 44,
        title: "Perform 5–10 varied txs",
        description: "Mix swaps, mints, bridges",
        validator: (data) => data.txVolume >= 5,
      },
      {
        id: 45,
        title: "Engage in Base app beta",
        description: "Waitlist at base.org/app; complete dashboard tasks",
        validator: (data) => data.txVolume >= 10,
      },
      {
        id: 46,
        title: "Join Base Telegram/Discord",
        description: "Participate in AMAs or events",
        validator: (data) => data.txVolume >= 1,
      },
      {
        id: 47,
        title: "Create/share Base content",
        description: "X posts tagging @base for voice roles",
        validator: (data) => data.txVolume >= 3,
      },
      {
        id: 48,
        title: "Stake/hold Base ecosystem tokens",
        description: "e.g., $AERO from Aerodrome during snapshots",
        validator: (data) => data.txVolume >= 15,
      },
    ],
  },
]

interface TaskSectionProps {
  walletData?: WalletData
}

export function TaskSection({ walletData }: TaskSectionProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set([1]))
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!walletData) {
      setCompletedTasks(new Set())
      return
    }

    console.log("[v0] Validating tasks with wallet data:", walletData)
    const validated = new Set<number>()

    TASK_CATEGORIES.forEach((category) => {
      category.tasks.forEach((task) => {
        if (task.validator) {
          try {
            const isValid = task.validator(walletData)
            console.log(`[v0] Task ${task.id} "${task.title}":`, isValid)
            if (isValid) {
              validated.add(task.id)
            }
          } catch (error) {
            console.error(`[v0] Error validating task ${task.id}:`, error)
          }
        }
      })
    })

    console.log("[v0] Completed tasks:", Array.from(validated))
    setCompletedTasks(validated)
  }, [walletData])

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const totalTasks = TASK_CATEGORIES.reduce((acc, cat) => acc + cat.tasks.length, 0)
  const completedCount = completedTasks.size
  const progressPercent = (completedCount / totalTasks) * 100

  return (
    <div className="glass-card p-4 md:p-6 rounded-2xl md:rounded-3xl">
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Eligibility Tasks</h2>
            <p className="text-xs md:text-sm text-white/60">Tasks validated from your on-chain activity</p>
          </div>
          <div className="text-left md:text-right">
            <div className="text-2xl md:text-3xl font-bold text-cyan-400">
              {completedCount}/{totalTasks}
            </div>
            <div className="text-xs text-white/60">Tasks Completed</div>
          </div>
        </div>

        <div className="relative h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-blue-500 glow-cyan transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="space-y-2 md:space-y-3">
        {TASK_CATEGORIES.map((category) => {
          const isExpanded = expandedCategories.has(category.id)
          const categoryCompletedTasks = category.tasks.filter((task) => completedTasks.has(task.id)).length

          return (
            <div
              key={category.id}
              className="rounded-xl md:rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden"
            >
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 flex items-center justify-between hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 md:h-4 w-3.5 md:w-4 text-cyan-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-3.5 md:h-4 w-3.5 md:w-4 text-white/40 flex-shrink-0" />
                  )}
                  <div className="text-left">
                    <h3 className="text-xs md:text-sm font-semibold text-white">{category.category}</h3>
                    <p className="text-[10px] md:text-xs text-white/40">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                  <div className="text-[10px] md:text-xs text-white/60">
                    {categoryCompletedTasks}/{category.tasks.length}
                  </div>
                  <div className="px-2 py-0.5 md:py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-[10px] md:text-xs text-cyan-400 font-medium">
                    {category.points} Tasks
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="px-3 md:px-4 pb-2 md:pb-3 space-y-1.5 md:space-y-2">
                  {category.tasks.map((task) => {
                    const isCompleted = completedTasks.has(task.id)

                    return (
                      <div
                        key={task.id}
                        className="w-full flex items-start gap-2 md:gap-3 p-2 md:p-3 rounded-lg md:rounded-xl bg-white/[0.02] transition-all"
                      >
                        <div
                          className={`flex-shrink-0 mt-0.5 w-4 md:w-5 h-4 md:h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                            isCompleted ? "bg-cyan-500 border-cyan-400 glow-cyan" : "border-white/20"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="h-2.5 md:h-3 w-2.5 md:w-3 text-white" />
                          ) : (
                            <Lock className="h-2.5 md:h-3 w-2.5 md:w-3 text-white/20" />
                          )}
                        </div>

                        <div className="flex-1 text-left min-w-0">
                          <h4
                            className={`text-xs md:text-sm font-medium transition-colors ${
                              isCompleted ? "text-white/60 line-through" : "text-white"
                            }`}
                          >
                            {task.title}
                          </h4>
                          <p className="text-[10px] md:text-xs text-white/40 mt-0.5">{task.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TaskSection

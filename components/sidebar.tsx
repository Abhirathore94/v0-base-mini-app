"use client"

import { Activity, BarChart3, Wallet, Settings, HelpCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { useEffect, useState } from "react"

interface UserData {
  address: string
  baseName?: string
}

export function Sidebar() {
  const pathname = usePathname()
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            setUserData({ address: accounts[0] })
          }
        } catch (err) {
          console.error("Error checking wallet:", err)
        }
      }
    }

    checkWallet()

    // Listen for account changes
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setUserData({ address: accounts[0] })
        } else {
          setUserData(null)
        }
      })
    }
  }, [])

  const menuItems = [
    { id: "dashboard", icon: Activity, label: "Dashboard", href: "/" },
    { id: "analytics", icon: BarChart3, label: "Analytics", href: "/analytics" },
    { id: "wallet", icon: Wallet, label: "Wallet", href: "/wallet" },
    { id: "settings", icon: Settings, label: "Settings", href: "/settings" },
    { id: "help", icon: HelpCircle, label: "Help", href: "/help" },
  ]

  const getUserInitial = () => {
    if (!userData) return "?"
    if (userData.baseName && userData.baseName.length > 0) {
      return userData.baseName[0].toUpperCase()
    }
    return userData.address?.slice(2, 4).toUpperCase() ?? "?"
  }

  const getUserLabel = () => {
    if (!userData) return "Connect"
    if (userData.baseName && userData.baseName.length > 0) {
      return userData.baseName.length > 12 ? userData.baseName.slice(0, 12) + "..." : userData.baseName
    }
    return `User ${userData.address?.slice(2, 6) ?? "????"}`
  }

  return (
    <>
      <aside className="hidden md:flex w-20 bg-[#0a0a0f]/80 backdrop-blur-xl border-r border-white/[0.08] flex-col items-center py-8 gap-6">
        <div className="w-12 h-12 mb-8 relative group cursor-pointer">
          <Image
            src="/base-logo.png"
            alt="BASE Logo"
            width={48}
            height={48}
            className="rounded-xl transition-transform group-hover:scale-105"
          />
        </div>

        <nav className="flex-1 flex flex-col gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 group relative min-h-[44px] min-w-[44px] ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-400 glow-cyan-soft"
                    : "text-white/40 hover:text-cyan-400 hover:bg-white/[0.05]"
                }`}
                aria-label={item.label}
              >
                <Icon className="h-5 w-5" />
                <span className="absolute left-full ml-4 px-3 py-1.5 bg-[#1a1a24] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity border border-white/[0.08]">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform relative group min-h-[44px] min-w-[44px]">
          <span className="text-white font-bold text-sm">{getUserInitial()}</span>
          <span className="absolute left-full ml-4 px-3 py-1.5 bg-[#1a1a24] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity border border-white/[0.08]">
            {getUserLabel()}
          </span>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/[0.08] safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all min-h-[44px] min-w-[44px] justify-center ${
                  isActive ? "text-cyan-400" : "text-white/40"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "glow-cyan-soft" : ""}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

export default Sidebar

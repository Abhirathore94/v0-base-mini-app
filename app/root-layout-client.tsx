"use client"

import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { useEffect } from "react"
import { ThemeProvider } from "next-themes"
import { WagmiProviderWrapper } from "@/components/wagmi-provider"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export default function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // <CHANGE> Added useEffect hook to call sdk.actions.ready() when miniapp loads
  useEffect(() => {
    // <CHANGE> Detect if running inside Farcaster miniapp
    const url = new URL(window.location.href)
    const isMini =
      url.pathname.startsWith("/mini") ||
      url.searchParams.get("miniApp") === "true" ||
      // Farcaster embeds use these user agents
      /Warpcast|farcaster/i.test(navigator.userAgent)

    if (isMini) {
      // <CHANGE> Dynamically import Farcaster SDK and call ready()
      import("@farcaster/miniapp-sdk")
        .then(({ sdk }) => {
          // Call ready as soon as interface is ready to hide splash screen
          sdk.actions.ready()
        })
        .catch((error) => {
          console.error("[v0] Failed to load Farcaster SDK:", error)
        })
    }
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta property="og:type" content="website" />
        <meta
          property="fc:miniapp"
          content='{"version":"1","imageUrl":"https://v0-base-mini-app-six.vercel.app/base-logo.png","button":{"title":"Open Base Score","action":{"type":"launch_frame","name":"Base Score","url":"https://v0-base-mini-app-six.vercel.app"}}}'
        />
        <meta name="theme-color" content="#0052FF" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0052FF" media="(prefers-color-scheme: dark)" />
      </head>
      <body className={`font-sans antialiased ${_geist.className}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <WagmiProviderWrapper>{children}</WagmiProviderWrapper>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

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
  useEffect(() => {
    const initializeSdk = async () => {
      try {
        // Import the SDK and call ready immediately
        const { sdk } = await import("@farcaster/miniapp-sdk")

        // Call ready to signal the miniapp is loaded
        // This works whether in Farcaster or web browser
        await sdk.actions.ready()

        console.log("[v0] SDK ready called successfully")
      } catch (error) {
        // If SDK import fails, we're likely on web, not in Farcaster
        console.log("[v0] Not in Farcaster context or SDK import failed:", (error as Error).message)
      }
    }

    // Call immediately on mount
    initializeSdk()
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

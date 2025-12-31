import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "next-themes"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Base Score – Track Your Base Chain Score",
  description:
    "Check your Base Chain activity score instantly. Explore wallet insights, NFT activity, and real-time analytics across the Base ecosystem.",
  generator: "v0.app",
  metadataBase: new URL("https://v0-base-mini-app-six.vercel.app"),
  openGraph: {
    title: "Base Score – Track Your Base Chain Score",
    description: "Check your Base Chain activity score instantly and share your progress with friends.",
    url: "https://v0-base-mini-app-six.vercel.app",
    type: "website",
    images: [
      {
        url: "https://v0-base-mini-app-six.vercel.app/base-logo.png",
        width: 1200,
        height: 630,
        alt: "Base Score",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base Score",
    description: "Check your Base Chain activity score instantly",
    images: ["https://v0-base-mini-app-six.vercel.app/base-logo.png"],
  },
  other: {
    "base:app_id": "692445c52ba3bc50c6d0ceb4",
  },
  icons: {
    icon: "/base-logo.png",
    apple: "/base-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

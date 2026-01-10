import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import RootLayoutClient from "./root-layout-client"

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
  return <RootLayoutClient>{children}</RootLayoutClient>
}

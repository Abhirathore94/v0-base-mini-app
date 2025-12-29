import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

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
  other: {
    "og:image": "https://v0-base-mini-app-six.vercel.app/base-logo.png",
    "og:image:alt": "Base Score",
    "fc:frame": "vNext",
    "fc:frame:image": "https://v0-base-mini-app-six.vercel.app/base-logo.png",
    "fc:frame:image:aspect_ratio": "1.91:1",
    "fc:frame:button:1": "📊 Open Dashboard",
    "fc:frame:button:1:action": "launch_frame",
    "fc:frame:button:1:target": "https://v0-base-mini-app-six.vercel.app",
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
    <html lang="en" className="dark">
      <head>
        <meta name="base:app_id" content="692445c52ba3bc50c6d0ceb4" />

        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content="https://v0-base-mini-app-six.vercel.app/base-logo.png" />
        <meta name="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta name="og:title" content="Base Score – Track Your Base Chain Score" />
        <meta
          name="og:description"
          content="Check your Base Chain activity score instantly and share your progress with friends."
        />
        <meta name="og:image" content="https://v0-base-mini-app-six.vercel.app/base-logo.png" />
        <meta name="fc:frame:button:1" content="📊 Open Dashboard" />
        <meta name="fc:frame:button:1:action" content="launch_frame" />
        <meta name="fc:frame:button:1:target" content="https://v0-base-mini-app-six.vercel.app" />
        {/* Updated fc:miniapp meta tag to include proper embed configuration with imageUrl */}
        <meta
          name="fc:miniapp"
          content={JSON.stringify({
            version: "next",
            imageUrl: "https://v0-base-mini-app-six.vercel.app/base-logo.png",
            button: {
              title: "Open Base Score",
              action: {
                type: "launch_frame",
                url: "https://v0-base-mini-app-six.vercel.app",
              },
            },
          })}
        />
      </head>
      <body className={`font-sans antialiased ${_geist.className}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

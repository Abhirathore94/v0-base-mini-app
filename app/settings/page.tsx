"use client"

import { Sidebar } from "@/components/sidebar"
import { Mail, User, Twitter } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const [profileName, setProfileName] = useState("Anonymous User")
  const [email, setEmail] = useState("")
  const [twitterId, setTwitterId] = useState("")
  const [discordId, setDiscordId] = useState("")
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    // Save settings logic here
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0f0f16]">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-white/60">Manage your profile and account settings</p>
          </div>

          <div className="glass-card p-8 rounded-3xl space-y-6">
            {/* Profile Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                <User className="h-4 w-4" />
                Profile Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-white/[0.05] border border-white/[0.15] rounded-2xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full bg-white/[0.05] border border-white/[0.15] rounded-2xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            {/* Twitter ID */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                <Twitter className="h-4 w-4" />
                Twitter Handle
              </label>
              <input
                type="text"
                value={twitterId}
                onChange={(e) => setTwitterId(e.target.value)}
                placeholder="@yourhandle"
                className="w-full bg-white/[0.05] border border-white/[0.15] rounded-2xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            {/* Discord ID */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Discord ID
              </label>
              <input
                type="text"
                value={discordId}
                onChange={(e) => setDiscordId(e.target.value)}
                placeholder="username#0000"
                className="w-full bg-white/[0.05] border border-white/[0.15] rounded-2xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <Button
                onClick={handleSave}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-2xl py-3 font-medium"
              >
                {isSaved ? "Saved!" : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

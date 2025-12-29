import { Sidebar } from "@/components/sidebar"
import { MessageCircle, Twitter, Send } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0f0f16]">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Help & Support</h1>
            <p className="text-white/60">Get assistance from our support team</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Twitter Support */}
            <a
              href="https://twitter.com/abhirathore_07"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-8 rounded-3xl hover:bg-white/[0.08] transition-all hover:scale-[1.02] group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-4 glow-blue">
                <Twitter className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Twitter Support</h3>
              <p className="text-white/60 mb-4">Reach out to us on Twitter for quick help</p>
              <p className="text-cyan-400 font-mono text-sm">@abhirathore_07</p>
            </a>

            {/* Telegram Support */}
            <a
              href="https://t.me/itachi_Akatsuki01"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-8 rounded-3xl hover:bg-white/[0.08] transition-all hover:scale-[1.02] group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mb-4 glow-blue">
                <Send className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Telegram Support</h3>
              <p className="text-white/60 mb-4">Chat with us directly on Telegram</p>
              <p className="text-cyan-400 font-mono text-sm">itachi_Akatsuki01</p>
            </a>
          </div>

          {/* FAQ Section */}
          <div className="glass-card p-8 rounded-3xl mt-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-cyan-400" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              <div className="border-b border-white/[0.08] pb-4">
                <h4 className="text-white font-medium mb-2">How do I connect my wallet?</h4>
                <p className="text-white/60 text-sm">
                  Navigate to the Wallet page and click "Add Wallet" to connect up to 5 wallets.
                </p>
              </div>
              <div className="border-b border-white/[0.08] pb-4">
                <h4 className="text-white font-medium mb-2">How is my activity score calculated?</h4>
                <p className="text-white/60 text-sm">
                  Your score is based on transaction volume, NFT activity, new contracts deployed, and overall
                  engagement on Base.
                </p>
              </div>
              <div className="pb-4">
                <h4 className="text-white font-medium mb-2">How do I improve my rank?</h4>
                <p className="text-white/60 text-sm">
                  Stay active on Base by making transactions, minting NFTs, and deploying contracts. Complete tasks in
                  the dashboard to boost your score.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

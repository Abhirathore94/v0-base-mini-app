"use client"

import { ArrowRightLeft, TrendingUp, FileCode, ImageIcon, ExternalLink } from "lucide-react"

interface Activity {
  type: string
  description: string
  time: string
  value?: string
  protocol?: string
  protocolUrl?: string
}

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "transaction":
        return <ArrowRightLeft className="h-3 md:h-4 w-3 md:w-4" />
      case "trading":
      case "swap":
        return <TrendingUp className="h-3 md:h-4 w-3 md:w-4" />
      case "contract":
        return <FileCode className="h-3 md:h-4 w-3 md:w-4" />
      case "nft":
        return <ImageIcon className="h-3 md:h-4 w-3 md:w-4" />
      default:
        return <ArrowRightLeft className="h-3 md:h-4 w-3 md:w-4" />
    }
  }

  const linkifyDomains = (text: string) => {
    const domainRegex = /\b([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\b/g
    const parts = text.split(domainRegex)
    const matches = text.match(domainRegex)

    if (!matches) return text

    const result = []
    let matchIndex = 0

    for (let i = 0; i < parts.length; i++) {
      if (parts[i]) {
        result.push(<span key={`text-${i}`}>{parts[i]}</span>)
      }
      if (
        matchIndex < matches.length &&
        text.indexOf(matches[matchIndex], text.indexOf(parts[i]) + parts[i].length) !== -1
      ) {
        const domain = matches[matchIndex]
        result.push(
          <a
            key={`link-${i}`}
            href={`https://${domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 inline-flex items-center gap-1 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {domain}
            <ExternalLink className="h-3 w-3 inline" />
          </a>,
        )
        matchIndex++
      }
    }

    return result
  }

  return (
    <div className="glass-card p-4 md:p-6 rounded-2xl md:rounded-3xl h-full">
      <h3 className="text-xs md:text-sm font-medium text-white/60 mb-3 md:mb-4">Recent Activity</h3>
      <div className="space-y-2 md:space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center gap-2 md:gap-4 p-2 md:p-3 rounded-xl md:rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] transition-colors group"
          >
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm text-white truncate">{linkifyDomains(activity.description)}</p>
              {activity.protocol && activity.protocolUrl ? (
                <a
                  href={activity.protocolUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] md:text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 w-fit transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {activity.protocol}
                  <ExternalLink className="h-2.5 md:h-3 w-2.5 md:w-3" />
                </a>
              ) : (
                <p className="text-[10px] md:text-xs text-white/40">{activity.time}</p>
              )}
            </div>
            {activity.value && (
              <div className="text-[10px] md:text-xs font-medium text-cyan-400 flex-shrink-0">{activity.value}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivityFeed

import SectionCard from './SectionCard'

const CAMPAIGNS = [
  { name: 'Facebook Ads', percent: 85, color: 'bg-blue-500' },
  { name: 'Google Search', percent: 72, color: 'bg-emerald-500' },
  { name: 'Instagram Reels', percent: 64, color: 'bg-rose-500' },
  { name: 'YouTube Pre-roll', percent: 45, color: 'bg-amber-500' },
  { name: 'TikTok Ads', percent: 38, color: 'bg-cyan-500' },
]

export function CampaignChart() {
  return (
    <SectionCard title="Rendimiento de campaña">
      <div className="flex flex-col gap-4">
        {CAMPAIGNS.map((c) => (
          <div key={c.name} className="flex items-center gap-4">
            <span className="w-28 shrink-0 text-[13px] font-medium text-muted-foreground">
              {c.name}
            </span>
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${c.color} transition-all duration-500`}
                style={{ width: `${c.percent}%` }}
              />
            </div>
            <span className="w-10 text-right text-[13px] font-semibold tabular-nums text-foreground">
              {c.percent}%
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

export default CampaignChart

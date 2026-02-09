import SectionCard from './SectionCard'

const CAMPAIGNS = [
  { name: 'Facebook Ads', percent: 85 },
  { name: 'Google Search', percent: 72 },
  { name: 'Instagram Reels', percent: 64 },
  { name: 'YouTube Pre-roll', percent: 45 },
  { name: 'TikTok Ads', percent: 38 },
]

export function CampaignChart() {
  return (
    <SectionCard title="Rendimiento de campaña">
      <div className="flex flex-col gap-3">
        {CAMPAIGNS.map((c) => (
          <div key={c.name} className="flex items-center gap-3">
            <span className="w-32 shrink-0 text-sm text-muted-foreground">
              {c.name}
            </span>
            <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-muted">
              <div
                className="h-full rounded-md bg-primary"
                style={{ width: `${c.percent}%` }}
              />
            </div>
            <span className="w-10 text-right text-sm font-medium text-card-foreground">
              {c.percent}%
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

export default CampaignChart

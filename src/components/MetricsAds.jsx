import SectionCard from './SectionCard'

const VIDEOS = [
  { id: 'dQw4w9WgXcQ', title: 'Campana principal' },
  { id: '9bZkp7q19f0', title: 'Campana secundaria' },
]

export function MetricsAds() {
  return (
    <SectionCard title="Metricas Ads">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {VIDEOS.map((v) => (
          <div key={v.id} className="overflow-hidden rounded-lg border border-border">
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${v.id}`}
                title={v.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="h-full w-full"
              />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

export default MetricsAds

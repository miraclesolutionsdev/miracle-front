import SectionCard from './SectionCard'

const METRICS = [
  { label: 'Conversion', value: 75 },
  { label: 'Retencion', value: 60 },
  { label: 'Satisfaccion', value: 90 },
]

function CircleProgress({ value, label }) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className="shrink-0"
        aria-label={`${label}: ${value}%`}
        role="img"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-card-foreground text-lg font-bold"
        >
          {value}%
        </text>
      </svg>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}

export function ProgressCircles() {
  return (
    <SectionCard title="Fracias">
      <div className="flex items-center justify-around">
        {METRICS.map((m) => (
          <CircleProgress key={m.label} value={m.value} label={m.label} />
        ))}
      </div>
    </SectionCard>
  )
}

export default ProgressCircles

import SectionCard from './SectionCard'

const METRICS = [
  { label: 'Conversion', value: 75, stroke: 'hsl(217,72%,56%)' },
  { label: 'Retencion', value: 60, stroke: 'hsl(173,58%,44%)' },
  { label: 'Satisfaccion', value: 90, stroke: 'hsl(43,74%,58%)' },
]

function CircleProgress({ value, label, stroke }) {
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width="96"
        height="96"
        viewBox="0 0 96 96"
        className="shrink-0"
        aria-label={`${label}: ${value}%`}
        role="img"
      >
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="hsl(228,8%,18%)"
          strokeWidth="6"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 48 48)"
          className="transition-all duration-700"
        />
        <text
          x="48"
          y="48"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-foreground text-base font-bold"
        >
          {value}%
        </text>
      </svg>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  )
}

export function ProgressCircles() {
  return (
    <SectionCard title="Metricas clave">
      <div className="flex items-center justify-around py-2">
        {METRICS.map((m) => (
          <CircleProgress key={m.label} value={m.value} label={m.label} stroke={m.stroke} />
        ))}
      </div>
    </SectionCard>
  )
}

export default ProgressCircles

export function SectionCard({ title, children, className = '' }) {
  return (
    <section className={`rounded-xl border border-border bg-card p-6 ${className}`}>
      <h2 className="mb-4 text-base font-semibold text-card-foreground">
        {title}
      </h2>
      {children}
    </section>
  )
}

export default SectionCard

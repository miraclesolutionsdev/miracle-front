export function SectionCard({ title, children, className = '' }) {
  return (
    <section className={`rounded-xl border border-border bg-card p-6 shadow-sm ${className}`}>
      {title && (
        <h2 className="mb-5 text-sm font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}

export default SectionCard

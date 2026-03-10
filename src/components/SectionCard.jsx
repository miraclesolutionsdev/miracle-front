export function SectionCard({ title, children, className = '' }) {
  return (
    <section className={`relative rounded-xl border border-border bg-card shadow-sm overflow-hidden ${className}`}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="p-6">
        {title && (
          <h2 className="mb-5 text-sm font-semibold tracking-tight text-foreground">
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  )
}

export default SectionCard

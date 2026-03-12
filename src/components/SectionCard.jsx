export function SectionCard({ title, description, children, className = '', action }) {
  return (
    <section className={`relative rounded-xl border border-border bg-card overflow-hidden ${className}`}>
      {/* Accent line top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="p-6">
        {(title || action) && (
          <div className={`flex items-start justify-between gap-4 ${children ? 'mb-5' : ''}`}>
            <div className="min-w-0">
              {title && (
                <h2 className="text-[15px] font-semibold tracking-tight text-foreground leading-snug">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

export default SectionCard

'use client'

interface StatItem {
  label: string
  value: string
  icon?: string
}

interface TrustStatsProps {
  stats?: StatItem[]
}

export function TrustStats({ stats = [] }: TrustStatsProps) {
  if (!stats || stats.length === 0) return null

  return (
    <section className="py-16 bg-bg-surface border-y border-border-subtle">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-text-muted text-sm text-center mb-8 font-semibold tracking-wider uppercase font-mono">
          Trusted by traders worldwide
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group">
              <p className="text-3xl md:text-5xl font-extrabold text-accent-cyan mb-2 font-mono group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </p>
              <p className="text-text-secondary text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default TrustStats

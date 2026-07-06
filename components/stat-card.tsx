import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  trend,
}: {
  title: string
  value: string
  hint?: string
  icon: LucideIcon
  trend?: 'up' | 'down'
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold text-foreground">{value}</p>
      {hint && (
        <p
          className={cn(
            'mt-1 text-xs font-medium',
            trend === 'up' && 'text-chart-3',
            trend === 'down' && 'text-destructive',
            !trend && 'text-muted-foreground',
          )}
        >
          {hint}
        </p>
      )}
    </div>
  )
}

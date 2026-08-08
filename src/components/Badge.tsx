import type { ReactNode } from 'react'

type BadgeVariant = 'popular' | 'new' | 'spicy' | 'chef'

const badgeColors: Record<BadgeVariant, string> = {
  popular: 'bg-orange/20 text-orange border-orange/30',
  new: 'bg-amber/20 text-amber border-amber/30',
  spicy: 'bg-red/20 text-red border-red/30',
  chef: 'bg-amber/20 text-amber border-amber/30',
}

interface BadgeProps {
  variant: BadgeVariant
  children: ReactNode
}

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold uppercase tracking-wider border rounded ${badgeColors[variant]}`}>
      {children}
    </span>
  )
}

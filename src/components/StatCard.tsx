import { Card } from './Card'

interface StatCardProps {
  label: string
  value: number
  icon?: string
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4">
      {icon && <span className="text-2xl">{icon}</span>}
      <div>
        <p className="text-sm text-text-secondary">{label}</p>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
      </div>
    </Card>
  )
}

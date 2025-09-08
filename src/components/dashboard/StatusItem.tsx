import { LucideIcon } from "lucide-react"

interface StatusItemProps {
  icon: LucideIcon
  count: number
  label: string
  iconColor?: string
  iconBgColor?: string
}

export function StatusItem({ 
  icon: Icon, 
  count, 
  label, 
  iconColor = "text-muted-foreground",
  iconBgColor = "bg-muted-foreground/10"
}: StatusItemProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className={`w-8 h-8 ${iconBgColor} rounded-lg flex items-center justify-center`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div className="flex gap-2 items-center">
        <div className="text-2xl font-bold text-text-dark">{count}</div>
        <div className="text-sm text-text-medium">{label}</div>
      </div>
    </div>
  )
}

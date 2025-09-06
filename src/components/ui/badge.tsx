import * as React from "react"
import { Badge as RadixBadge } from "@radix-ui/themes"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.ComponentProps<typeof RadixBadge> {
  className?: string
}

function Badge({ className, ...props }: BadgeProps) {
  return (
    <RadixBadge 
      className={cn(className)} 
      {...props} 
    />
  )
}

export { Badge }

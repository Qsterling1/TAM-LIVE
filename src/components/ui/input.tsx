import * as React from 'react'
import { cn } from '../../lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-full border border-stitch-border bg-stitch-muted/60 px-4 text-sm text-stitch-foreground shadow-inner shadow-black/30 ring-offset-stitch-background placeholder:text-stitch-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stitch-glow focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
})
Input.displayName = 'Input'

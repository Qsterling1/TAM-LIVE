import * as React from 'react'
import { cn } from '../../lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[56px] w-full resize-none rounded-2xl border border-stitch-border bg-stitch-muted/70 px-4 py-3 text-sm text-stitch-foreground shadow-inner shadow-black/30 ring-offset-stitch-background placeholder:text-stitch-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stitch-glow focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

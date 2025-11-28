import { Sparkles, User } from 'lucide-react'
import { cn } from '../../lib/utils'

export type ChatAuthor = 'user' | 'ai'

export type ChatBubbleProps = {
  author: ChatAuthor
  content: string
  timestamp?: string
}

export const ChatBubble = ({ author, content, timestamp }: ChatBubbleProps) => {
  const isUser = author === 'user'

  return (
    <div className={cn('flex w-full gap-3', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[70%] rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-panel-soft',
          isUser
            ? 'bg-gradient-to-br from-stitch-accent to-[#3b6bff] text-white border-transparent'
            : 'bg-stitch-muted/80 text-stitch-foreground border-stitch-border',
        )}
      >
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-stitch-subtle">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10 text-white">
            {isUser ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
          </span>
          <span className="font-semibold">{isUser ? 'You' : 'Tam'}</span>
          {timestamp && <span className="text-[10px] text-stitch-subtle">{timestamp}</span>}
        </div>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  )
}

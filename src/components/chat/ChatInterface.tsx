import { ActivitySquare } from 'lucide-react'
import { ChatBubble, type ChatBubbleProps } from './ChatBubble'
import { ScrollArea } from '../ui/scroll-area'

export type ChatMessage = ChatBubbleProps & { id: string }

type ChatInterfaceProps = {
  messages: ChatMessage[]
}

export const ChatInterface = ({ messages }: ChatInterfaceProps) => {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border border-stitch-border bg-stitch-surface shadow-panel-soft">
      <div className="flex items-center justify-between border-b border-stitch-border px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <ActivitySquare className="h-4 w-4 text-stitch-accent" />
          Thread
        </div>
        <div className="text-xs text-stitch-subtle">History auto-saves with the active Tam</div>
      </div>
      <ScrollArea className="flex-1 min-h-0 px-4 py-4">
        <div className="space-y-3 pr-2">
          {messages.map((message) => (
            <ChatBubble key={message.id} {...message} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

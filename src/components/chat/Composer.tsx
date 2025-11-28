import type { FormEvent } from 'react'
import { Mic, Paperclip, Send, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

type ComposerProps = {
  value: string
  onChange: (value: string) => void
  onSend: (value: string) => void
  listening?: boolean
}

export const Composer = ({ value, onChange, onSend, listening = false }: ComposerProps) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSend(value)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-full border border-stitch-border bg-stitch-panel px-4 py-3 shadow-stitch-glow/40"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" aria-label="Attach">
            <Paperclip className="h-4 w-4" />
          </Button>
          <div className="flex-1 rounded-2xl bg-stitch-muted/60 px-3 py-2 md:px-4">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-stitch-subtle">
              <Sparkles className="h-3.5 w-3.5 text-stitch-accent" />
              Visual Dictation
              {listening && (
                <span className="ml-2 rounded-full bg-stitch-accent/20 px-2 py-0.5 text-[10px] text-stitch-accent">
                  Listening
                </span>
              )}
            </div>
            <Textarea
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="Describe what you see or dictate a command..."
              className="mt-2 border-none bg-transparent px-0 py-1 text-base shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-2 md:w-auto">
          <Button type="button" variant="surface" size="icon" aria-label="Start dictation">
            <Mic className="h-4 w-4" />
          </Button>
          <Button type="submit" size="lg" className="rounded-full px-6">
            Send
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  )
}

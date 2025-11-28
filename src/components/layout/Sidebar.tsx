import { Layers3, Plus, Settings, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { cn } from '../../lib/utils'
import type { TamProfile } from '../../lib/tams'

type SidebarProps = {
  tams: TamProfile[]
  activeTamId: string
  onSelect: (id: string) => void
}

export const Sidebar = ({ tams, activeTamId, onSelect }: SidebarProps) => {
  return (
    <aside className="flex h-full w-[260px] flex-col rounded-2xl bg-stitch-surface border border-stitch-border shadow-panel-soft">
      <div className="flex items-center gap-2 border-b border-stitch-border px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stitch-muted text-stitch-foreground">
          <Layers3 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-stitch-foreground">Tam Manager</p>
          <p className="text-xs text-stitch-subtle">Switch brains and contexts</p>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-3">
        <div className="space-y-2">
          {tams.map((tam) => {
            const isActive = tam.id === activeTamId
            return (
              <button
                key={tam.id}
                type="button"
                onClick={() => onSelect(tam.id)}
                className={cn(
                  'w-full rounded-xl border px-3 py-3 text-left transition-colors',
                  isActive
                    ? 'border-stitch-glow bg-stitch-muted text-white shadow-stitch-glow'
                    : 'border-stitch-border bg-stitch-panel/70 text-stitch-foreground hover:border-stitch-glow/60 hover:bg-stitch-muted',
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stitch-muted">
                    <Sparkles className="h-4 w-4 text-stitch-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{tam.name}</p>
                    <p className="text-xs text-stitch-subtle">{tam.specialty}</p>
                  </div>
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      tam.status === 'active' ? 'bg-stitch-accent' : 'bg-stitch-subtle',
                    )}
                    aria-label={tam.status === 'active' ? 'Active' : 'Idle'}
                  />
                </div>
                <p className="mt-2 text-xs text-stitch-subtle">{tam.summary}</p>
              </button>
            )
          })}
        </div>
      </ScrollArea>

      <div className="border-t border-stitch-border px-4 py-3">
        <Button variant="surface" className="w-full justify-between">
          <span className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Workspace Settings
          </span>
          <span className="text-xs text-stitch-subtle">Ctrl + ,</span>
        </Button>
      </div>
    </aside>
  )
}

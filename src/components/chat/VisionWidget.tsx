import { Camera, Radio } from 'lucide-react'
import { cn } from '../../lib/utils'

type VisionWidgetProps = {
  status?: 'idle' | 'listening' | 'connected'
  title?: string
}

export const VisionWidget = ({
  status = 'connected',
  title = 'OBS Virtual Camera',
}: VisionWidgetProps) => {
  const statusLabel =
    status === 'listening' ? 'Listening...' : status === 'connected' ? 'Live Feed' : 'Idle'

  return (
    <div className="relative overflow-hidden rounded-2xl border border-stitch-border bg-gradient-to-br from-[#182241] via-[#0f111a] to-[#0a0c14] shadow-stitch-glow">
      <div
        className={cn(
          'absolute inset-0 rounded-2xl border',
          status !== 'idle' ? 'border-stitch-glow/60' : 'border-stitch-border',
        )}
      />
      <div className="aspect-video w-full">
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          <div className="flex items-center gap-3 rounded-full bg-black/30 px-3 py-2 backdrop-blur">
            <Camera className="h-4 w-4 text-stitch-accent" />
            <div>
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="text-xs text-stitch-subtle">16:9 | 4K ready</p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-full bg-black/30 px-4 py-2 text-xs text-white backdrop-blur">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'h-2.5 w-2.5 rounded-full',
                  status === 'connected'
                    ? 'bg-stitch-accent'
                    : status === 'listening'
                      ? 'bg-stitch-success'
                      : 'bg-stitch-subtle',
                )}
              />
              <span className="uppercase tracking-wide">{statusLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-stitch-subtle" />
              <span className="text-stitch-subtle">Ready for OBS</span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(79,139,255,0.18),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(39,197,255,0.16),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(79,139,255,0.12),transparent_32%)]" />
      </div>
    </div>
  )
}

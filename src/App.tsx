import { useMemo, useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { VisionWidget } from './components/chat/VisionWidget'
import { ChatInterface, type ChatMessage } from './components/chat/ChatInterface'
import { Composer } from './components/chat/Composer'
import { tamProfiles } from './lib/tams'

const makeId = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    author: 'ai',
    content: 'Welcome back. I can see your Unity scene. Want me to zoom in on the inspector or check the lighting settings?',
    timestamp: 'Now',
  },
  {
    id: '2',
    author: 'user',
    content: 'Show me the camera frustum and remind me of the safe frame for 4K capture.',
    timestamp: 'Now',
  },
  {
    id: '3',
    author: 'ai',
    content: 'On it. I’ll keep the OBS feed pinned at 16:9 and narrate the steps as you move.',
    timestamp: 'Now',
  },
]

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [activeTamId, setActiveTamId] = useState(tamProfiles[0]?.id ?? 'unity')

  const activeTam = useMemo(() => tamProfiles.find((tam) => tam.id === activeTamId), [activeTamId])

  const handleSend = (value: string) => {
    const text = value.trim()
    if (!text) return

    const userMessage: ChatMessage = {
      id: makeId(),
      author: 'user',
      content: text,
      timestamp: 'Just now',
    }

    const assistantMessage: ChatMessage = {
      id: makeId(),
      author: 'ai',
      content: 'Copy. I’ll keep watching the feed and narrate the next clicks.',
      timestamp: 'Queued',
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput('')
  }

  return (
    <div className="min-h-screen bg-stitch-background text-stitch-foreground">
      <div className="mx-auto flex h-screen max-w-[1440px] gap-4 px-4 py-6 md:px-6">
        <Sidebar tams={tamProfiles} activeTamId={activeTamId} onSelect={setActiveTamId} />

        <main className="flex flex-1 flex-col gap-4 min-h-0">
          <header className="flex flex-col gap-1 rounded-2xl border border-stitch-border bg-stitch-surface px-4 py-3 shadow-panel-soft md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-stitch-foreground">Stitch Workspace</p>
              <p className="text-xs text-stitch-subtle">
                {activeTam ? `${activeTam.name} · ${activeTam.specialty}` : 'Choose a Tam to start'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-stitch-subtle">
              <span className="h-2 w-2 rounded-full bg-stitch-accent" />
              Live dictation + OBS ready
            </div>
          </header>

          <VisionWidget status="listening" />

          <div className="flex flex-1 min-h-0 flex-col gap-4">
            <ChatInterface messages={messages} />
            <Composer value={input} onChange={setInput} onSend={handleSend} listening />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App

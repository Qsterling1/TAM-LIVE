export type TamProfile = {
  id: string
  name: string
  specialty: string
  summary: string
  status: 'active' | 'idle'
}

export const tamProfiles: TamProfile[] = [
  {
    id: 'unity',
    name: 'Unity Expert',
    specialty: '3D + Gameplay Systems',
    summary: 'Guides through scene setup, prefabs, and complex inspector wiring.',
    status: 'active',
  },
  {
    id: 'blender',
    name: 'Blender Guru',
    specialty: 'Modeling + Shading',
    summary: 'Helps with nodes, rigging, and viewport troubleshooting in real time.',
    status: 'idle',
  },
  {
    id: 'ops',
    name: 'Ops Assistant',
    specialty: 'Email + Docs',
    summary: 'Drafts comms and paperwork while keeping tone aligned with the brief.',
    status: 'idle',
  },
]

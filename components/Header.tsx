'use client'

interface HeaderProps {
  onAddTask: () => void
  onAddContact: () => void
}

export default function Header({ onAddTask, onAddContact }: HeaderProps) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="border-b border-zinc-800 bg-zinc-950 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-white tracking-tight">Personal OS</h1>
        <p className="text-sm text-zinc-500 mt-0.5">{today}</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onAddContact}
          className="px-4 py-2 rounded-md text-sm font-medium bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
        >
          + Contact
        </button>
        <button
          onClick={onAddTask}
          className="px-4 py-2 rounded-md text-sm font-medium bg-white text-zinc-900 hover:bg-zinc-100 transition-colors"
        >
          + Task
        </button>
      </div>
    </header>
  )
}

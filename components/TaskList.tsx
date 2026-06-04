'use client'

import { useState, useEffect } from 'react'
import type { Task } from '@/lib/types'

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-zinc-700/50 text-zinc-400 border-zinc-600',
}

const STATUS_COLORS: Record<string, string> = {
  todo: 'bg-zinc-800 text-zinc-400',
  in_progress: 'bg-blue-500/20 text-blue-400',
  done: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-zinc-800 text-zinc-600 line-through',
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all')

  useEffect(() => {
    fetch('/api/tasks')
      .then((r) => r.json())
      .then((data) => { setTasks(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => { setTasks([]); setLoading(false) })
  }, [])

  const toggleStatus = async (task: Task) => {
    const next: Record<string, string> = {
      todo: 'in_progress',
      in_progress: 'done',
      done: 'todo',
      cancelled: 'todo',
    }
    const updated = { ...task, status: next[task.status] as Task['status'] }
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)))
    await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: task.id, status: updated.status }),
    })
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-zinc-500">Loading...</p>
        <div className="animate-pulse space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-zinc-800 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  const filtered = filter === 'all' ? (tasks ?? []) : (tasks ?? []).filter((t) => t.status === filter)

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(['all', 'todo', 'in_progress', 'done'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter === f ? 'bg-white text-zinc-900' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-zinc-500 text-sm py-4 text-center">No tasks here</p>
      )}

      <ul className="space-y-2">
        {filtered.map((task) => (
          <li
            key={task.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <button
              onClick={() => toggleStatus(task)}
              className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                task.status === 'done'
                  ? 'bg-green-500 border-green-500'
                  : 'border-zinc-600 hover:border-zinc-400'
              }`}
            />
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${task.status === 'done' ? 'line-through text-zinc-500' : 'text-zinc-100'}`}>
                {task.title}
              </p>
              {task.due_date && (
                <p className="text-xs text-zinc-500 mt-0.5">Due {task.due_date}</p>
              )}
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[task.priority]}`}>
              {task.priority}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

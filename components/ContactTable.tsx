'use client'

import { useState, useEffect } from 'react'
import type { Contact } from '@/lib/types'

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400',
  client: 'bg-blue-500/20 text-blue-400',
  prospect: 'bg-yellow-500/20 text-yellow-400',
  inactive: 'bg-zinc-700 text-zinc-500',
}

export default function ContactTable() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/contacts')
      .then((r) => r.json())
      .then((data) => { setContacts(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => { setContacts([]); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-zinc-500">Loading...</p>
        <div className="animate-pulse space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-zinc-800 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  const filtered = (contacts ?? []).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Search contacts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
      />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-zinc-500 text-left border-b border-zinc-800">
              <th className="pb-2 font-medium">Name</th>
              <th className="pb-2 font-medium">Company</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Next Action</th>
              <th className="pb-2 font-medium">Last Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="py-6 text-center text-zinc-500">No contacts found</td></tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-900/50 transition-colors">
                <td className="py-2.5 pr-4">
                  <div className="text-zinc-100 font-medium">{c.name}</div>
                  {c.email && <div className="text-zinc-500 text-xs">{c.email}</div>}
                </td>
                <td className="py-2.5 pr-4 text-zinc-400">{c.company ?? '—'}</td>
                <td className="py-2.5 pr-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_BADGE[c.status]}`}>
                    {c.status}
                  </span>
                </td>
                <td className="py-2.5 pr-4 text-zinc-400 max-w-[160px] truncate">{c.next_action ?? '—'}</td>
                <td className="py-2.5 text-zinc-500 text-xs">{c.last_contact ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

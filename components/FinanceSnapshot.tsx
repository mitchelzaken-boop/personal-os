'use client'

import { useState, useEffect } from 'react'
import type { Finance } from '@/lib/types'

export default function FinanceSnapshot() {
  const [finances, setFinances] = useState<Finance[]>([])
  const [loading, setLoading] = useState(true)

  const currentMonth = new Date().toISOString().slice(0, 7)

  useEffect(() => {
    fetch(`/api/finances?month=${currentMonth}`)
      .then((r) => r.json())
      .then((data) => { setFinances(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => { setFinances([]); setLoading(false) })
  }, [currentMonth])

  const fmt = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

  if (loading) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-zinc-500">Loading...</p>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-zinc-800 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  const safe = finances ?? []
  const income = safe.filter((f) => f.type === 'income').reduce((s, f) => s + f.amount, 0)
  const expenses = safe.filter((f) => f.type === 'expense').reduce((s, f) => s + f.amount, 0)
  const net = income - expenses

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
          <p className="text-xs text-zinc-500 mb-1">Income</p>
          <p className="text-lg font-semibold text-green-400">{fmt(income)}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
          <p className="text-xs text-zinc-500 mb-1">Expenses</p>
          <p className="text-lg font-semibold text-red-400">{fmt(expenses)}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
          <p className="text-xs text-zinc-500 mb-1">Net</p>
          <p className={`text-lg font-semibold ${net >= 0 ? 'text-white' : 'text-red-400'}`}>{fmt(net)}</p>
        </div>
      </div>

      <div className="space-y-1.5">
        {safe.slice(0, 8).map((f) => (
          <div key={f.id} className="flex items-center justify-between py-2 border-b border-zinc-800/50">
            <div>
              <p className="text-sm text-zinc-200">{f.description ?? f.category}</p>
              <p className="text-xs text-zinc-500">{f.date} · {f.category}</p>
            </div>
            <span className={`text-sm font-medium ${f.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
              {f.type === 'income' ? '+' : '-'}{fmt(f.amount)}
            </span>
          </div>
        ))}
        {safe.length === 0 && (
          <p className="text-zinc-500 text-sm text-center py-4">No transactions this month</p>
        )}
      </div>
    </div>
  )
}

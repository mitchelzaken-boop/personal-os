import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function GET() {
  const today = new Date().toISOString().split('T')[0]
  const monthStart = `${today.slice(0, 7)}-01`

  const [tasksRes, financesRes, memoryRes] = await Promise.all([
    supabase
      .from('tasks')
      .select('title, priority, status, due_date')
      .neq('status', 'done')
      .order('priority', { ascending: false }),
    supabase
      .from('finances')
      .select('amount, type, category, date')
      .gte('date', monthStart)
      .lte('date', today),
    supabase
      .from('memory')
      .select('key, value'),
  ])

  const tasks = tasksRes.data ?? []
  const finances = financesRes.data ?? []
  const memory = memoryRes.data ?? []

  const income = finances.filter((f) => f.type === 'income').reduce((s, f) => s + f.amount, 0)
  const expenses = finances.filter((f) => f.type === 'expense').reduce((s, f) => s + f.amount, 0)
  const net = income - expenses

  const memoryLines = memory.length
    ? memory.map((m) => `${m.key}: ${m.value}`).join('\n')
    : 'No memory entries yet.'

  const taskLines = tasks.length
    ? tasks.map((t) => `- [${t.priority}] ${t.title}${t.due_date ? ` (due ${t.due_date})` : ''}`).join('\n')
    : 'No open tasks.'

  const prompt = `Here is what I know about Mitchel:
${memoryLines}

His open tasks:
${taskLines}

This month: income $${income.toFixed(0)}, expenses $${expenses.toFixed(0)}, net $${net.toFixed(0)}

Write a sharp 2-sentence daily briefing. Tell him exactly what to focus on today. Be direct, not generic.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 256,
    messages: [{ role: 'user', content: prompt }],
  })

  const briefing = message.content[0].type === 'text' ? message.content[0].text : ''

  return NextResponse.json({ briefing, tasks, income, expenses, net })
}

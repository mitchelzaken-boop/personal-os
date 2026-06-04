import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  const body = await request.json()
  const message = body?.message

  if (!message) return NextResponse.json({ ok: true })

  const text: string = message?.text ?? ''
  const chatId: number = message?.chat?.id

  if (!text) return NextResponse.json({ ok: true })

  // /tasks — list open tasks
  if (text === '/tasks') {
    const { data } = await supabase
      .from('tasks')
      .select('title, priority')
      .neq('status', 'done')
      .order('created_at', { ascending: false })
      .limit(10)

    const list = (data ?? []).map((t) => `• [${t.priority}] ${t.title}`).join('\n') || 'No open tasks.'
    await sendTelegram(chatId, `Open tasks:\n${list}`)
    return NextResponse.json({ ok: true })
  }

  // /briefing — AI daily briefing
  if (text === '/briefing') {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
      const res = await fetch(`${appUrl}/api/briefing`)
      const data = await res.json()
      await sendTelegram(chatId, data.briefing ?? 'No briefing available.')
    } catch {
      await sendTelegram(chatId, 'Could not generate briefing.')
    }
    return NextResponse.json({ ok: true })
  }

  // All other messages — extract task via Claude and insert
  try {
    const aiRes = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 256,
      messages: [{
        role: 'user',
        content: `Extract a task from this message. Return only JSON with no markdown or code fences:
{ "title": string, "priority": "urgent"|"high"|"normal"|"low", "cat": string, "notes": string }
Message: ${text}`,
      }],
    })

    const raw = aiRes.content[0].type === 'text' ? aiRes.content[0].text.trim() : ''
    const parsed = JSON.parse(raw)

    const title: string = parsed.title ?? text
    const priority: string = ['urgent','high','normal','low'].includes(parsed.priority) ? parsed.priority : 'normal'
    const category: string = parsed.cat ?? 'PERSONAL'
    const notes: string = parsed.notes ?? ''

    await supabase.from('tasks').insert({
      title,
      priority,
      category,
      notes: notes || null,
      status: 'todo',
    })

    await sendTelegram(chatId, `✅ Task added: ${title} (${priority})`)
  } catch {
    // Fallback: insert the raw message as a task
    await supabase.from('tasks').insert({
      title: text,
      priority: 'normal',
      category: 'PERSONAL',
      status: 'todo',
    })
    await sendTelegram(chatId, `✅ Task added: ${text} (normal)`)
  }

  return NextResponse.json({ ok: true })
}

async function sendTelegram(chatId: number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token || !chatId) return
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  })
}

import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  const { meal } = await request.json()

  if (!meal?.trim()) {
    return NextResponse.json({ error: 'meal is required' }, { status: 400 })
  }

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `Estimate the nutrition for this meal: ${meal}\nReturn only JSON: { "calories": number, "protein": number, "carbs": number, "fat": number }\nBe realistic. No extra text.`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const nutrition = JSON.parse(text.trim())
    return NextResponse.json(nutrition)
  } catch {
    return NextResponse.json({ error: 'Failed to parse nutrition data' }, { status: 500 })
  }
}

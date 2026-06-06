import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  try {
    const { meal } = await request.json()

    if (!meal?.trim()) {
      return NextResponse.json({ error: 'meal is required' }, { status: 400 })
    }

    console.log('[nutrition] estimating for:', meal)

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: `Estimate the nutrition for this meal: ${meal}\nReturn ONLY raw JSON with no markdown, no code fences, no explanation: { "calories": number, "protein": number, "carbs": number, "fat": number }\nBe realistic.`,
        },
      ],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''
    console.log('[nutrition] raw Claude response:', raw)

    // Strip markdown fences in case Claude wraps the JSON
    const cleaned = raw.replace(/```json?\s*/gi, '').replace(/```/g, '').trim()
    console.log('[nutrition] cleaned:', cleaned)

    const nutrition = JSON.parse(cleaned)
    console.log('[nutrition] parsed nutrition:', nutrition)

    return NextResponse.json(nutrition)
  } catch (err) {
    console.error('[nutrition] error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

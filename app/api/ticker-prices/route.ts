import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const apiKey = process.env.OPENROUTER_API_KEY

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://anurajfx.com',
        'X-Title': 'ANURAJ FX Intelligence Deck'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: `Return the current market price and daily change percentage for XAUUSD (Gold spot price), NQ Futures (Nasdaq 100 Futures), and EURUSD. Format the output strictly as a JSON object: {"XAUUSD": {"value": "$2,418", "change": "+0.45%", "up": true}, "NQ_Futures": {"value": "18,450", "change": "+1.23%", "up": true}, "EURUSD": {"value": "1.0856", "change": "-0.12%", "up": false}}. Do not include any markdown backticks, markdown JSON blocks, or extra explanation text. Just output the raw JSON string.`
          }
        ],
        temperature: 0.1
      }),
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      throw new Error(`OpenRouter returned HTTP ${response.status}`)
    }

    const json = await response.json()
    const textContent = json.choices?.[0]?.message?.content?.trim() || ''
    const cleanText = textContent.replace(/```json|```/g, '').trim()
    const parsedData = JSON.parse(cleanText)

    return NextResponse.json({
      success: true,
      source: 'openrouter',
      data: parsedData
    })
  } catch (error: any) {
    console.error('Error fetching ticker prices from OpenRouter:', error)
    return NextResponse.json({
      success: true,
      source: 'fallback-on-error',
      data: {
        XAUUSD: { value: '$2,418', change: '+0.45%', up: true },
        NQ_Futures: { value: '18,450', change: '+1.23%', up: true },
        EURUSD: { value: '1.0856', change: '-0.12%', up: false }
      }
    })
  }
}

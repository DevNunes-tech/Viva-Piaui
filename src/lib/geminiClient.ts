import { REGIONS } from '../data/regions'

const GEMINI_MODEL = 'gemini-2.0-flash'

function buildSystemPrompt(locale: string): string {
  const territories = REGIONS.map((r) => r.id).join(', ')
  if (locale.startsWith('en')) {
    return [
      'You are the educational guide for the web app "Piauí Viva" (Piauí, Brazil).',
      'Topics: territorial tourism, biomes, creative economy, school and environmental education.',
      `Territory ids in the app data: ${territories}.`,
      'App areas: Home (territories & biomes), Map (municipalities GeoJSON + spots), Itinerary (interest filters), Creative economy, Innovation (this chat).',
      'Rules: answer clearly in English; keep under about 180 words; do not invent prices, phone numbers or event dates; if unsure, say you are not sure.',
      'Encourage sustainable tourism and respect for local communities.',
    ].join(' ')
  }
  return [
    'Você é o guia educativo do aplicativo web "Piauí Viva" (estado do Piauí, Brasil).',
    'Temas: turismo territorial, biomas, economia criativa, educação escolar e ambiental.',
    `Identificadores de território nos dados: ${territories}.`,
    'Áreas do app: Início (territórios e biomas), Mapa (GeoJSON de municípios + pontos), Roteiro (filtros de interesse), Economia criativa, Inovação (este chat).',
    'Regras: responda em português do Brasil; seja breve (cerca de 180 palavras); não invente preços, telefones ou datas de eventos; se não souber, diga que não sabe.',
    'Incentive turismo responsável e respeito a comunidades locais.',
  ].join(' ')
}

export type AssistantChatMessage = { role: 'user' | 'assistant'; text: string }

export async function generateGeminiAssistantReply(
  apiKey: string,
  locale: string,
  conversation: AssistantChatMessage[],
): Promise<string> {
  const contents = conversation.slice(1).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.text }],
  }))

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: buildSystemPrompt(locale) }] },
      contents,
      generationConfig: {
        temperature: 0.55,
        maxOutputTokens: 900,
      },
    }),
  })

  if (!res.ok) {
    const errBody = await res.text()
    throw new Error(errBody || `Gemini HTTP ${res.status}`)
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[]
    error?: { message?: string }
  }

  if (data.error?.message) {
    throw new Error(data.error.message)
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
  if (!text) {
    throw new Error('Empty Gemini response')
  }
  return text
}

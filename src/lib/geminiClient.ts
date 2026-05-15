import { REGIONS } from '../data/regions'

const GEMINI_MODEL = 'gemini-2.0-flash'

function buildSystemPrompt(locale: string): string {
  const territories = REGIONS.map((r) => r.id).join(', ')
  if (locale.startsWith('en')) {
    return [
      'You are the Piauí (Brazil) guide inside the "Piauí Viva" web app.',
      'Answer questions about the state broadly: cities, history, culture, festivals, religion, economy, environment, tourism, sports, and public life.',
      `The app also lists territory ids for context: ${territories}.`,
      'You are not limited to repeating app screens: use general knowledge about Piauí when helpful.',
      'Rules: clear English; about 180 words max; do not invent specific prices, personal phone numbers, or exact future event schedules; if unsure, say so.',
      'Encourage respectful tourism and accurate, neutral tone about communities and beliefs.',
    ].join(' ')
  }
  return [
    'Você é o guia do estado do Piauí (Brasil) no aplicativo web "Piauí Viva".',
    'Responda sobre o Piauí de forma ampla: cidades, história, cultura, festas, religião, economia, meio ambiente, turismo, esporte e vida pública.',
    `O app traz territórios com estes ids (contexto opcional): ${territories}.`,
    'Não se limite a descrever telas do aplicativo: use conhecimento geral sobre o Piauí quando fizer sentido.',
    'Regras: português do Brasil; cerca de 180 palavras; não invente preços exatos, telefones pessoais nem datas futuras de eventos específicos; se não souber, diga.',
    'Incentive respeito a comunidades, tradições e crenças, com tom neutro e informativo.',
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

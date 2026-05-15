import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { REGIONS } from '../data/regions'
import { generateGeminiAssistantReply } from '../lib/geminiClient'
import { recordAssistantTurn, recordDeltaMention } from '../lib/gamification'
import '../styles/VirtualPiauiAssistant.css'

type Message = { role: 'user' | 'assistant'; text: string }

function buildReply(raw: string, t: TFunction): string {
  const q = raw.trim().toLowerCase()
  if (!q) return t('assistant.reply.empty')

  if (/\b(bioma|biomas|caatinga|cerrado|cocais|atlântica|atlantica)\b/.test(q)) {
    return t('assistant.reply.biomes')
  }
  if (/\b(delta|parnaíba|parnaiba|litoral|praia)\b/.test(q)) {
    return t('assistant.reply.delta')
  }
  if (/\b(roteiro|itinerário|itinerario|2 dias|dois dias)\b/.test(q)) {
    return t('assistant.reply.itinerary')
  }
  if (/\b(professor|professora|escola|pedagog|educação ambiental|educacao ambiental|aluno)\b/.test(q)) {
    return t('assistant.reply.education')
  }
  if (/\b(município|municipio|224)\b/.test(q)) {
    return t('assistant.reply.municipalities')
  }
  if (/\b(capivara|arqueologia|pré-historia|pre-historia)\b/.test(q)) {
    return t('assistant.reply.capivara')
  }
  if (/\b(economia criativa|artesanato|gastronomia|festa|bumba)\b/.test(q)) {
    return t('assistant.reply.creative')
  }
  if (/\b(teresina|capital)\b/.test(q)) {
    return t('assistant.reply.teresina')
  }

  const tokens = q.split(/\s+/).filter((w) => w.length > 2)
  for (const region of REGIONS) {
    const id = region.id.toLowerCase()
    if (tokens.some((w) => id.includes(w) || w.includes(id))) {
      return t('assistant.reply.regionHint', { region: t(region.nameKey) })
    }
  }

  return t('assistant.reply.default')
}

type VirtualPiauiAssistantProps = {
  onInteraction?: () => void
}

export default function VirtualPiauiAssistant({ onInteraction }: VirtualPiauiAssistantProps) {
  const { t, i18n } = useTranslation()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: t('assistant.welcome') },
  ])

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim()

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const lower = text.toLowerCase()
    if (/\b(delta|parnaíba|parnaiba)\b/.test(lower)) {
      recordDeltaMention()
    }

    const withUser: Message[] = [...messages, { role: 'user', text }]
    setMessages(withUser)
    setInput('')
    setLoading(true)

    let reply: string
    try {
      if (apiKey) {
        reply = await generateGeminiAssistantReply(apiKey, i18n.language, withUser)
      } else {
        reply = buildReply(text, t)
      }
    } catch {
      reply = apiKey
        ? `${t('assistant.error')}\n\n${buildReply(text, t)}`
        : buildReply(text, t)
    }

    setMessages((prev) => [...prev, { role: 'assistant', text: reply }])
    setLoading(false)
    recordAssistantTurn()
    onInteraction?.()
  }

  return (
    <div className="virtual-assistant">
      <div className="virtual-assistant-thread" role="log" aria-live="polite">
        {messages.map((m, i) => (
          <div key={`${i}-${m.role}`} className={`virtual-assistant-msg virtual-assistant-msg-${m.role}`}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="virtual-assistant-msg virtual-assistant-msg-assistant virtual-assistant-loading">
            {t('assistant.loading')}
          </div>
        )}
      </div>
      <div className="virtual-assistant-input-row">
        <label className="sr-only" htmlFor="assistant-input">
          {t('assistant.inputLabel')}
        </label>
        <input
          id="assistant-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              void send()
            }
          }}
          placeholder={t('assistant.placeholder')}
          autoComplete="off"
          disabled={loading}
        />
        <button type="button" className="virtual-assistant-send" onClick={() => void send()} disabled={loading}>
          {t('assistant.send')}
        </button>
      </div>
    </div>
  )
}

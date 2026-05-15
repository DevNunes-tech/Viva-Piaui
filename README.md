# Piauí Viva — Ecossistema de turismo, cultura e educação

Aplicação web progressiva (PWA) para explorar territórios, biomas, economia criativa e roteiros do Piauí, com interface em **português** e **inglês** (`react-i18next`).

## IA (opcional)

O assistente na página **Inovação** pode usar a API Google Gemini se existir a variável `VITE_GEMINI_API_KEY` (veja `.env.example`). Sem ela, o assistente usa respostas locais. Não commite chaves no repositório.

## Inovação (escopo atual)

- **Roteiros por interesse** — filtros temáticos e sugestão de pontos no construtor de roteiro.
- **Assistente** — respostas via API quando a variável acima está definida; caso contrário, modo local.
- **Gamificação** — pontos, badges e quiz rápido (`localStorage`).
- **Contribuição (protótipo)** — formulário gravado só no navegador; produção exigiria backend e moderação.

## Evolução futura

- **Mapa inteligente** — filtros avançados (bioma, acessibilidade, distância, camadas educacionais, etc.) além do GeoJSON e pontos atuais.

<!--
  Realidade aumentada (RA): havia um simulador com câmera e geolocalização;
  foi removido do código para simplificar o escopo. Uma fase futura pode
  reintroduzir RA com ancoragem espacial, modelos 3D e conteúdo pedagógico em campo.
-->

## Stack e pastas (resumo)

- React 19, TypeScript, Vite, PWA, Leaflet, `react-i18next`.
- `src/lib/geminiClient.ts` — chamada REST ao modelo configurado.
- `src/components/VirtualPiauiAssistant.tsx` — UI do chat.
- Dados: `src/data/regions.ts`, `cities.ts`, `travelInterests.ts`, `public/data/municipios_piaui.json`.

## Como rodar

```bash
npm install
npm run dev
npm run build
```

GeoJSON a partir do shapefile: `node convert-shp.js`.

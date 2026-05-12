# Piauí Viva - Ecossistema de Turismo e Cultura

Aplicação web progressiva para explorar a riqueza cultural, histórica e natural do Piauí. O projeto é um MVP alinhado ao eixo de valorização cultural, economia criativa e turismo, com foco em dar visibilidade a territórios e experiências fora dos roteiros mais óbvios.

## Modelo de Estrutura do Projeto

Este documento descreve a arquitetura do projeto para extração de informações e inclusão no trabalho final.

### Visão Geral

- Aplicação construída com **React 19** e **TypeScript**.
- Rodando sobre **Vite** com suporte a **PWA** via `vite-plugin-pwa`.
- Possui interface bilíngue em **Português** e **Inglês** com `react-i18next`.
- Inclui mapas interativos, exploração de territórios, biomas, cidades e economia criativa.
- Usa dados geográficos pré-processados em GeoJSON para renderização no mapa.

## Estrutura de Pastas

```text
.
├── public/
│   └── data/
│       └── municipios_piaui.json   # GeoJSON de municípios do Piauí
├── src/
│   ├── assets/                     # Se necessário, imagens e recursos estáticos locais
│   ├── components/                 # Componentes React reutilizáveis
│   │   ├── ARSimulator.tsx         # Simulador de realidade aumentada
│   │   ├── CreativeCard.tsx        # Card de item da economia criativa
│   │   ├── CreativeEconomy.tsx     # Página de economia criativa
│   │   ├── ItineraryBuilder.tsx    # Builder de roteiros de viagem
│   │   ├── LanguageToggle.tsx      # Alterna PT/EN e persiste localStorage
│   │   ├── MapView.tsx             # Mapa Leaflet com pontos e geolocalização
│   │   ├── RegionCard.tsx          # Card de território/região
│   │   └── TerritoryExplorer.tsx   # Página inicial de descoberta
│   ├── data/                       # Dados estáticos do app
│   │   ├── cities.ts               # Cidades em destaque e informações de viagem
│   │   ├── events.ts               # Eventos culturais (dados estáticos)
│   │   ├── regions.ts              # Regiões, pontos turísticos e economia criativa
│   │   ├── LEIA-ME.txt             # Informações do shapefile bruto
│   │   └── PI_Municipios_2025.*     # Arquivos shapefile originais usados para conversão
│   ├── i18n/                       # Internacionalização
│   │   ├── config.ts               # Configuração i18next
│   │   └── locales/
│   │       ├── en.json             # Traduções em inglês
│   │       └── pt.json             # Traduções em português
│   ├── styles/                     # Estilos CSS por componente
│   │   ├── ARSimulator.css
│   │   ├── CreativeCard.css
│   │   ├── CreativeEconomy.css
│   │   ├── ItineraryBuilder.css
│   │   ├── LanguageToggle.css
│   │   ├── MapView.css
│   │   ├── RegionCard.css
│   │   ├── TerritoryExplorer.css
│   ├── App.css                    # Estilos globais do app
│   ├── App.tsx                    # Componente raiz e navegação entre páginas
│   ├── index.css                  # Estilos base da aplicação
│   ├── main.tsx                   # Entrada do React e inicialização do i18n
├── convert-shp.js                 # Script para gerar GeoJSON a partir do shapefile
├── package.json                   # Dependências e scripts do projeto
├── tsconfig.json                  # Configuração TypeScript geral
├── vite.config.ts                 # Configuração Vite e PWA
```

## Componentes Principais

### `App.tsx`
- Controla a navegação principal da aplicação.
- Define as páginas: `home`, `map`, `ar`, `creative`, `itinerary`.
- Exibe o `LanguageToggle` e renderiza a página ativa.

### `TerritoryExplorer.tsx`
- Página inicial de descoberta turística.
- Permite busca por locais, biomas e cidades.
- Mostra destaques, regiões e novo painel de biomas com imagens reais.
- Inclui cards selecionáveis e detalhe de locais.

### `MapView.tsx`
- Renderiza um mapa Leaflet com pontos turísticos.
- Exibe geolocalização do usuário quando permitido.
- Carrega os dados de municípios do arquivo `public/data/municipios_piaui.json`.

### `ARSimulator.tsx`
- Simula experiência de realidade aumentada.
- Utiliza câmera e geolocalização para mostrar o ponto mais próximo.

### `CreativeEconomy.tsx`
- Página de economia criativa por região.
- Renderiza cards de produtos culturais e gastronômicos.

### `ItineraryBuilder.tsx`
- Cria roteiros a partir de pontos selecionados.
- Ajuda o usuário a montar uma experiência turística personalizada.

### `LanguageToggle.tsx`
- Alterna o idioma entre português e inglês.
- Persiste o idioma selecionado no `localStorage`.

### `RegionCard.tsx`
- Exibe cada região/tópico territorial em formato de card.
- Usado na lista de regiões para seleção e navegação.

## Fluxo de Dados

1. **Inicialização**
   - `main.tsx` inicializa o React e o i18next.
   - O idioma é carregado do `localStorage` ou definido como `pt`.

2. **Navegação**
   - `App.tsx` mantém um estado `currentPage`.
   - Cada botão de navegação altera a página ativa.

3. **Conteúdo Estático**
   - `src/data/regions.ts`: todas as regiões, pontos turísticos, imagens e itens de economia criativa.
   - `src/data/cities.ts`: cidades em destaque, descrições e tags.
   - `src/data/events.ts`: eventos culturais estáticos.

4. **Mapas e GeoJSON**
   - `convert-shp.js` converte shapefile `src/data/PI_Municipios_2025.*` em `public/data/municipios_piaui.json`.
   - `MapView.tsx` consome esse GeoJSON para desenhar limites e camadas.

5. **Internacionalização**
   - Traduções são mantidas em `src/i18n/locales/pt.json` e `src/i18n/locales/en.json`.
   - Componentes usam `useTranslation()` para exibir texto localizado.

## Pontos Relevantes para o Trabalho Final

- O projeto demonstra:
  - **Turismo territorial** com foco em regiões do Piauí.
  - **Inclusão digital** via PWA e suporte offline.
  - **Acessibilidade linguística** com PT/EN.
  - **Uso de geolocalização** em mapa e RA simulado.
  - **Dados de biomas** com imagens reais e cidades de referência.

- O modelo de informação pode ser extraído em três camadas:
  1. **Interface**: páginas e componentes React.
  2. **Dados**: `src/data/*` e GeoJSON em `public/data`.
  3. **Configuração**: `i18n`, PWA e build.

## Como Rodar

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Gere o build de produção:

```bash
npm run build
```

Visualize o build:

```bash
npm run preview
```

## Scripts Disponíveis

- `npm run dev`: servidor local de desenvolvimento.
- `npm run build`: compila o projeto e gera assets para produção.
- `npm run lint`: executa análise estática (ESLint).
- `npm run preview`: pré-visualiza o build de produção.

## Dados Geográficos

- `public/data/municipios_piaui.json` contém o GeoJSON usado no mapa.
- Para regenerar, use `node convert-shp.js`.

## Observações

- As imagens dos biomas foram atualizadas para URLs diretas do Wikimedia, evitando links que não carregavam.
- A nova seção de biomas foi construída em `TerritoryExplorer.tsx` com abas e cards descritivos.

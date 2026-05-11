# Piauí Viva - Ecossistema de Turismo e Cultura

Aplicação web progressiva para explorar a riqueza cultural, histórica e natural do Piauí. O projeto é um MVP alinhado ao eixo de valorização cultural, economia criativa e turismo, com foco em dar visibilidade a territórios e experiências fora dos roteiros mais óbvios.

## Funcionalidades

- Exploração territorial por polos turísticos.
- Mapa interativo com limites municipais e pontos de interesse.
- Simulador de realidade aumentada com câmera e geolocalização.
- Vitrine de economia criativa.
- Criador de roteiro cultural.
- Interface bilíngue em português e inglês.
- Configuração PWA com service worker e manifest.

## Tecnologias

- React 19
- TypeScript
- Vite
- React Leaflet
- i18next / react-i18next
- vite-plugin-pwa
- Shapefile para conversão dos dados municipais

## Estrutura

```text
src/
  components/        Componentes principais da interface
  data/              Dados turísticos e shapefile original
  i18n/              Configuração e traduções
  styles/            CSS por componente
public/
  data/              GeoJSON usado no mapa
```

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

## Dados Geográficos

O arquivo `public/data/municipios_piaui.json` é carregado pelo mapa. Caso seja necessário gerar novamente esse GeoJSON a partir do shapefile em `src/data`, rode:

```bash
node convert-shp.js
```

## Scripts

- `npm run dev`: servidor local de desenvolvimento.
- `npm run build`: checagem TypeScript e build Vite.
- `npm run lint`: análise estática com ESLint.
- `npm run preview`: preview local do build.

## Próximos Passos

- Conectar calendário real de eventos.
- Adicionar dados de clima local.
- Permitir fotos colaborativas de visitantes.
- Incluir notificações push.
- Criar painel administrativo para gerenciar conteúdo.

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CITY_SECTIONS, FEATURED_CITIES } from '../data/cities'
import type { CityHighlight } from '../data/cities'
import { REGIONS } from '../data/regions'
import type { Spot, Territory } from '../data/regions'
import RegionCard from './RegionCard'
import '../styles/TerritoryExplorer.css'

const featuredSpotIds = [
  'deltaDoParnaiba',
  'serraDaCapivara',
  'canyonRioPoti',
  'parque7Cidades',
  'encontroRios',
]

type Lang = 'pt' | 'en'

type HighlightSpot = Spot & {
  regionColor: string
  regionId: string
}

const pageCopy = {
  pt: {
    heroKicker: 'Guia ambiental e turistico',
    heroTitle: 'Guia',
    heroEmphasis: 'Piaui',
    heroDescription:
      'Descubra a diversidade cultural e natural do estado, dos cerrados ao delta, dos canions as carnaubas.',
    searchPlaceholder: 'Buscar locais, biomas, frutos do Piaui...',
    explore: 'Explorar',
    stats: [
      ['224', 'Municipios'],
      ['11', 'Territorios'],
      ['4', 'Biomas'],
    ],
    statsLabel: 'Resumo do Piaui',
    naturalHeritage: 'Patrimonio natural',
    highlights: 'Destaques',
    viewAll: 'Ver todos',
    sustainableRoutes: 'Roteiros sustentaveis',
    territories: 'Explore por Territorios',
    cultureEnvironment: 'Cultura e ambiente',
    cities: 'Cidades para conhecer',
    chooseCity: 'Escolha uma cidade',
    source: 'Fonte',
    biomeTitle: 'Quatro biomas, uma terra viva.',
    biomeText:
      'Caatinga, Cerrado, Mata dos Cocais e Mata Atlantica encontram-se aqui, moldando frutos como o buriti, o pequi, o caju e o umbu.',
    biomeButton: 'Conheca os biomas',
    selectedHighlight: 'Lugar selecionado',
    selectedRegion: 'Territorio selecionado',
    routeTip: 'Clique em um ponto para ver detalhes e montar seu roteiro ambiental.',
    noSearchResult: 'Nao encontrei um resultado exato, mas trouxe a area de territorios para voce explorar.',
    biomeSectionTitle: 'Biomas do Piauí',
    biomeSectionSubtitle: 'Aprenda sobre a natureza, as paisagens e as cidades que vivem cada bioma.',
    biomeCitiesTitle: 'Cidades no bioma',
    ambientRegion: {
      label: 'Vale do Sambito',
      summary: 'Cerrado denso, cachoeiras escondidas e fauna exuberante.',
      count: '14 municipios',
      details:
        'Um roteiro imaginado para conectar cerrado, agua doce, observacao de fauna e pequenas comunidades do interior.',
    },
  },
  en: {
    heroKicker: 'Environmental and travel guide',
    heroTitle: 'Piaui',
    heroEmphasis: 'Guide',
    heroDescription:
      'Discover the cultural and natural diversity of the state, from the cerrado to the delta, from canyons to carnauba palms.',
    searchPlaceholder: 'Search places, biomes, fruits of Piaui...',
    explore: 'Explore',
    stats: [
      ['224', 'Municipalities'],
      ['11', 'Territories'],
      ['4', 'Biomes'],
    ],
    statsLabel: 'Piaui overview',
    naturalHeritage: 'Natural heritage',
    highlights: 'Highlights',
    viewAll: 'View all',
    sustainableRoutes: 'Sustainable routes',
    territories: 'Explore by Territory',
    cultureEnvironment: 'Culture and environment',
    cities: 'Cities to visit',
    chooseCity: 'Choose a city',
    source: 'Source',
    biomeTitle: 'Four biomes, one living land.',
    biomeText:
      'Caatinga, Cerrado, Mata dos Cocais and Atlantic Forest meet here, shaping fruits such as buriti, pequi, cashew and umbu.',
    biomeButton: 'Explore the biomes',
    selectedHighlight: 'Selected place',
    selectedRegion: 'Selected territory',
    routeTip: 'Click a place to see details and shape your environmental route.',
    noSearchResult: 'No exact result found, so I brought you to the territory area to explore.',
    ambientRegion: {
      label: 'Sambito Valley',
      summary: 'Dense cerrado, hidden waterfalls and abundant wildlife.',
      count: '14 municipalities',
      details:
        'A proposed route connecting cerrado landscapes, freshwater, wildlife watching and small inland communities.',
    },
    biomeSectionTitle: 'Piauí biomes',
    biomeSectionSubtitle: 'Learn about the landscapes, species and cities that belong to each biome.',
    biomeCitiesTitle: 'Cities in the biome',
  },
} as const

type Biome = {
  id: string
  title: string
  description: Record<Lang, string>
  image: string
  cities: string[]
}

const BIOMES: Biome[] = [
  {
    id: 'caatinga',
    title: 'Caatinga',
    description: {
      pt: 'Bioma seco e resistente do sertão, com mandacarus, xique-xiques, umbuzeiros e uma flora adaptada à seca.',
      en: 'A dry, resilient biome of the sertão, with mandacarus, xique-xiques, umbuzeiros and plants adapted to drought.',
    },
    image:
      'https://upload.wikimedia.org/wikipedia/commons/b/bb/Vegeta%C3%A7%C3%A3o_da_Caatinga_no_Piau%C3%AD.jpg',
    cities: ['São Raimundo Nonato', 'Oeiras', 'Piripiri'],
  },
  {
    id: 'cerrado',
    title: 'Cerrado',
    description: {
      pt: 'Savanas úmidas e veredas do centro do estado, onde o buriti, o pequi e os campos de altitude se destacam.',
      en: 'Wet savannas and veredas in the state interior, where buriti, pequi and upland fields stand out.',
    },
    image:
      'https://upload.wikimedia.org/wikipedia/commons/0/02/%C3%81rvore_seca_no_Cerrado.jpg',
    cities: ['Teresina', 'Pedro II', 'Picos'],
  },
  {
    id: 'mataDosCocais',
    title: 'Mata dos Cocais',
    description: {
      pt: 'Área de transição entre cerrado e Amazônia, com babaçu, carnaúba e paisagens de coqueirais.',
      en: 'A transition area between cerrado and Amazon, with babaçu, carnaúba palms and lush palm groves.',
    },
    image:
      'https://upload.wikimedia.org/wikipedia/commons/e/ee/MatadosCocais.jpg',
    cities: ['Parnaíba', 'Floriano', 'Piripiri'],
  },
  {
    id: 'mataAtlantica',
    title: 'Mata Atlântica',
    description: {
      pt: 'Trecho de floresta atlântica e manguezais no litoral, rico em biodiversidade e paisagens costaneiras.',
      en: 'A stretch of Atlantic forest and mangroves on the coast, rich in biodiversity and coastal landscapes.',
    },
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS0qzuUJOvzA3mjGhlzGS6FxQAmuQWwqidRg&s',
    cities: ['Parnaíba', 'Luís Correia', 'Teresina'],
  },
]

const cityCopy: Record<string, Record<Lang, Partial<CityHighlight>>> = {
  oeiras: {
    pt: {
      name: 'Oeiras',
      nickname: 'Capital da Fe e 1a capital do Piaui',
      region: 'Territorio Vale do Caninde',
      details:
        'Oeiras preserva um dos conjuntos historicos mais simbolicos do estado. A cidade e lembrada como primeira capital, patrimonio cultural e centro de celebracoes religiosas tradicionais.',
      tags: ['Fe', 'Historia', 'Patrimonio'],
    },
    en: {
      name: 'Oeiras',
      nickname: 'Capital of Faith and first capital of Piaui',
      region: 'Vale do Caninde Territory',
      details:
        'Oeiras preserves one of the most symbolic historic centers in the state. It is remembered as the first capital, a cultural heritage site and a center of traditional religious celebrations.',
      tags: ['Faith', 'History', 'Heritage'],
    },
  },
  picos: {
    pt: {
      name: 'Picos',
      nickname: 'Capital do Mel e entroncamento rodoviario',
      region: 'Centro-sul do Piaui',
      details:
        'Picos se destaca pela localizacao estrategica no cruzamento de rodovias e pela producao de mel, conectando comercio, servicos e a paisagem semiarida.',
      tags: ['Mel', 'Rodovias', 'Comercio'],
    },
    en: {
      name: 'Picos',
      nickname: 'Honey capital and highway crossroads',
      region: 'South-central Piaui',
      details:
        'Picos stands out for its strategic location at a highway crossroads and for honey production, connecting trade, services and semiarid landscapes.',
      tags: ['Honey', 'Roads', 'Trade'],
    },
  },
  teresina: {
    pt: {
      name: 'Teresina',
      nickname: 'Capital atual do Piaui',
      region: 'Entre os rios Poti e Parnaiba',
      details:
        'Teresina concentra mercados, museus, parques urbanos e uma relacao forte com os rios Poti e Parnaiba, alem de ser o principal centro administrativo do estado.',
      tags: ['Capital', 'Cultura', 'Servicos'],
    },
    en: {
      name: 'Teresina',
      nickname: 'Current capital of Piaui',
      region: 'Between the Poti and Parnaiba rivers',
      details:
        'Teresina brings together markets, museums, urban parks and a strong relationship with the Poti and Parnaiba rivers, while serving as the state administrative center.',
      tags: ['Capital', 'Culture', 'Services'],
    },
  },
  parnaiba: {
    pt: {
      name: 'Parnaiba',
      nickname: 'Portal do Delta',
      region: 'Litoral piauiense',
      details:
        'Parnaiba e uma das principais portas de entrada para o Delta do Parnaiba, destino marcado por rios, ilhas, dunas, manguezais e comunidades tradicionais.',
      tags: ['Delta', 'Litoral', 'Natureza'],
    },
    en: {
      name: 'Parnaiba',
      nickname: 'Gateway to the Delta',
      region: 'Piaui coast',
      details:
        'Parnaiba is one of the main gateways to the Parnaiba Delta, a destination shaped by rivers, islands, dunes, mangroves and traditional communities.',
      tags: ['Delta', 'Coast', 'Nature'],
    },
  },
  saoRaimundoNonato: {
    pt: {
      name: 'Sao Raimundo Nonato',
      nickname: 'Portal da Serra da Capivara',
      region: 'Sudeste piauiense',
      details:
        'Sao Raimundo Nonato funciona como base para experiencias ligadas a Serra da Capivara, ao Museu do Homem Americano e aos roteiros de arqueologia e caatinga.',
      tags: ['Arqueologia', 'Caatinga', 'Museus'],
    },
    en: {
      name: 'Sao Raimundo Nonato',
      nickname: 'Gateway to Serra da Capivara',
      region: 'Southeastern Piaui',
      details:
        'Sao Raimundo Nonato is a base for experiences connected to Serra da Capivara, the Museum of the American Man and routes focused on archaeology and caatinga.',
      tags: ['Archaeology', 'Caatinga', 'Museums'],
    },
  },
  pedroII: {
    pt: {
      name: 'Pedro II',
      nickname: 'Cidade das Opalas',
      region: 'Serra dos Matoes',
      details:
        'Pedro II combina clima de serra, artesanato mineral, musica e ecoturismo, com destaque para opalas, festival de inverno e cachoeiras.',
      tags: ['Opalas', 'Serra', 'Festival'],
    },
    en: {
      name: 'Pedro II',
      nickname: 'City of Opals',
      region: 'Serra dos Matoes',
      details:
        'Pedro II combines mountain weather, mineral crafts, music and ecotourism, with highlights including opals, a winter festival and waterfalls.',
      tags: ['Opals', 'Mountains', 'Festival'],
    },
  },
  piripiri: {
    pt: {
      name: 'Piripiri',
      nickname: 'Caminho das cachoeiras',
      region: 'Norte do Piaui',
      details:
        'Piripiri esta proxima de areas de lazer, trilhas e quedas d agua conhecidas no norte piauiense, conectando natureza, comercio regional e cultura popular.',
      tags: ['Cachoeira', 'Natureza', 'Norte'],
    },
    en: {
      name: 'Piripiri',
      nickname: 'Waterfall route',
      region: 'Northern Piaui',
      details:
        'Piripiri is close to recreation areas, trails and waterfalls in northern Piaui, connecting nature tourism, regional commerce and popular culture.',
      tags: ['Waterfall', 'Nature', 'North'],
    },
  },
  floriano: {
    pt: {
      name: 'Floriano',
      nickname: 'Princesa do Sul',
      region: 'Sul do Piaui',
      details:
        'Floriano se destaca como polo regional do sul piauiense, com forte relacao com o Rio Parnaiba, servicos, comercio e vida ribeirinha.',
      tags: ['Rio Parnaiba', 'Comercio', 'Sul'],
    },
    en: {
      name: 'Floriano',
      nickname: 'Princess of the South',
      region: 'Southern Piaui',
      details:
        'Floriano is a regional hub in southern Piaui, with a close connection to the Parnaiba River, services, commerce and riverside life.',
      tags: ['Parnaiba River', 'Trade', 'South'],
    },
  },
}

const citySectionCopy: Record<string, Record<Lang, { title: string; description: string }>> = {
  faith: {
    pt: {
      title: 'Fe, historia e memoria',
      description: 'Cidades que guardam a formacao cultural, religiosa e politica do Piaui.',
    },
    en: {
      title: 'Faith, history and memory',
      description: 'Cities that preserve the cultural, religious and political formation of Piaui.',
    },
  },
  routes: {
    pt: {
      title: 'Rotas, comercio e producao',
      description: 'Centros urbanos que movimentam estradas, feiras, servicos e economia criativa.',
    },
    en: {
      title: 'Routes, trade and production',
      description: 'Urban centers that move roads, markets, services and the creative economy.',
    },
  },
  nature: {
    pt: {
      title: 'Natureza e patrimonio vivo',
      description: 'Portas de entrada para parques, cachoeiras, litoral, opalas e paisagens unicas.',
    },
    en: {
      title: 'Nature and living heritage',
      description: 'Gateways to parks, waterfalls, the coast, opals and unique landscapes.',
    },
  },
}

const categoryCopy: Record<string, Record<Lang, string>> = {
  Natureza: { pt: 'Natureza', en: 'Nature' },
  Patrimonio: { pt: 'Patrimonio', en: 'Heritage' },
  'PatrimÃ´nio': { pt: 'Patrimonio', en: 'Heritage' },
  Arqueologia: { pt: 'Arqueologia', en: 'Archaeology' },
  Parque: { pt: 'Parque', en: 'Park' },
  Cultural: { pt: 'Cultural', en: 'Cultural' },
  Turismo: { pt: 'Turismo', en: 'Tourism' },
  Praia: { pt: 'Praia', en: 'Beach' },
  Ecoturismo: { pt: 'Ecoturismo', en: 'Ecotourism' },
  Mirante: { pt: 'Mirante', en: 'Viewpoint' },
  Cachoeira: { pt: 'Cachoeira', en: 'Waterfall' },
  Historico: { pt: 'Historico', en: 'Historic' },
  'HistÃ³rico': { pt: 'Historico', en: 'Historic' },
}

function isHighlightSpot(spot: HighlightSpot | undefined): spot is HighlightSpot {
  return Boolean(spot)
}

function cleanText(text: string) {
  if (!/[ÃÂ]|â[€™“”-]/.test(text)) return text

  try {
    const bytes = Uint8Array.from(text, (char) => char.charCodeAt(0))
    return new TextDecoder('utf-8').decode(bytes)
  } catch {
    return text
  }
}

function scrollToElement(id: string) {
  window.setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 50)
}

function translateCategory(category: string, lang: Lang) {
  return categoryCopy[category]?.[lang] ?? cleanText(category)
}

export default function TerritoryExplorer() {
  const { t, i18n } = useTranslation()
  const lang: Lang = i18n.language === 'en' ? 'en' : 'pt'
  const copy = pageCopy[lang]
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedSpot, setSelectedSpot] = useState<HighlightSpot | null>(null)
  const [selectedCity, setSelectedCity] = useState<CityHighlight>(FEATURED_CITIES[0])
  const [selectedBiomeId, setSelectedBiomeId] = useState(BIOMES[0].id)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchMessage, setSearchMessage] = useState('')

  const highlights = useMemo(() => {
    const spots = REGIONS.flatMap((region) =>
      region.spots.map((spot) => ({
        ...spot,
        regionColor: region.color,
        regionId: region.id,
      })),
    )

    return featuredSpotIds
      .map((id) => spots.find((spot) => spot.id === id))
      .filter(isHighlightSpot)
  }, [])

  const selectedRegionData = REGIONS.find((region) => region.id === selectedRegion)
  const selectedBiome = BIOMES.find((biome) => biome.id === selectedBiomeId) ?? BIOMES[0]
  const heroSpot = highlights[0]
  const selectedCityCopy = { ...selectedCity, ...cityCopy[selectedCity.id]?.[lang] }

  const selectSpot = (spot: HighlightSpot) => {
    setSelectedSpot(spot)
    setSelectedRegion(spot.regionId)
    setSearchMessage('')
    scrollToElement('highlight-detail')
  }

  const selectBiome = (biomeId: string) => {
    setSelectedBiomeId(biomeId)
    scrollToElement('biomes')
  }

  const handleShowBiomes = () => {
    setSelectedBiomeId(BIOMES[0].id)
    scrollToElement('biomes')
  }

  const selectRegion = (region: Territory) => {
    setSelectedRegion(region.id)
    setSearchMessage('')
    scrollToElement('region-detail')
  }

  const selectAmbientRegion = () => {
    setSelectedRegion('valeDoSambito')
    setSearchMessage('')
    scrollToElement('region-detail')
  }

  const handleExplore = () => {
    const query = searchQuery.trim().toLowerCase()
    setSearchMessage('')

    if (!query) {
      scrollToElement('territorios')
      return
    }

    const spotMatch = highlights.find((spot) => {
      const title = cleanText(t(spot.titleKey)).toLowerCase()
      return title.includes(query) || spot.municipality.toLowerCase().includes(query) || spot.category.toLowerCase().includes(query)
    })

    if (spotMatch) {
      selectSpot(spotMatch)
      return
    }

    const regionMatch = REGIONS.find((region) => {
      const name = cleanText(t(region.nameKey)).toLowerCase()
      const summary = cleanText(t(region.summaryKey)).toLowerCase()
      return name.includes(query) || summary.includes(query)
    })

    if (regionMatch) {
      selectRegion(regionMatch)
      return
    }

    const cityMatch = FEATURED_CITIES.find((city) => {
      const translated = { ...city, ...cityCopy[city.id]?.[lang] }
      return (
        translated.name.toLowerCase().includes(query) ||
        translated.nickname.toLowerCase().includes(query) ||
        translated.region.toLowerCase().includes(query)
      )
    })

    if (cityMatch) {
      setSelectedCity(cityMatch)
      scrollToElement('cidades')
      return
    }

    setSearchMessage(copy.noSearchResult)
    scrollToElement('territorios')
  }

  return (
    <div className="territory-explorer">
      <section className="explorer-hero">
        <div className="hero-copy">
          <span className="hero-kicker">{copy.heroKicker}</span>
          <h1>
            {copy.heroTitle} <em>{copy.heroEmphasis}</em>
          </h1>
          <p>{copy.heroDescription}</p>

          <form
            className="search-bar"
            onSubmit={(event) => {
              event.preventDefault()
              handleExplore()
            }}
          >
            <span aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
            />
            <button type="submit">{copy.explore}</button>
          </form>
          {searchMessage && <p className="search-message">{searchMessage}</p>}

          <dl className="hero-stats" aria-label={copy.statsLabel}>
            {copy.stats.map(([value, label]) => (
              <div key={label}>
                <dt>{value}</dt>
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {heroSpot && (
          <button className="hero-feature" type="button" onClick={() => selectSpot(heroSpot)}>
            <img src={heroSpot.image} alt={cleanText(t(heroSpot.titleKey))} />
            <div className="hero-dots" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="hero-feature-copy">
              <span>{heroSpot.municipality}</span>
              <h2>{cleanText(t(heroSpot.titleKey))}</h2>
            </div>
          </button>
        )}
      </section>

      <section className="highlights-section">
        <div className="section-header">
          <div>
            <span>{copy.naturalHeritage}</span>
            <h2>{copy.highlights}</h2>
          </div>
          <a href="#territorios" className="view-all">{copy.viewAll}</a>
        </div>
        <div className="highlights-row">
          {highlights.map((spot) => (
            <button key={spot.id} className="highlight-card" type="button" onClick={() => selectSpot(spot)}>
              {spot.image && (
                <img src={spot.image} alt={cleanText(t(spot.titleKey))} className="highlight-image" />
              )}
              <span className={`highlight-badge highlight-badge-${spot.category.toLowerCase()}`} aria-hidden="true" />
              <div className="highlight-content">
                <h3>{cleanText(t(spot.titleKey))}</h3>
                <p>
                  <span aria-hidden="true" />
                  {spot.municipality}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selectedSpot && (
        <section className="highlight-detail-panel" id="highlight-detail">
          <img src={selectedSpot.image} alt={cleanText(t(selectedSpot.titleKey))} />
          <div>
            <span>{copy.selectedHighlight}</span>
            <h2>{cleanText(t(selectedSpot.titleKey))}</h2>
            <p>{cleanText(t(selectedSpot.summaryKey))}</p>
            <small>{selectedSpot.municipality} · {translateCategory(selectedSpot.category, lang)}</small>
          </div>
        </section>
      )}

      <section className="territories-section" id="territorios">
        <div className="section-header">
          <div>
            <span>{copy.sustainableRoutes}</span>
            <h2>{copy.territories}</h2>
          </div>
        </div>
        <div className="regions-list">
          {REGIONS.map((region) => (
            <RegionCard
              key={region.id}
              region={region}
              isSelected={selectedRegion === region.id}
              onSelect={() => selectRegion(region)}
            />
          ))}
          <button className={`region-card ambient-region-card ${selectedRegion === 'valeDoSambito' ? 'selected' : ''}`} type="button" onClick={selectAmbientRegion}>
            <span className="region-icon region-icon-leaf" aria-hidden="true" />
            <span className="region-copy">
              <strong>{copy.ambientRegion.label}</strong>
              <span>{copy.ambientRegion.summary}</span>
              <small>{copy.ambientRegion.count}</small>
            </span>
            <span className="region-arrow" aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="biome-callout">
        <div>
          <span className="callout-leaf" aria-hidden="true" />
          <h2>{copy.biomeTitle}</h2>
          <p>{copy.biomeText}</p>
          <button type="button" onClick={handleShowBiomes}>{copy.biomeButton}</button>
        </div>
      </section>

      <section className="biome-section" id="biomes">
        <div className="section-header">
          <div>
            <span>{copy.biomeTitle}</span>
            <h2>{copy.biomeSectionTitle}</h2>
          </div>
        </div>
        <p className="biome-subtitle">{copy.biomeSectionSubtitle}</p>

        <div className="biome-tab-row" role="tablist" aria-label={copy.biomeSectionTitle}>
          {BIOMES.map((biome) => (
            <button
              key={biome.id}
              type="button"
              className={`biome-tab-btn ${selectedBiome.id === biome.id ? 'active' : ''}`}
              onClick={() => selectBiome(biome.id)}
            >
              {biome.title}
            </button>
          ))}
        </div>

        <div className="biome-grid">
          <article className="biome-card">
            <img src={selectedBiome.image} alt={selectedBiome.title} />
            <div className="biome-card-content">
              <h3>{selectedBiome.title}</h3>
              <p>{selectedBiome.description[lang]}</p>
              <div className="biome-city-list">
                <strong>{copy.biomeCitiesTitle}</strong>
                <div>
                  {selectedBiome.cities.map((city) => (
                    <span key={city}>{city}</span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="cities-section" id="cidades">
        <div className="section-header">
          <div>
            <span>{copy.cultureEnvironment}</span>
            <h2>{copy.cities}</h2>
          </div>
        </div>
        <div className="city-name-row" aria-label={copy.chooseCity}>
          {FEATURED_CITIES.map((city) => {
            const translatedCity = { ...city, ...cityCopy[city.id]?.[lang] }

            return (
              <button
                key={city.id}
                className={`city-name-btn ${selectedCity.id === city.id ? 'active' : ''}`}
                onClick={() => setSelectedCity(city)}
              >
                {translatedCity.name}
              </button>
            )
          })}
        </div>

        <article className="city-detail-card">
          <img src={selectedCity.image} alt={selectedCityCopy.name} className="city-detail-image" />
          <div className="city-detail-content">
            <span className="city-region">{selectedCityCopy.region}</span>
            <h2>{selectedCityCopy.name}</h2>
            <strong>{selectedCityCopy.nickname}</strong>
            <p>{selectedCityCopy.details}</p>
            <div className="city-tags">
              {selectedCityCopy.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <a href={selectedCity.sourceUrl} target="_blank" rel="noreferrer" className="city-source">
              {copy.source}: {cleanText(selectedCity.sourceLabel)}
            </a>
          </div>
        </article>

        <div className="city-sections-grid">
          {CITY_SECTIONS.map((section) => {
            const cities = FEATURED_CITIES.filter((city) => city.section === section.id)
            const translatedSection = citySectionCopy[section.id]?.[lang] ?? section

            return (
              <article key={section.id} className="city-section-card">
                <h3>{translatedSection.title}</h3>
                <p>{translatedSection.description}</p>
                <div>
                  {cities.map((city) => (
                    <button key={city.id} onClick={() => setSelectedCity(city)}>
                      {(cityCopy[city.id]?.[lang]?.name as string | undefined) ?? city.name}
                    </button>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {selectedRegion && (
        <section className="region-details" id="region-detail">
          {selectedRegionData ? (
            <div className="details-content">
              <span>{copy.selectedRegion}</span>
              <h2>{cleanText(t(selectedRegionData.nameKey))}</h2>
              <p>{cleanText(t(selectedRegionData.summaryKey))}</p>
              <small>{copy.routeTip}</small>
              <div className="spots-grid">
                {selectedRegionData.spots.map((spot) => (
                  <button
                    key={spot.id}
                    className="spot-card"
                    type="button"
                    onClick={() => selectSpot({ ...spot, regionColor: selectedRegionData.color, regionId: selectedRegionData.id })}
                  >
                    {spot.image && (
                      <img src={spot.image} alt={cleanText(t(spot.titleKey))} className="spot-image" />
                    )}
                    <div className="spot-details">
                      <strong>{cleanText(t(spot.titleKey))}</strong>
                      <span>{spot.municipality}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="details-content">
              <span>{copy.selectedRegion}</span>
              <h2>{copy.ambientRegion.label}</h2>
              <p>{copy.ambientRegion.details}</p>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

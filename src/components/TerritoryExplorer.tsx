import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CITY_SECTIONS, FEATURED_CITIES } from '../data/cities'
import type { CityHighlight } from '../data/cities'
import { REGIONS } from '../data/regions'
import type { Spot, Territory } from '../data/regions'
import RegionCard from './RegionCard'
import '../styles/TerritoryExplorer.css'

type TerritoryExplorerProps = {
  selectedCityId?: string | null
  onCitySelect?: (cityId: string) => void
}

/** Quatro pontos turísticos fixos no hero e na faixa de destaques. */
const featuredSpotIds = ['deltaDoParnaiba', 'portoLuisCorreia', 'serraDaCapivara', 'canyonRioPoti'] as const

type Lang = 'pt' | 'en'

type HighlightSpot = Spot & {
  regionColor: string
  regionId: string
}

type Biome = {
  id: string
  title: string
  description: string
  image: string
  cities: string[]
}

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

const DEFAULT_BIOME_ID = 'caatinga'

const BIOME_IDS = ['caatinga', 'cerrado', 'mataDosCocais', 'mataAtlantica'] as const
type BiomeId = (typeof BIOME_IDS)[number]

/** Fotos alinhadas ao território piauiense de cada bioma (Commons / referência regional). */
const BIOME_IMAGES: Record<BiomeId, string> = {
  caatinga: 'https://commons.wikimedia.org/wiki/Special:FilePath/Serra_da_Capivara.jpg?width=960',
  cerrado: 'https://commons.wikimedia.org/wiki/Special:FilePath/C%C3%A2nion_do_Rio_Poti_em_Crate%C3%BAs.jpg?width=960',
  mataDosCocais: 'https://commons.wikimedia.org/wiki/Special:FilePath/Attalea_speciosa_-_Baba%C3%A7u.jpg?width=960',
  mataAtlantica: 'https://commons.wikimedia.org/wiki/Special:FilePath/Delta_do_Parna%C3%ADba.jpg?width=960',
}

const BIOME_CITIES: Record<BiomeId, string[]> = {
  caatinga: ['Sao Raimundo Nonato', 'Coronel Jose Dias', 'Caracol', 'Sao Goncalo'],
  cerrado: ['Teresina', 'Picos', 'Oeiras', 'Floriano'],
  mataDosCocais: ['Piripiri', 'Esperantina', 'Barras', 'Batalha'],
  mataAtlantica: ['Parnaiba', 'Luis Correia', 'Cajueiro da Praia', 'Ilha Grande'],
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

function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/\p{M}/gu, '')
}

/** Cidade em destaque para o botão "Conhecer" no hero. */
function heroCityIdForSpot(spot: HighlightSpot): string {
  const m = stripAccents(spot.municipality.toLowerCase())
  if (m.includes('luis correia')) return 'luisCorreia'
  if (m.includes('ilha grande')) return 'parnaiba'
  if (m.includes('parnaiba')) return 'parnaiba'
  if (m.includes('sao raimundo')) return 'saoRaimundoNonato'
  if (m.includes('buriti')) return 'picos'
  return 'teresina'
}

function scrollToElement(id: string) {
  window.setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 50)
}

function translateCategory(category: string, translateFn: (key: string) => string) {
  const base = cleanText(category)
  const key = `category.${base}`
  const translated = translateFn(key)
  return translated === key ? base : translated
}

export default function TerritoryExplorer({ selectedCityId, onCitySelect }: TerritoryExplorerProps) {
  const { t, i18n } = useTranslation()
  const lang: Lang = i18n.language === 'en' ? 'en' : 'pt'

  const copy = useMemo(() => {
    const statsRaw = t('territoryExplorer.stats', { returnObjects: true })
    const ambientRaw = t('territoryExplorer.ambientRegion', { returnObjects: true })
    const ambientRegion = ambientRaw as {
      label: string
      summary: string
      count: string
      details: string
    }
    const stats = (Array.isArray(statsRaw) ? statsRaw : []) as [string, string][]

    return {
      heroKicker: t('territoryExplorer.heroKicker'),
      heroTitle: t('territoryExplorer.heroTitle'),
      heroEmphasis: t('territoryExplorer.heroEmphasis'),
      heroDescription: t('territoryExplorer.heroDescription'),
      searchPlaceholder: t('territoryExplorer.searchPlaceholder'),
      explore: t('territoryExplorer.explore'),
      stats,
      statsLabel: t('territoryExplorer.statsLabel'),
      naturalHeritage: t('territoryExplorer.naturalHeritage'),
      highlights: t('territoryExplorer.highlights'),
      viewAll: t('territoryExplorer.viewAll'),
      sustainableRoutes: t('territoryExplorer.sustainableRoutes'),
      territories: t('territoryExplorer.territories'),
      cultureEnvironment: t('territoryExplorer.cultureEnvironment'),
      cities: t('territoryExplorer.cities'),
      chooseCity: t('territoryExplorer.chooseCity'),
      source: t('territoryExplorer.source'),
      biomeTitle: t('territoryExplorer.biomeTitle'),
      biomeText: t('territoryExplorer.biomeText'),
      biomeButton: t('territoryExplorer.biomeButton'),
      biomeSectionTitle: t('territoryExplorer.biomeSectionTitle'),
      biomeSectionSubtitle: t('territoryExplorer.biomeSectionSubtitle'),
      biomeCitiesTitle: t('territoryExplorer.biomeCitiesTitle'),
      selectedHighlight: t('territoryExplorer.selectedHighlight'),
      selectedRegion: t('territoryExplorer.selectedRegion'),
      routeTip: t('territoryExplorer.routeTip'),
      noSearchResult: t('territoryExplorer.noSearchResult'),
      ambientRegion,
    }
  }, [t, i18n.language])

  const biomes = useMemo<Biome[]>(
    () =>
      BIOME_IDS.map((id) => ({
        id,
        title: t(`biome.${id}.title`),
        description: t(`biome.${id}.description`),
        image: BIOME_IMAGES[id],
        cities: BIOME_CITIES[id],
      })),
    [t],
  )

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedSpot, setSelectedSpot] = useState<HighlightSpot | null>(null)
  const [selectedCity, setSelectedCity] = useState<CityHighlight>(FEATURED_CITIES[0])
  const [selectedBiomeId, setSelectedBiomeId] = useState(DEFAULT_BIOME_ID)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchMessage, setSearchMessage] = useState('')

  useEffect(() => {
    if (!selectedCityId) return
    const city = FEATURED_CITIES.find((item) => item.id === selectedCityId)
    if (city) {
      setSelectedCity(city)
      scrollToElement('cidades')
    }
  }, [selectedCityId])

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
  const selectedBiome = biomes.find((biome) => biome.id === selectedBiomeId) ?? biomes[0]
  const heroSpots = highlights.slice(0, 4)
  const selectedCityCopy = { ...selectedCity, ...cityCopy[selectedCity.id]?.[lang] }

  const selectCity = (cityId: string) => {
    const city = FEATURED_CITIES.find((item) => item.id === cityId)
    if (city) {
      setSelectedCity(city)
      if (onCitySelect) onCitySelect(cityId)
      scrollToElement('cidades')
    }
  }

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
    setSelectedBiomeId(DEFAULT_BIOME_ID)
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
            {copy.stats.map(([value, label]: [string, string]) => (
              <div key={label}>
                <dt>{value}</dt>
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {heroSpots.length > 0 && (
          <div className="hero-spots-grid" aria-label={copy.highlights}>
            {heroSpots.map((spot) => (
              <div key={spot.id} className="hero-spot-card">
                <button type="button" className="hero-spot-main" onClick={() => selectSpot(spot)}>
                  <img
                    src={spot.image}
                    alt={cleanText(t(spot.titleKey))}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const el = e.currentTarget
                      if (el.dataset.fallback === '1') return
                      el.dataset.fallback = '1'
                      el.src =
                        'https://commons.wikimedia.org/wiki/Special:FilePath/Delta_do_Parna%C3%ADba.jpg?width=720'
                    }}
                  />
                  <div className="hero-spot-overlay" aria-hidden="true" />
                  <div className="hero-spot-copy">
                    <span>{spot.municipality}</span>
                    <h2>{cleanText(t(spot.titleKey))}</h2>
                  </div>
                </button>
                <button
                  type="button"
                  className="hero-spot-cta"
                  onClick={() => selectCity(heroCityIdForSpot(spot))}
                >
                  {lang === 'pt' ? 'Conhecer a cidade' : 'Discover the city'}
                </button>
              </div>
            ))}
          </div>
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
            <small>{selectedSpot.municipality} · {translateCategory(selectedSpot.category, t)}</small>
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
          {biomes.map((biome) => (
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
            <img
              src={selectedBiome.image}
              alt={selectedBiome.title}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const el = e.currentTarget
                if (el.dataset.fallback === '1') return
                el.dataset.fallback = '1'
                el.src =
                  'https://commons.wikimedia.org/wiki/Special:FilePath/Serra_da_Capivara.jpg?width=720'
              }}
            />
            <div className="biome-card-content">
              <h3>{selectedBiome.title}</h3>
              <p>{selectedBiome.description}</p>
              <div className="biome-city-list">
                <strong>{copy.biomeCitiesTitle}</strong>
                <div>
                  {selectedBiome.cities.map((city: string) => (
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
                onClick={() => selectCity(city.id)}
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
                    <button key={city.id} onClick={() => selectCity(city.id)}>
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

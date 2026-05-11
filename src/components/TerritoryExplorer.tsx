import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CITY_SECTIONS, FEATURED_CITIES } from '../data/cities'
import type { CityHighlight } from '../data/cities'
import { REGIONS } from '../data/regions'
import type { Spot } from '../data/regions'
import RegionCard from './RegionCard'
import '../styles/TerritoryExplorer.css'

const featuredSpotIds = [
  'deltaDoParnaiba',
  'serraDaCapivara',
  'canyonRioPoti',
  'parque7Cidades',
  'museuDoPiauÃ­',
  'encontroRios',
]

type HighlightSpot = Spot & {
  regionColor: string
  regionId: string
}

function isHighlightSpot(spot: HighlightSpot | undefined): spot is HighlightSpot {
  return Boolean(spot)
}

export default function TerritoryExplorer() {
  const { t } = useTranslation()
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<CityHighlight>(FEATURED_CITIES[0])

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

  return (
    <div className="territory-explorer">
      <section className="explorer-hero">
        <div>
          <h1>Guia Piauí</h1>
          <p>Descubra a diversidade cultural e natural do estado</p>
        </div>
        <div className="hero-pattern" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>

      <label className="search-bar">
        <span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Buscar locais, eventos..." />
      </label>

      <section className="highlights-section">
        <div className="section-header">
          <h2>Destaques</h2>
          <a href="#territorios" className="view-all">Ver todos ›</a>
        </div>
        <div className="highlights-row">
          {highlights.map((spot) => (
            <article key={spot.id} className="highlight-card">
              {spot.image && (
                <img src={spot.image} alt={t(spot.titleKey)} className="highlight-image" />
              )}
              <div className="highlight-content">
                <h3>{t(spot.titleKey)}</h3>
                <p>
                  <span aria-hidden="true">⌾</span>
                  {spot.municipality}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="territories-section" id="territorios">
        <div className="section-header">
          <h2>Explore por Territórios</h2>
        </div>
        <div className="regions-list">
          {REGIONS.map((region) => (
            <RegionCard
              key={region.id}
              region={region}
              isSelected={selectedRegion === region.id}
              onSelect={() => setSelectedRegion(region.id)}
            />
          ))}
        </div>
      </section>

      <section className="cities-section" id="cidades">
        <div className="section-header">
          <h2>Cidades para conhecer</h2>
        </div>
        <div className="city-name-row" aria-label="Escolha uma cidade">
          {FEATURED_CITIES.map((city) => (
            <button
              key={city.id}
              className={`city-name-btn ${selectedCity.id === city.id ? 'active' : ''}`}
              onClick={() => setSelectedCity(city)}
            >
              {city.name}
            </button>
          ))}
        </div>

        <article className="city-detail-card">
          <img src={selectedCity.image} alt={selectedCity.name} className="city-detail-image" />
          <div className="city-detail-content">
            <span className="city-region">{selectedCity.region}</span>
            <h2>{selectedCity.name}</h2>
            <strong>{selectedCity.nickname}</strong>
            <p>{selectedCity.details}</p>
            <div className="city-tags">
              {selectedCity.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <a href={selectedCity.sourceUrl} target="_blank" rel="noreferrer" className="city-source">
              Fonte: {selectedCity.sourceLabel}
            </a>
          </div>
        </article>

        <div className="city-sections-grid">
          {CITY_SECTIONS.map((section) => {
            const cities = FEATURED_CITIES.filter((city) => city.section === section.id)

            return (
              <article key={section.id} className="city-section-card">
                <h3>{section.title}</h3>
                <p>{section.description}</p>
                <div>
                  {cities.map((city) => (
                    <button key={city.id} onClick={() => setSelectedCity(city)}>
                      {city.name}
                    </button>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {selectedRegion && (
        <section className="region-details">
          {REGIONS.map((region) => {
            if (region.id !== selectedRegion) return null
            return (
              <div key={region.id} className="details-content">
                <h2>{t(region.nameKey)}</h2>
                <p>{t(region.summaryKey)}</p>
                <div className="spots-grid">
                  {region.spots.map((spot) => (
                    <article key={spot.id} className="spot-card">
                      {spot.image && (
                        <img src={spot.image} alt={t(spot.titleKey)} className="spot-image" />
                      )}
                      <div className="spot-details">
                        <strong>{t(spot.titleKey)}</strong>
                        <span>{spot.municipality}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )
          })}
        </section>
      )}
    </div>
  )
}

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { REGIONS } from '../data/regions'
import '../styles/ItineraryBuilder.css'

export default function ItineraryBuilder() {
  const { t } = useTranslation()
  const [selectedSpots, setSelectedSpots] = useState<string[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string>('all')

  const handleSpotToggle = (spotId: string) => {
    setSelectedSpots((prev) =>
      prev.includes(spotId)
        ? prev.filter((id) => id !== spotId)
        : [...prev, spotId]
    )
  }

  const filteredSpots = selectedRegion === 'all'
    ? REGIONS.flatMap((region) => region.spots)
    : REGIONS.find((region) => region.id === selectedRegion)?.spots || []

  const allRegions = ['all', ...REGIONS.map((region) => region.id)]

  const selectedRoute = useMemo(
    () => REGIONS
      .flatMap((region) => region.spots.map((spot) => ({ ...spot, region })))
      .filter(({ id }) => selectedSpots.includes(id)),
    [selectedSpots]
  )

  return (
    <div className="itinerary-builder">
      <div className="itinerary-header">
        <h2>{t('btn.itinerary')}</h2>
        <p>{t('itinerary.description')}</p>
      </div>

      <div className="filter-buttons">
        {allRegions.map((region) => (
          <button
            key={region}
            className={`filter-btn ${selectedRegion === region ? 'active' : ''}`}
            onClick={() => setSelectedRegion(region)}
          >
            {region === 'all' ? t('btn.all') : t(`region.${region}.name`)}
          </button>
        ))}
      </div>

      <div className="spots-list">
        {filteredSpots.map((spot) => (
          <div key={spot.id} className="spot-item">
            <input
              type="checkbox"
              id={spot.id}
              checked={selectedSpots.includes(spot.id)}
              onChange={() => handleSpotToggle(spot.id)}
            />
            <label htmlFor={spot.id}>
              <div className="spot-info">
                <h4>{t(spot.titleKey)}</h4>
                <p>{spot.municipality} - {spot.category}</p>
              </div>
            </label>
          </div>
        ))}
      </div>

      {selectedSpots.length > 0 && (
        <div className="itinerary-actions">
          <button className="btn-primary">
            {t('btn.calculateRoute')} ({selectedSpots.length})
          </button>
          <div className="route-preview" aria-live="polite">
            <h3>{t('itinerary.previewTitle')}</h3>
            <ol>
              {selectedRoute.map(({ id, titleKey, municipality, region }) => (
                <li key={id}>
                  <strong>{t(titleKey)}</strong>
                  <span>{municipality} - {t(region.nameKey)}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}

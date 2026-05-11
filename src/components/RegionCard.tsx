import type { Territory } from '../data/regions'
import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import '../styles/RegionCard.css'

interface RegionCardProps {
  region: Territory
  isSelected: boolean
  onSelect: () => void
}

const regionIcons: Record<string, string> = {
  costaDoDelta: '≈',
  poloDasOrigens: '◬',
  teresina: '⌾',
}

export default function RegionCard({ region, isSelected, onSelect }: RegionCardProps) {
  const { t } = useTranslation()

  return (
    <button
      className={`region-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      style={{ '--region-color': region.color } as CSSProperties}
    >
      <span className="region-icon" aria-hidden="true">{regionIcons[region.id] ?? '◆'}</span>
      <span className="region-copy">
        <strong>{t(region.nameKey).replace('Polo ', '')}</strong>
        <span>{t(region.summaryKey)}</span>
        <small>{region.spots.length} municípios</small>
      </span>
      <span className="region-arrow" aria-hidden="true">›</span>
    </button>
  )
}

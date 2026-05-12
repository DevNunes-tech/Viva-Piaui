import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import TerritoryExplorer from './components/TerritoryExplorer'
import MapView from './components/MapView'
import ARSimulator from './components/ARSimulator'
import CreativeEconomy from './components/CreativeEconomy'
import ItineraryBuilder from './components/ItineraryBuilder'
import LanguageToggle from './components/LanguageToggle'
import './App.css'

export type Page = 'home' | 'map' | 'ar' | 'creative' | 'itinerary'

export default function App() {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState<Page>('home')

  const navItems: { page: Page; label: string; icon: string }[] = [
    { page: 'home', label: t('nav.home'), icon: 'home' },
    { page: 'map', label: t('nav.map'), icon: 'map' },
    { page: 'itinerary', label: t('nav.itinerary'), icon: 'route' },
    { page: 'ar', label: t('nav.ar'), icon: 'spark' },
    { page: 'creative', label: t('nav.creative'), icon: 'palette' },
  ]

  const renderPage = () => {
    switch (currentPage) {
      case 'map':
        return <MapView />
      case 'ar':
        return <ARSimulator />
      case 'creative':
        return <CreativeEconomy />
      case 'itinerary':
        return <ItineraryBuilder />
      default:
        return <TerritoryExplorer />
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="brand-lockup">
            <div className="brand-mark" aria-hidden="true">
              <span />
            </div>
            <span className="brand-name">Piaui Viva</span>
          </div>
          <LanguageToggle />
        </div>
      </header>

      <main className="app-main">
        {renderPage()}
      </main>

      <nav className="app-nav">
        {navItems.map((item) => (
          <button
            key={item.page}
            className={`nav-btn ${currentPage === item.page ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.page)}
            aria-label={item.label}
          >
            <span className={`nav-icon nav-icon-${item.icon}`} aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

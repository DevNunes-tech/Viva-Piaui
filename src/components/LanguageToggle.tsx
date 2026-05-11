import { useTranslation } from 'react-i18next'
import '../styles/LanguageToggle.css'

export default function LanguageToggle() {
  const { i18n } = useTranslation()

  const handleLanguageChange = () => {
    const newLang = i18n.language === 'pt' ? 'en' : 'pt'
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  return (
    <button className="language-toggle" onClick={handleLanguageChange}>
      {i18n.language === 'pt' ? 'EN' : 'PT'}
    </button>
  )
}

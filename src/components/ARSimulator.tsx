import { useRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { REGIONS } from '../data/regions'
import '../styles/ARSimulator.css'

export default function ARSimulator() {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [nearbySpot, setNearbySpot] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (!isActive) return

    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const loc: [number, number] = [position.coords.latitude, position.coords.longitude]
          setUserLocation(loc)

          // Find nearby spots (simplified: within ~5km)
          for (const region of REGIONS) {
            for (const spot of region.spots) {
              const distance = Math.sqrt(
                Math.pow(spot.lat - loc[0], 2) + Math.pow(spot.lng - loc[1], 2)
              )
              if (distance < 0.045) {
                setNearbySpot(spot.id)
                break
              }
            }
          }
        },
        () => console.log('Error getting location'),
        { enableHighAccuracy: true }
      )

      return () => navigator.geolocation.clearWatch(watchId)
    }
  }, [isActive])

  useEffect(() => {
    if (!isActive || !videoRef.current) return
    const videoElement = videoRef.current

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        videoElement.srcObject = stream
      } catch (err) {
        console.error('Camera access denied', err)
      }
    }

    startCamera()

    return () => {
      if (videoElement.srcObject) {
        const tracks = (videoElement.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [isActive])

  const handleToggleAR = () => {
    setIsActive(!isActive)
  }

  return (
    <div className="ar-simulator">
      <h2>{t('nav.ar')}</h2>

      {!isActive ? (
        <button className="ar-start-btn" onClick={handleToggleAR}>
          {t('btn.startAR')}
        </button>
      ) : (
        <div className="ar-container">
          <video ref={videoRef} autoPlay playsInline className="ar-video" />
          <canvas ref={canvasRef} className="ar-canvas" />

          {nearbySpot ? (
            <div className="ar-overlay">
              <div className="ar-content">
                {REGIONS.map((region) =>
                  region.spots
                    .filter((s) => s.id === nearbySpot)
                    .map((spot) => (
                      <div key={spot.id} className="ar-marker">
                        <h3>{t(spot.titleKey)}</h3>
                        <p>{t(spot.summaryKey)}</p>
                        <p className="distance">
                          {userLocation
                            ? `${(Math.sqrt(Math.pow(spot.lat - userLocation[0], 2) + Math.pow(spot.lng - userLocation[1], 2)) * 111).toFixed(1)} km`
                            : 'Calculating...'}
                        </p>
                      </div>
                    ))
                )}
              </div>
            </div>
          ) : (
            <div className="ar-info">
              <p>{t('msg.loading')}</p>
            </div>
          )}

          <button className="ar-close-btn" onClick={handleToggleAR}>
            {t('btn.close')}
          </button>
        </div>
      )}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"

interface BackgroundManagerProps {
  type: "image" | "gradient" | "video" | "pattern"
  config: {
    image?: string
    video?: string
    gradient?: string
    pattern?: string
    overlay?: string
    opacity?: number
  }
}

export default function BackgroundManager({ type, config }: BackgroundManagerProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const renderBackground = () => {
    switch (type) {
      case "image":
        return (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${config.image})`,
              opacity: isLoaded ? config.opacity || 1 : 0,
            }}
          />
        )

      case "gradient":
        return (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${config.gradient} transition-opacity duration-1000`}
            style={{ opacity: isLoaded ? config.opacity || 1 : 0 }}
          />
        )

      case "video":
        return (
          <div className="absolute inset-0 overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
              style={{ opacity: isLoaded ? config.opacity || 1 : 0 }}
              onLoadedData={() => setIsLoaded(true)}
            >
              <source src={config.video} type="video/mp4" />
            </video>
          </div>
        )

      case "pattern":
        return (
          <div
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              opacity: isLoaded ? config.opacity || 1 : 0,
            }}
          />
        )

      default:
        return null
    }
  }

  return (
    <>
      {renderBackground()}
      {config.overlay && <div className={`absolute inset-0 ${config.overlay}`} />}
    </>
  )
}

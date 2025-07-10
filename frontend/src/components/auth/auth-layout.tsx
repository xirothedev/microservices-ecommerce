"use client"

import type { ReactNode } from "react"
import BackgroundManager from "./background-manager"

interface AuthLayoutProps {
  children: ReactNode
  backgroundType: "image" | "gradient" | "video" | "pattern"
  backgroundConfig: {
    image?: string
    video?: string
    gradient?: string
    pattern?: string
    overlay?: string
    opacity?: number
  }
}

export default function AuthLayout({ children, backgroundType, backgroundConfig }: AuthLayoutProps) {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <BackgroundManager type={backgroundType} config={backgroundConfig} />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">{children}</div>
      </div>
    </div>
  )
}

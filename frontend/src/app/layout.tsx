import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "./components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DigitalPro Services - Premium Digital Solutions",
  description:
    "Professional digital services including Apple ID setup, social media management, and premium subscriptions. Trusted by thousands of customers worldwide.",
  keywords: "digital services, Apple ID, Facebook management, YouTube Premium, digital solutions",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}

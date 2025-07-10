"use client"

import { useState } from "react"
import ServiceCard from "./service-card"
import { motion } from "framer-motion"

// Mock data - in a real app, this would come from an API
const services = [
  {
    id: 1,
    title: "Apple ID Premium Setup",
    description:
      "Complete Apple ID configuration with enhanced security, region optimization, and family sharing setup.",
    price: 49,
    originalPrice: 69,
    image: "/placeholder.svg?height=300&width=400",
    category: "apple",
    rating: 4.9,
    reviews: 234,
    deliveryTime: "24 hours",
    features: ["2FA Setup", "Region Optimization", "Family Sharing", "iCloud Configuration"],
    popular: true,
  },
  {
    id: 2,
    title: "Facebook Business Account",
    description: "Professional Facebook business account setup with page optimization and advertising configuration.",
    price: 79,
    originalPrice: 99,
    image: "/placeholder.svg?height=300&width=400",
    category: "social",
    rating: 4.8,
    reviews: 189,
    deliveryTime: "12 hours",
    features: ["Business Page", "Ad Account", "Pixel Setup", "Analytics"],
    popular: false,
  },
  {
    id: 3,
    title: "YouTube Premium Family",
    description: "YouTube Premium family plan setup with music integration and ad-free experience for up to 6 members.",
    price: 29,
    originalPrice: 39,
    image: "/placeholder.svg?height=300&width=400",
    category: "streaming",
    rating: 4.7,
    reviews: 156,
    deliveryTime: "6 hours",
    features: ["Family Plan", "YouTube Music", "Ad-Free", "Offline Downloads"],
    popular: false,
  },
  {
    id: 4,
    title: "Instagram Growth Package",
    description: "Complete Instagram account optimization with content strategy and engagement tools setup.",
    price: 89,
    originalPrice: 119,
    image: "/placeholder.svg?height=300&width=400",
    category: "social",
    rating: 4.9,
    reviews: 298,
    deliveryTime: "48 hours",
    features: ["Profile Optimization", "Content Strategy", "Hashtag Research", "Analytics Setup"],
    popular: true,
  },
  {
    id: 5,
    title: "Apple Developer Account",
    description: "Apple Developer Program enrollment with app store setup and certificate configuration.",
    price: 149,
    originalPrice: 199,
    image: "/placeholder.svg?height=300&width=400",
    category: "apple",
    rating: 4.8,
    reviews: 87,
    deliveryTime: "72 hours",
    features: ["Developer Enrollment", "Certificates", "App Store Setup", "Testing Tools"],
    popular: false,
  },
  {
    id: 6,
    title: "Netflix Premium Account",
    description: "Netflix premium subscription setup with 4K streaming and multiple device support.",
    price: 19,
    originalPrice: 25,
    image: "/placeholder.svg?height=300&width=400",
    category: "streaming",
    rating: 4.6,
    reviews: 445,
    deliveryTime: "1 hour",
    features: ["4K Streaming", "Multiple Devices", "Offline Downloads", "Premium Content"],
    popular: false,
  },
  {
    id: 7,
    title: "LinkedIn Business Profile",
    description:
      "Professional LinkedIn business profile optimization with company page setup and lead generation tools.",
    price: 69,
    originalPrice: 89,
    image: "/placeholder.svg?height=300&width=400",
    category: "business",
    rating: 4.7,
    reviews: 167,
    deliveryTime: "24 hours",
    features: ["Profile Optimization", "Company Page", "Lead Gen Tools", "Analytics"],
    popular: false,
  },
  {
    id: 8,
    title: "TikTok Business Account",
    description: "TikTok business account setup with advertising tools and analytics configuration.",
    price: 59,
    originalPrice: 79,
    image: "/placeholder.svg?height=300&width=400",
    category: "social",
    rating: 4.5,
    reviews: 123,
    deliveryTime: "18 hours",
    features: ["Business Account", "Ad Manager", "Analytics", "Creator Tools"],
    popular: false,
  },
]

export default function ServicesList() {
  const [visibleServices, setVisibleServices] = useState(6)
  const [loading, setLoading] = useState(false)

  const loadMoreServices = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setVisibleServices((prev) => Math.min(prev + 6, services.length))
    setLoading(false)
  }

  return (
    <div id="services-list" className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Available Services</h2>
          <p className="text-gray-600 mt-1">{services.length} services available</p>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {services.slice(0, visibleServices).map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <ServiceCard service={service} />
          </motion.div>
        ))}
      </motion.div>

      {visibleServices < services.length && (
        <div className="text-center pt-8">
          <button
            onClick={loadMoreServices}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            {loading ? "Loading..." : `Load More Services (${services.length - visibleServices} remaining)`}
          </button>
        </div>
      )}
    </div>
  )
}

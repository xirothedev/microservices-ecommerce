"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, ArrowRight, Heart, ShoppingCart, Eye } from "lucide-react"
import { motion } from "motion/react"
import ServiceDetailModal from "./service-detail-modal"
import { useCart } from "@/hooks/use-cart"

interface Service {
  id: number
  title: string
  description: string
  price: number
  originalPrice: number
  image: string
  category: string
  rating: number
  reviews: number
  deliveryTime: string
  features: string[]
  popular: boolean
  specifications?: string[]
  longDescription?: string
  gallery?: string[]
  requirements?: string[]
  whatYouGet?: string[]
}

interface ServiceCardProps {
  service: Service
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const { addToCart, isInCart, getCartItemQuantity } = useCart()

  const discount = Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)
  const cartQuantity = getCartItemQuantity(service.id)

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      await addToCart({
        id: service.id,
        title: service.title,
        price: service.price,
        image: service.image,
        category: service.category,
        deliveryTime: service.deliveryTime,
      })
    } catch (error) {
      console.error("Failed to add to cart:", error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleViewDetails = () => {
    setShowDetailModal(true)
  }

  return (
    <>
      <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
        <Card className="h-full pt-0 overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
          {/* Image Section */}
          <div className="relative overflow-hidden">
            <div className="aspect-[4/3] relative bg-gray-100">
              <Image
                src={service.image || "/placeholder.svg?height=300&width=400"}
                alt={service.title}
                fill
                className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {!imageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
            </div>

            {/* Overlays */}
            <div className="absolute top-3 left-3 flex gap-2">
              {service.popular && <Badge className="bg-red-500 text-white">Popular</Badge>}
              {discount > 0 && <Badge className="bg-green-500 text-white">{discount}% OFF</Badge>}
              {cartQuantity > 0 && <Badge className="bg-blue-500 text-white">In Cart ({cartQuantity})</Badge>}
            </div>

            {/* Quick Action Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
              <Button onClick={handleViewDetails} className="bg-white text-black hover:bg-gray-100" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Quick View
              </Button>
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          </div>

          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg leading-tight group-hover:text-blue-600 transition-colors duration-200">
                {service.title}
              </h3>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{service.description}</p>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{service.rating}</span>
                <span className="text-gray-500">({service.reviews})</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{service.deliveryTime}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="py-0">
            {/* Features */}
            <div className="space-y-2 mb-4">
              <div className="flex flex-wrap gap-1">
                {service.features.slice(0, 3).map((feature) => (
                  <Badge key={feature} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {service.features.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{service.features.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-gray-900">${service.price}</span>
              {service.originalPrice > service.price && (
                <span className="text-lg text-gray-500 line-through">${service.originalPrice}</span>
              )}
            </div>
          </CardContent>

          <CardFooter className="pt-0">
            <div className="w-full space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 group"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isAddingToCart ? "Adding..." : isInCart(service.id) ? "Add More" : "Add to Cart"}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={handleViewDetails}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={service}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onAddToCart={handleAddToCart}
        isAddingToCart={isAddingToCart}
      />
    </>
  )
}

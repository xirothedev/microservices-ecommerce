"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Clock, ShoppingCart, Heart, Check, X, ArrowLeft, ArrowRight } from "lucide-react"
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

interface ServiceDetailModalProps {
  service: Service
  isOpen: boolean
  onClose: () => void
  onAddToCart: () => void
  isAddingToCart: boolean
}

export default function ServiceDetailModal({
  service,
  isOpen,
  onClose,
  onAddToCart,
  isAddingToCart,
}: ServiceDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const { getCartItemQuantity } = useCart()
  const cartQuantity = getCartItemQuantity(service.id)
  const discount = Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)

  const gallery = service.gallery || [service.image]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length)
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{service.title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={gallery[currentImageIndex] || "/placeholder.svg?height=400&width=400"}
                alt={service.title}
                fill
                className="object-cover"
              />

              {gallery.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </>
              )}

              {/* Image Indicators */}
              {gallery.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {gallery.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {service.popular && <Badge className="bg-red-500 text-white">Popular</Badge>}
                {discount > 0 && <Badge className="bg-green-500 text-white">{discount}% OFF</Badge>}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? "border-blue-500" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg?height=64&width=64"}
                      alt={`${service.title} ${index + 1}`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Service Details */}
          <div className="space-y-6">
            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{service.rating}</span>
                  <span className="text-gray-500">({service.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{service.deliveryTime}</span>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">{service.longDescription || service.description}</p>

              {/* Pricing */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">${service.price}</span>
                {service.originalPrice > service.price && (
                  <span className="text-xl text-gray-500 line-through">${service.originalPrice}</span>
                )}
                {cartQuantity > 0 && (
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    {cartQuantity} in cart
                  </Badge>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-100 transition-colors">
                  <Check className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isAddingToCart ? "Adding..." : `Add ${quantity} to Cart`}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsFavorite(!isFavorite)}
                className={isFavorite ? "text-red-500 border-red-500" : ""}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
              </Button>
            </div>

            {/* Detailed Information Tabs */}
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="specs">Specs</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="included">What's Included</TabsTrigger>
              </TabsList>

              <TabsContent value="features" className="space-y-3">
                <h4 className="font-semibold">Key Features</h4>
                <div className="grid grid-cols-1 gap-2">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="specs" className="space-y-3">
                <h4 className="font-semibold">Specifications</h4>
                <div className="grid grid-cols-1 gap-2">
                  {(
                    service.specifications || [
                      "Professional setup and configuration",
                      "24/7 customer support included",
                      "30-day money-back guarantee",
                      "Compatible with all major platforms",
                    ]
                  ).map((spec, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="text-sm">{spec}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="requirements" className="space-y-3">
                <h4 className="font-semibold">Requirements</h4>
                <div className="grid grid-cols-1 gap-2">
                  {(
                    service.requirements || [
                      "Valid email address",
                      "Basic account information",
                      "Payment method verification",
                      "Agreement to terms of service",
                    ]
                  ).map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      <span className="text-sm">{req}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="included" className="space-y-3">
                <h4 className="font-semibold">What You Get</h4>
                <div className="grid grid-cols-1 gap-2">
                  {(
                    service.whatYouGet || [
                      "Complete service setup",
                      "Detailed documentation",
                      "Email support for 30 days",
                      "Step-by-step guide",
                      "Quality guarantee",
                    ]
                  ).map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

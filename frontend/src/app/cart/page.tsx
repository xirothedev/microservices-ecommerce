"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { useCart } from "@/hooks/use-cart"

export default function CartContent() {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalItems, getTotalPrice } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  const totalItems = getTotalItems()
  const subtotal = getTotalPrice()
  const shipping = subtotal > 500 ? 0 : 50
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax - discount

  const handleApplyPromo = async () => {
    setIsApplyingPromo(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (promoCode.toLowerCase() === "save10") {
      setDiscount(subtotal * 0.1)
    } else if (promoCode.toLowerCase() === "welcome20") {
      setDiscount(subtotal * 0.2)
    } else {
      setDiscount(0)
    }
    setIsApplyingPromo(false)
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Looks like you haven't added any services to your cart yet. Browse our services and find something you like!
        </p>
        <Link href="/services">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <Link href="/services">
          <Button variant="outline" className="bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Cart Items</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-500 hover:text-red-700">
                Clear All
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-4 p-4 border rounded-lg bg-white"
                  >
                    {/* Item Image */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 relative bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={item.image || "/placeholder.svg?height=80&width=80"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 truncate">{item.title}</h3>
                          <Badge variant="secondary" className="mt-1">
                            {item.category}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">Delivery: {item.deliveryTime}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-500">${item.price} each</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Promo Code */}
          <Card>
            <CardHeader>
              <CardTitle>Promo Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Button
                  onClick={handleApplyPromo}
                  disabled={!promoCode || isApplyingPromo}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isApplyingPromo ? "Applying..." : "Apply"}
                </Button>
              </div>
              {discount > 0 && (
                <p className="text-sm text-green-600">Promo code applied! You saved ${discount.toFixed(2)}</p>
              )}
              <div className="text-xs text-gray-500">
                <p>Try: SAVE10 or WELCOME20</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700">Add ${(500 - subtotal).toFixed(2)} more to get free shipping!</p>
                </div>
              )}

              <Link href="/payment" className="block">
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>

              <div className="text-center">
                <p className="text-xs text-gray-500">Secure checkout powered by SSL encryption</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

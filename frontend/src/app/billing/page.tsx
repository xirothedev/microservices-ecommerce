"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, PrinterIcon as Print, Mail, ArrowLeft, CheckCircle, Calendar, CreditCard, User } from "lucide-react"

interface OrderData {
  id: string
  items: Array<{
    id: number
    title: string
    price: number
    quantity: number
    category: string
    image: string
  }>
  customer: {
    name: string
    email: string
    phone: string
  }
  payment: {
    method: string
    amount: number
  }
  timestamp: string
  subtotal: number
  shipping: number
  tax: number
  total: number
}

export default function BillingPage() {
  const router = useRouter()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedOrder = localStorage.getItem("lastOrder")
    if (storedOrder) {
      setOrderData(JSON.parse(storedOrder))
    } else {
      // Redirect to home if no order data
      router.push("/")
    }
    setIsLoading(false)
  }, [router])

  const handleDownloadInvoice = () => {
    // In a real app, this would generate and download a PDF
    alert("Invoice download functionality would be implemented here!")
  }

  const handlePrintInvoice = () => {
    window.print()
  }

  const handleEmailInvoice = () => {
    // In a real app, this would send the invoice via email
    alert("Invoice email functionality would be implemented here!")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your invoice...</p>
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No Invoice Found</h1>
          <p className="text-gray-600 mb-8">We couldn't find any recent orders. Please make a purchase first.</p>
          <Link href="/services">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Browse Services
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const paymentMethodNames = {
    momo: "MoMo E-Wallet",
    vietqr: "VietQR Banking",
    paypal: "PayPal",
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
            <p className="text-gray-600 mt-2">Order #{orderData.id}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrintInvoice} className="bg-transparent">
              <Print className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleEmailInvoice} className="bg-transparent">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button onClick={handleDownloadInvoice} className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invoice Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-green-800">Payment Successful</h3>
                    <p className="text-sm text-green-600">Your order has been confirmed and is being processed</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Order Date</p>
                      <p className="font-medium">{new Date(orderData.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Payment Method</p>
                      <p className="font-medium">
                        {paymentMethodNames[orderData.payment.method as keyof typeof paymentMethodNames]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Customer</p>
                      <p className="font-medium">{orderData.customer.name}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg bg-white">
                      <div className="w-16 h-16 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg?height=64&width=64"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <Badge variant="secondary" className="mt-1">
                          {item.category}
                        </Badge>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-600">Quantity: {item.quantity}</span>
                          <div className="text-right">
                            <p className="font-semibold text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-sm text-gray-500">${item.price} each</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Summary */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{orderData.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{orderData.customer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{orderData.customer.phone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({orderData.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>${orderData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{orderData.shipping === 0 ? "Free" : `$${orderData.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${orderData.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Paid</span>
                  <span className="text-blue-600">${orderData.total.toFixed(2)}</span>
                </div>
                <div className="text-center pt-4">
                  <Badge className="bg-green-100 text-green-800 border-green-200">Payment Confirmed</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Link href="/services" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/profile/orders" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  View All Orders
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-gray-500">
          <p>Thank you for choosing DigitalPro! If you have any questions, please contact our support team.</p>
          <p className="mt-2">support@digitalpro.com | +1 (555) 123-4567</p>
        </div>
      </div>
    </div>
  )
}

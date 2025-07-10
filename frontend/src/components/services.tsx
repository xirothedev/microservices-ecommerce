"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Apple, Facebook, Youtube, Shield, Clock, Headphones } from "lucide-react"
import { motion } from "motion/react"

export default function Services() {
  const services = [
    {
      icon: Apple,
      title: "Apple ID Services",
      description:
        "Professional Apple ID setup and management with enhanced security features and region optimization.",
      features: ["Secure Setup", "Region Optimization", "2FA Configuration", "Recovery Setup"],
      price: "From $29",
      popular: false,
    },
    {
      icon: Facebook,
      title: "Social Media Management",
      description: "Complete Facebook account setup and management services for businesses and individuals.",
      features: ["Account Setup", "Privacy Configuration", "Business Integration", "Security Audit"],
      price: "From $39",
      popular: true,
    },
    {
      icon: Youtube,
      title: "YouTube Premium Setup",
      description: "YouTube Premium subscription management and family plan optimization services.",
      features: ["Premium Setup", "Family Plans", "Music Integration", "Ad-Free Experience"],
      price: "From $19",
      popular: false,
    },
  ]

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Premium Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional digital services designed to enhance your online experience with security, reliability, and
            expert support.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                className={`relative h-full transition-all duration-300 hover:shadow-xl ${
                  service.popular ? "ring-2 ring-blue-600 scale-105" : ""
                }`}
              >
                {service.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                    <service.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                  <CardDescription className="text-gray-600">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t">
                    <div className="text-2xl font-bold text-gray-900 mb-4">{service.price}</div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 grid md:grid-cols-3 gap-8"
        >
          <div className="text-center space-y-3">
            <Shield className="h-12 w-12 text-blue-600 mx-auto" />
            <h3 className="text-lg font-semibold">100% Secure</h3>
            <p className="text-gray-600">All services are performed with the highest security standards</p>
          </div>
          <div className="text-center space-y-3">
            <Clock className="h-12 w-12 text-blue-600 mx-auto" />
            <h3 className="text-lg font-semibold">Fast Delivery</h3>
            <p className="text-gray-600">Most services completed within 24 hours</p>
          </div>
          <div className="text-center space-y-3">
            <Headphones className="h-12 w-12 text-blue-600 mx-auto" />
            <h3 className="text-lg font-semibold">24/7 Support</h3>
            <p className="text-gray-600">Round-the-clock customer support for all clients</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

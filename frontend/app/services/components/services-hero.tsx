"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function ServicesHero() {
  const scrollToServices = () => {
    const servicesSection = document.querySelector("#services-list")
    servicesSection?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Premium Digital Services
          </Badge>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Explore Our
              <span className="block text-yellow-300">Digital Solutions</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Discover our comprehensive range of professional digital services designed to enhance your online presence
              and streamline your digital experience.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
              onClick={scrollToServices}
            >
              Browse Services
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3 bg-transparent"
            >
              Custom Quote
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="text-3xl font-bold">50+</div>
              <div className="text-blue-200">Services Available</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="text-3xl font-bold">24h</div>
              <div className="text-blue-200">Average Delivery</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-blue-200">Success Rate</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-blue-200">Support</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Users } from "lucide-react"
import { motion } from "motion/react"

export default function Hero() {
  return (
    <section id="home" className="pt-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Premium Digital
                <span className="text-blue-600"> Services</span>
                <br />
                Made Simple
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Professional setup and management of your digital accounts. Secure, reliable, and trusted by thousands
                of customers worldwide.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
                View Services
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-8">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-green-600" />
                <span className="text-sm font-medium text-gray-700">100% Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">Instant Setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">24/7 Support</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm opacity-90">Happy Customers</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-sm opacity-90">Success Rate</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm opacity-90">Support</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                  <div className="text-2xl font-bold">5★</div>
                  <div className="text-sm opacity-90">Rating</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react"
import { motion } from "motion/react"

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Contact us today to discuss your digital service needs. Our team is ready to help you achieve your goals
            with professional, secure solutions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Send us a Message</CardTitle>
                <CardDescription className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="First Name" />
                  <Input placeholder="Last Name" />
                </div>
                <Input
                  placeholder="Email Address"
                  type="email"
                />
                <Input
                  placeholder="Phone Number"
                  type="tel"
                />
                <Textarea
                  placeholder="Tell us about your project..."
                  className="min-h-[120px]"
                />
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Send Message
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Get in Touch</h3>
              <p className="text-gray-600 leading-relaxed">
                We're here to help you with all your digital service needs. Whether you have questions about our
                services or need a custom solution, our team is ready to assist.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Email Us</div>
                  <div className="text-gray-600">support@digitalpro.com</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Call Us</div>
                  <div className="text-gray-600">+1 (555) 123-4567</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Live Chat</div>
                  <div className="text-gray-600">Available 24/7</div>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold mb-2">Need Immediate Help?</h4>
                <p className="text-blue-100 mb-4">Our support team is available 24/7 to assist with urgent requests.</p>
                <Button
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  Start Live Chat
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

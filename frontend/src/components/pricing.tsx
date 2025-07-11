"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { motion } from "motion/react"

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "per service",
      description: "Perfect for individuals getting started",
      features: [
        "Single service setup",
        "Basic security configuration",
        "Email support",
        "Setup guide included",
        "30-day warranty",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$79",
      period: "per package",
      description: "Best value for multiple services",
      features: [
        "Up to 3 services included",
        "Advanced security setup",
        "Priority support",
        "Custom configuration",
        "90-day warranty",
        "Free consultation call",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "per package",
      description: "Complete solution for businesses",
      features: [
        "Unlimited services",
        "Enterprise security",
        "24/7 dedicated support",
        "Custom integrations",
        "1-year warranty",
        "Account manager assigned",
        "Training included",
      ],
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-20 bg-gray-50 transition-colors">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center space-y-4 mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Choose the perfect plan for your needs. All plans include our premium support and satisfaction guarantee.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card
              className={`relative h-full transition-all duration-300 hover:shadow-xl ${
                plan.popular ? "ring-2 ring-blue-600 scale-105" : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-gray-900">
                    {plan.price}
                    <span className="text-lg font-normal text-gray-600">/{plan.period}</span>
                  </div>
                  <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-900 hover:bg-gray-800"
                  }`}
                >
                  Get Started
                </Button>
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
        className="mt-16 text-center"
      >
        <p className="text-gray-600 mb-4">
          Need a custom solution? We offer tailored packages for unique requirements.
        </p>
        <Button
          variant="outline"
          size="lg"
          className="bg-transparent border-gray-300 text-gray-900 hover:bg-gray-100"
        >
          Contact Sales
        </Button>
      </motion.div>
    </div>
  </section>
  )
}

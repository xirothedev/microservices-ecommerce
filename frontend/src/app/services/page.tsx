import ServicesFilter from "@/components/services/services-filter";
import ServicesHero from "@/components/services/services-hero";
import ServicesList from "@/components/services/services-list";
import ServicesLoading from "@/components/services/services-loading";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore our comprehensive range of digital services including Apple ID setup, social media management, YouTube Premium, and custom solutions.",
  keywords: "digital services, Apple ID, Facebook management, YouTube Premium, social media, digital solutions",
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen pt-16">
      <ServicesHero />

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="h-16 bg-white rounded-lg animate-pulse" />}>
            <ServicesFilter />
          </Suspense>

          <Suspense fallback={<ServicesLoading />}>
            <ServicesList />
          </Suspense>
        </div>
      </section>
    </main>
  )
}

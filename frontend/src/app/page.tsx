import Hero from "@/components/hero"
import Services from "@/components/services"
import Pricing from "@/components/pricing"
import Testimonials from "@/components/testimonials"
import Contact from "@/components/contact"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <Pricing />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  )
}

import Hero from "@/components/hero"
import Services from "@/components/services"
import Pricing from "@/components/pricing"
import Testimonials from "@/components/testimonials"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar";

export default function Home() {
  return (
		<>
			<Navbar />
			<main className="min-h-screen">
				<Hero />
				<Services />
				<Pricing />
				<Testimonials />
				<Contact />
				<Footer />
			</main>
		</>
  );
}

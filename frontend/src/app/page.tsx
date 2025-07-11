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
			<Navbar
				navItems={[
					{ name: "Home", href: "/" },
					{ name: "Services", href: "#services" },
					{ name: "Pricing", href: "#pricing" },
					{ name: "About", href: "#about" },
					{ name: "Contact", href: "#contact" },
				]}
			/>
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

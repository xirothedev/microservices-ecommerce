import Navbar from "@/components/navbar";
import ServicesHero from "@/components/services/services-hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Services",
	description:
		"Explore our comprehensive range of digital services including Apple ID setup, social media management, YouTube Premium, and custom solutions.",
	keywords: "digital services, Apple ID, Facebook management, YouTube Premium, social media, digital solutions",
};

export default function ServiceLayout({ children }: { children: React.ReactElement }) {
	return (
		<>
			<Navbar />
			<main className="min-h-screen pt-16">
				<ServicesHero />
				<section className="bg-gray-50 py-12">{children}</section>
			</main>
		</>
	);
}

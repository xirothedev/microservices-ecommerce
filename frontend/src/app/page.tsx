"use client";

import Banner from "@/components/banner";
import FeaturedProducts from "@/components/featured-products";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<div className="flex flex-col">
			<div className="flex flex-1 gap-4 lg:gap-6 xl:gap-8">
				{/* Left Banner - Sticky (hidden on small screens) */}
				<SidebarBanner src="/banner/youtube.png" alt="YouTube Banner" href="/services" />

				{/* Main Content */}
				<main className="mx-auto flex max-w-7xl flex-1 flex-col justify-between px-4 sm:px-6 lg:px-8">
					<Banner />
					<FeaturedProducts />
					<div className="mb-10 flex justify-center">
						<Link href="/services" className="font-semibold hover:text-blue-500">
							Xem thêm
						</Link>
					</div>
				</main>

				{/* Right Banner - Sticky (hidden on small screens) */}
				<SidebarBanner src="/banner/netflix.png" alt="Netflix Banner" href="/services" />
			</div>
		</div>
	);
}

export function SidebarBanner({ src, alt, href }: { src: string; alt: string; href: string }) {
	return (
		<aside className="sticky top-0 hidden h-min w-40 flex-shrink-0 overflow-y-auto lg:block xl:w-64">
			<div className="h-full">
				{/* Image Container */}
				<div className="p-4">
					<div className="overflow-hidden">
						<Link href={href}>
							<Image
								width={0}
								height={0}
								sizes="100vw"
								priority
								src={src}
								alt={alt}
								className="h-auto w-full object-cover"
							/>
						</Link>
					</div>
				</div>
			</div>
		</aside>
	);
}

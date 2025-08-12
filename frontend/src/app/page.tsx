"use client";

import Banner from "@/components/banner";
import FeaturedProducts from "@/components/featured-products";
import Image from "next/image";

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col">
			<div className="flex flex-1">
				{/* Left Banner - Sticky */}
				<aside className="sticky top-0 left-20 h-screen w-64 flex-shrink-0 overflow-y-auto">
					<div className="h-full">
						{/* Image Container */}
						<div className="p-4">
							<div className="overflow-hidden">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									priority
									src="/banner/netflix.png"
									alt="Netflix Banner"
									className="h-auto w-full object-cover"
								/>
							</div>
						</div>
					</div>
				</aside>

				{/* Main Content */}
				<main className="mx-auto flex max-w-7xl flex-1 flex-col justify-between px-4 sm:px-6 lg:px-8">
					<Banner />
					<FeaturedProducts />
				</main>

				{/* Right Banner - Sticky */}
				<aside className="sticky top-0 right-20 h-screen w-64 flex-shrink-0 overflow-y-auto">
					<div className="h-full">
						{/* Image Container */}
						<div className="p-4">
							<div className="overflow-hidden">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									priority
									src="/banner/youtube.png"
									alt="YouTube Banner"
									className="h-auto w-full object-cover"
								/>
							</div>
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
}

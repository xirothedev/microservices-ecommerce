"use client";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";

// Sample banner data
const bannerData = [
	{
		id: 1,
		title: "🎉 Giảm giá 50% cho tất cả sản phẩm",
		description: "Chỉ trong tuần này - Đặt hàng ngay!",
		bgColor: "bg-gradient-to-r from-blue-500 to-purple-600",
		textColor: "text-white",
	},
	{
		id: 2,
		title: "🚚 Miễn phí vận chuyển",
		description: "Cho đơn hàng từ 500k trở lên",
		bgColor: "bg-gradient-to-r from-green-500 to-teal-600",
		textColor: "text-white",
	},
	{
		id: 3,
		title: "⭐ Khuyến mãi mới",
		description: "Ưu đãi đặc biệt cho khách hàng VIP",
		bgColor: "bg-gradient-to-r from-orange-500 to-red-600",
		textColor: "text-white",
	},
	{
		id: 4,
		title: "🎁 Quà tặng miễn phí",
		description: "Tặng quà cho 100 khách hàng đầu tiên",
		bgColor: "bg-gradient-to-r from-pink-500 to-rose-600",
		textColor: "text-white",
	},
];

export default function Banner() {
	const [api, setApi] = useState<any>(null);
	const [current, setCurrent] = useState(0);

	// Auto-play functionality
	useEffect(() => {
		if (!api) return;

		const interval = setInterval(() => {
			api.scrollNext();
		}, 3000); // Change slide every 3 seconds

		return () => clearInterval(interval);
	}, [api]);

	// Update current slide index
	useEffect(() => {
		if (!api) return;

		const onSelect = () => {
			setCurrent(api.selectedScrollSnap());
		};

		api.on("select", onSelect);
		return () => api.off("select", onSelect);
	}, [api]);

	return (
		<div className="my-10 flex gap-4 overflow-hidden text-sm">
			{/* Carousel - Left side */}
			<div className="flex-[2]">
				<Carousel
					setApi={setApi}
					className="w-full"
					opts={{
						loop: true, // Enable infinite loop
						align: "start",
					}}
				>
					<CarouselContent className="-ml-0">
						{bannerData.map((banner) => (
							<CarouselItem key={banner.id} className="pl-0">
								<div
									className={`${banner.bgColor} ${banner.textColor} flex h-[430px] w-full items-center justify-center rounded-md px-4 text-center transition-all duration-300 hover:scale-105`}
								>
									<div className="flex flex-col items-center justify-center">
										<span className="text-xs leading-tight font-semibold">{banner.title}</span>
										<span className="text-xs opacity-90">{banner.description}</span>
									</div>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>

					{/* Dots indicator */}
					<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2">
						{bannerData.map((_, index) => (
							<button
								key={index}
								onClick={() => api?.scrollTo(index)}
								className={`h-2 rounded-full transition-all duration-300 ${
									current === index ? "w-8 bg-gray-400" : "w-2 bg-gray-300 hover:bg-gray-400"
								}`}
							/>
						))}
					</div>
				</Carousel>
			</div>

			{/* Right side images - Vertical layout */}
			<div className="flex flex-1 flex-col justify-between">
				<div className="relative overflow-hidden rounded-md">
					<Image
						width={0}
						height={0}
						sizes="100vw"
						src="/banner/ai.png"
						alt="AI Banner"
						className="h-full w-auto object-contain"
					/>
				</div>
				<div className="relative overflow-hidden rounded-md">
					<Image
						width={0}
						height={0}
						sizes="100vw"
						src="/banner/vpn.png"
						alt="VPN Banner"
						className="h-full w-auto object-contain"
					/>
				</div>
			</div>
		</div>
	);
}

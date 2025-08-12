import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

// Sample product data with random banner images
const products = [
	{
		id: 1,
		name: "Perplexity Pro 1 năm - Tài khoản",
		originalPrice: 4600000,
		discountedPrice: 399000,
		discountPercentage: 91,
		image: "/banner/ai.png",
		category: "TÀI KHOẢN",
		title: "perplexity Pro",
		duration: "1 NĂM",
		logoColor: "from-blue-400 to-cyan-400",
	},
	{
		id: 2,
		name: "ChatGPT Plus 1 năm - Tài khoản",
		originalPrice: 3600000,
		discountedPrice: 299000,
		discountPercentage: 92,
		image: "/banner/ai.png",
		category: "TÀI KHOẢN",
		title: "ChatGPT Plus",
		duration: "1 NĂM",
		logoColor: "from-green-400 to-emerald-400",
	},
	{
		id: 3,
		name: "Copilot Pro 1 năm - Tài khoản",
		originalPrice: 3200000,
		discountedPrice: 249000,
		discountPercentage: 92,
		image: "/banner/ai.png",
		category: "TÀI KHOẢN",
		title: "Copilot Pro",
		duration: "1 NĂM",
		logoColor: "from-purple-400 to-pink-400",
	},
	{
		id: 4,
		name: "Gemini Advanced 1 năm - Tài khoản",
		originalPrice: 3800000,
		discountedPrice: 329000,
		discountPercentage: 91,
		image: "/banner/ai.png",
		category: "TÀI KHOẢN",
		title: "Gemini Advanced",
		duration: "1 NĂM",
		logoColor: "from-orange-400 to-red-400",
	},
	{
		id: 5,
		name: "Netflix Premium 1 năm - Tài khoản",
		originalPrice: 1800000,
		discountedPrice: 199000,
		discountPercentage: 89,
		image: "/banner/ai.png",
		category: "TÀI KHOẢN",
		title: "Netflix Premium",
		duration: "1 NĂM",
		logoColor: "from-red-400 to-pink-400",
	},
	{
		id: 6,
		name: "YouTube Premium 1 năm - Tài khoản",
		originalPrice: 1200000,
		discountedPrice: 129000,
		discountPercentage: 89,
		image: "/banner/ai.png",
		category: "TÀI KHOẢN",
		title: "YouTube Premium",
		duration: "1 NĂM",
		logoColor: "from-red-500 to-red-600",
	},
	{
		id: 7,
		name: "NordVPN 1 năm - Tài khoản",
		originalPrice: 800000,
		discountedPrice: 179000,
		discountPercentage: 78,
		image: "/banner/vpn.png",
		category: "TÀI KHOẢN",
		title: "NordVPN",
		duration: "1 NĂM",
		logoColor: "from-blue-500 to-cyan-500",
	},
	{
		id: 8,
		name: "ExpressVPN 1 năm - Tài khoản",
		originalPrice: 900000,
		discountedPrice: 199000,
		discountPercentage: 78,
		image: "/banner/vpn.png",
		category: "TÀI KHOẢN",
		title: "ExpressVPN",
		duration: "1 NĂM",
		logoColor: "from-red-400 to-orange-400",
	},
];

export default function FeaturedProducts() {
	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		})
			.format(price)
			.replace("₫", "đ");
	};

	return (
		<section className="py-8">
			<div className="mb-6">
				<h2 className="mb-2 text-2xl font-bold text-gray-800">Sản phẩm nổi bật</h2>
				<p className="text-gray-600">Danh sách những sản phẩm theo xu hướng mà có thể bạn sẽ thích</p>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{products.map((product) => (
					<Link key={product.id} href={`/product/${product.id}`} className="flex flex-col gap-2">
						<Image
							width={0}
							height={0}
							sizes="100vw"
							src={product.image}
							alt={product.name}
							className="h-auto w-full rounded-md"
						/>
						<span className="text-[14.5px] text-gray-800">{product.name}</span>
						<div className="flex gap-2 text-sm">
							<span className="font-medium text-gray-800">{formatPrice(product.discountedPrice)}</span>
							<span className="font-semibold text-gray-800 line-through">
								{formatPrice(product.originalPrice)}
							</span>
							<Badge variant="destructive" className="text-xs">
								{product.discountPercentage}%
							</Badge>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}

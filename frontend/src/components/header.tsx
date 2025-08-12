"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Pacifico } from "next/font/google";
import { Search, ShoppingCart, User, Clock, TrendingUp, X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useUserQuery } from "@/lib/api/user";
import { useCart } from "@/lib/api/cart";
import { Button } from "./ui/button";

const pacifico = Pacifico({
	weight: "400",
	subsets: ["latin"],
	display: "swap",
});

const rotatingMessages: string[] = [
	"Chill cực căng cùng Netflix",
	"Bỏ qua quảng cáo với YouTube Premium",
	"Nghe nhạc không giới hạn cùng Spotify",
	"Làm việc mượt mà với Microsoft 365",
	"Lưu trữ an tâm với Google One",
	"Xem phim bom tấn trên Disney+",
	"Học tập hiệu quả với Coursera Plus",
	"Bộ công cụ bản quyền giá tốt",
	"Ưu đãi thành viên mỗi ngày",
	"Hỗ trợ 24/7 cực nhanh",
];

// Dữ liệu mẫu cho từ khóa nổi bật và gợi ý tìm kiếm
const popularKeywords = [
	"Netflix Premium",
	"YouTube Premium",
	"Spotify Premium",
	"Microsoft 365",
	"Google One",
	"Disney+",
	"Coursera Plus",
	"Adobe Creative Cloud",
	"Canva Pro",
	"Grammarly Premium",
];

const searchSuggestions = [
	"Netflix Premium 12 tháng",
	"YouTube Premium gia đình",
	"Spotify Premium cá nhân",
	"Microsoft 365 Business",
	"Google One 100GB",
	"Disney+ hàng năm",
	"Coursera Plus tháng",
	"Adobe Photoshop",
	"Canva Pro team",
	"Grammarly Premium",
];

export default function Header() {
	const [messageIndex, setMessageIndex] = useState<number>(0);
	const [isVisible, setIsVisible] = useState<boolean>(true);
	const [isPaused, setIsPaused] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
	const [recentSearches, setRecentSearches] = useState<string[]>([]);
	const { openAuthModal } = useAuth();
	const { data: userData } = useUserQuery();
	const { getTotalItems } = useCart();
	const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const searchRef = useRef<HTMLDivElement>(null);

	// Load recent searches from localStorage
	useEffect(() => {
		const saved = localStorage.getItem("recentSearches");
		if (saved) {
			setRecentSearches(JSON.parse(saved));
		}
	}, []);

	// Save recent searches to localStorage
	useEffect(() => {
		if (recentSearches.length > 0) {
			localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
		}
	}, [recentSearches]);

	// Close search dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
				setIsSearchFocused(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		if (!isPaused) {
			intervalRef.current = setInterval(() => {
				setIsVisible(false);
				const t = setTimeout(() => {
					setMessageIndex((prev) => (prev + 1) % rotatingMessages.length);
					setIsVisible(true);
				}, 200);
				timersRef.current.push(t);
			}, 3000);
		}

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
			timersRef.current.forEach((t) => clearTimeout(t));
			timersRef.current = [];
		};
	}, [isPaused]);

	// Add search to recent searches
	const addToRecentSearches = (query: string) => {
		if (query.trim()) {
			setRecentSearches((prev) => {
				const filtered = prev.filter((item) => item !== query);
				return [query, ...filtered].slice(0, 5); // Keep only 5 most recent
			});
		}
	};

	// Handle search submission
	const handleSearch = (query: string) => {
		if (query.trim()) {
			addToRecentSearches(query);
			// TODO: Implement actual search functionality
			console.log("Searching for:", query);
			setIsSearchFocused(false);
		}
	};

	// Filter suggestions based on search query
	const filteredSuggestions = searchQuery.trim()
		? searchSuggestions
				.filter((suggestion) => suggestion.toLowerCase().includes(searchQuery.toLowerCase()))
				.slice(0, 5)
		: [];

	return (
		<header>
			<div className="bg-blue-600 text-sm text-white">
				<div className="mx-auto flex h-8 max-w-7xl justify-between bg-blue-600 px-4 text-sm sm:px-6 lg:px-8">
					<div className="flex items-center">
						{/* Logo */}
						<span
							className={`truncate whitespace-nowrap transition-opacity duration-200 ${
								isVisible ? "opacity-100" : "opacity-0"
							}`}
							onMouseEnter={() => setIsPaused(true)}
							onMouseLeave={() => setIsPaused(false)}
						>
							Mua hàng cùng Digital Pro — {rotatingMessages[messageIndex]}
						</span>
					</div>
					<div className="flex items-center space-x-4">
						<Link href="#" className="transition-colors duration-200 hover:text-blue-200">
							Hướng dẫn mua hàng
						</Link>
						<Link href="#" className="transition-colors duration-200 hover:text-blue-200">
							Thành viên
						</Link>
						<Link href="#" className="transition-colors duration-200 hover:text-blue-200">
							Thông tin liên hệ
						</Link>
					</div>
				</div>
			</div>

			<div className="bg-blue-500">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
					<div className="flex items-center">
						<div className="flex gap-5">
							<Image src="/next.svg" className="" alt="Digital Pro" width={100} height={100} />
							<Link href="/" className={`text-3xl font-bold ${pacifico.className}`}>
								Digital Pro
							</Link>
						</div>
					</div>

					{/* Search Bar */}
					<div className="mx-8 max-w-md flex-1" ref={searchRef}>
						<div className="relative">
							<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								onFocus={() => setIsSearchFocused(true)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										handleSearch(searchQuery);
									}
								}}
								placeholder="Tìm kiếm sản phẩm..."
								className="w-full rounded-md bg-white px-10 py-2 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none"
							/>

							{/* Search Dropdown */}
							{isSearchFocused && (
								<div className="absolute top-full right-0 left-0 z-50 mt-1 rounded-md border border-gray-200 bg-white shadow-lg">
									{/* Recent Searches */}
									{recentSearches.length > 0 && (
										<div className="border-b border-gray-100 p-3">
											<div className="mb-2 flex items-center text-sm font-medium text-gray-700">
												<Clock className="mr-2 h-4 w-4" />
												Tìm kiếm gần đây
											</div>
											<div className="space-y-1">
												{recentSearches.map((search, index) => (
													<button
														key={index}
														onClick={() => handleSearch(search)}
														className="flex w-full items-center justify-between rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
													>
														<span className="truncate">{search}</span>
														<button
															onClick={(e) => {
																e.stopPropagation();
																setRecentSearches((prev) =>
																	prev.filter((_, i) => i !== index),
																);
															}}
															className="ml-2 text-gray-400 hover:text-gray-600"
														>
															<X className="h-3 w-3" />
														</button>
													</button>
												))}
											</div>
										</div>
									)}

									{/* Popular Keywords */}
									<div className="border-b border-gray-100 p-3">
										<div className="mb-2 flex items-center text-sm font-medium text-gray-700">
											<TrendingUp className="mr-2 h-4 w-4" />
											Từ khóa nổi bật
										</div>
										<div className="flex flex-wrap gap-2">
											{popularKeywords.map((keyword, index) => (
												<button
													key={index}
													onClick={() => handleSearch(keyword)}
													className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600 hover:bg-blue-100"
												>
													{keyword}
												</button>
											))}
										</div>
									</div>

									{/* Search Suggestions */}
									{searchQuery.trim() && filteredSuggestions.length > 0 && (
										<div className="p-3">
											<div className="mb-2 text-sm font-medium text-gray-700">Gợi ý tìm kiếm</div>
											<div className="space-y-1">
												{filteredSuggestions.map((suggestion, index) => (
													<button
														key={index}
														onClick={() => handleSearch(suggestion)}
														className="flex w-full items-center rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
													>
														<Search className="mr-2 h-3 w-3 text-gray-400" />
														<span className="truncate">{suggestion}</span>
													</button>
												))}
											</div>
										</div>
									)}

									{/* No results message */}
									{searchQuery.trim() && filteredSuggestions.length === 0 && (
										<div className="p-3 text-center text-sm text-gray-500">
											Không tìm thấy gợi ý nào
										</div>
									)}
								</div>
							)}
						</div>
					</div>

					{/* User Actions - Show avatar + cart if logged in, otherwise show login/register buttons */}
					<div className="flex items-center gap-3">
						{userData?.me ? (
							<>
								{/* Shopping Cart */}
								<Link href="/cart">
									<Button
										variant="ghost"
										size="sm"
										className="relative border border-white bg-transparent px-3 py-2 text-white transition-colors duration-200 hover:bg-white/10 hover:text-white"
									>
										<ShoppingCart className="h-5 w-5" />
										{getTotalItems() > 0 && (
											<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
												{getTotalItems()}
											</span>
										)}
									</Button>
								</Link>

								{/* User Avatar */}
								<Link href="/profile">
									<Button
										variant="ghost"
										size="sm"
										className="flex h-10 w-10 items-center justify-center rounded-full border border-white bg-transparent p-0 text-white transition-colors duration-200 hover:bg-white/10 hover:text-white"
									>
										{userData.me.avatarUrl ? (
											<Image
												src={userData.me.avatarUrl}
												alt={userData.me.fullname || "User"}
												width={32}
												height={32}
												className="h-8 w-8 rounded-full object-cover"
											/>
										) : (
											<User className="h-5 w-5" />
										)}
									</Button>
								</Link>
							</>
						) : (
							<>
								<Button
									onClick={() => openAuthModal("login")}
									className="border border-white bg-transparent px-4 py-2 text-white transition-colors duration-200 hover:bg-white/10 hover:text-white"
								>
									Đăng nhập
								</Button>
								<Button
									onClick={() => openAuthModal("register")}
									className="rounded-lg bg-white px-4 py-2 font-medium text-blue-600 transition-colors duration-200 hover:bg-gray-100"
								>
									Đăng ký
								</Button>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}

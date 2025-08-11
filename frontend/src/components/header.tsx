"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Pacifico } from "next/font/google";
import { Search } from "lucide-react";
import AuthModal from "./auth-modals";

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

export default function Header() {
	const [messageIndex, setMessageIndex] = useState<number>(0);
	const [isVisible, setIsVisible] = useState<boolean>(true);
	const [isPaused, setIsPaused] = useState<boolean>(false);
	const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
	const [authMode, setAuthMode] = useState<"login" | "register">("login");
	const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

	const openAuthModal = (mode: "login" | "register") => {
		setAuthMode(mode);
		setIsAuthModalOpen(true);
	};

	const closeAuthModal = () => {
		setIsAuthModalOpen(false);
	};

	return (
		<header>
			<div className="bg-blue-600 text-sm text-white">
				<div className="mx-auto flex h-8 max-w-7xl justify-between bg-blue-600 px-4 text-sm text-white sm:px-6 lg:px-8">
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

			<div className="bg-blue-500 text-white">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
					<div className="flex items-center">
						<div className="flex gap-5">
							<Image src="/next.svg" className="" alt="Digital Pro" width={100} height={100} />
							<Link href="/" className={`text-3xl font-bold text-white ${pacifico.className}`}>
								Digital Pro
							</Link>
						</div>
					</div>

					{/* Search Bar */}
					<div className="mx-8 max-w-md flex-1">
						<div className="relative">
							<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
							<input
								type="text"
								placeholder="Tìm kiếm sản phẩm..."
								className="w-full rounded-md bg-white px-10 py-2 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none"
							/>
						</div>
					</div>

					{/* Login/Register Buttons */}
					<div className="flex items-center gap-3">
						<button
							onClick={() => openAuthModal("login")}
							className="px-4 py-2 text-white transition-colors duration-200 hover:text-blue-200"
						>
							Đăng nhập
						</button>
						<button
							onClick={() => openAuthModal("register")}
							className="rounded-lg bg-white px-4 py-2 font-medium text-blue-600 transition-colors duration-200 hover:bg-gray-100"
						>
							Đăng ký
						</button>
					</div>
				</div>
			</div>

			{/* Auth Modal */}
			<AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} mode={authMode} setMode={setAuthMode} />
		</header>
	);
}

"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export default function Footer() {
	const { openAuthModal } = useAuth();

	return (
		<footer className="w-full">
			{/* Account Registration Promotion */}
			<section className="w-full bg-black px-8 py-12 text-white">
				<div className="mx-auto max-w-4xl text-center">
					<h2 className="mb-6 text-3xl font-bold">Bạn chưa có tài khoản?</h2>
					<p className="mb-8 text-lg leading-relaxed text-gray-300">
						Hãy tạo ngay một tài khoản để sử dụng đầy đủ các tính năng, tích lũy ưu đãi khi thanh toán các
						sản phẩm và tham gia vào chương trình{" "}
						<span className="font-semibold text-yellow-400">Giới thiệu bạn bè nhận hoa hồng vĩnh viễn</span>{" "}
						tại Shop.
					</p>

					<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Button
							onClick={() => openAuthModal("register")}
							className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg active:scale-95"
						>
							Đăng ký ngay
						</Button>

						<div className="flex items-center gap-2 text-gray-300">
							<span>Bạn đã có tài khoản?</span>
							<Button
								onClick={() => openAuthModal("login")}
								className="font-semibold text-blue-400 underline transition-colors duration-200 hover:text-blue-300"
							>
								Đăng nhập
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Footer Content */}
			<div className="bg-gray-200 px-8 py-8 text-gray-800">
				<div className="mx-auto max-w-7xl">
					<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
						{/* Company Info */}
						<div className="col-span-1 md:col-span-2">
							<h3 className="mb-4 text-lg font-semibold">Web Store</h3>
							<p className="mb-4 text-sm text-gray-600">
								Chuyên cung cấp các dịch vụ số chất lượng cao với giá cả hợp lý. Đăng ký tài khoản để
								nhận nhiều ưu đãi đặc biệt.
							</p>
						</div>

						{/* Quick Links */}
						<div>
							<h4 className="mb-4 text-base font-medium">Liên kết nhanh</h4>
							<ul className="space-y-2 text-sm text-gray-600">
								<li>
									<a href="#" className="hover:text-gray-800">
										Trang chủ
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-gray-800">
										Sản phẩm
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-gray-800">
										Về chúng tôi
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-gray-800">
										Liên hệ
									</a>
								</li>
							</ul>
						</div>

						{/* Support */}
						<div>
							<h4 className="mb-4 text-base font-medium">Hỗ trợ</h4>
							<ul className="space-y-2 text-sm text-gray-600">
								<li>
									<a href="#" className="hover:text-gray-800">
										Hướng dẫn sử dụng
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-gray-800">
										Chính sách bảo mật
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-gray-800">
										Điều khoản sử dụng
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-gray-800">
										FAQ
									</a>
								</li>
							</ul>
						</div>
					</div>

					{/* Bottom Bar */}
					<div className="mt-8 border-t border-gray-300 pt-8 text-center text-sm text-gray-500">
						<p>&copy; 2024 Web Store. Tất cả quyền được bảo lưu.</p>
					</div>
				</div>
			</div>
		</footer>
	);
}

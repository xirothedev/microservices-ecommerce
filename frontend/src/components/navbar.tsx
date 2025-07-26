"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Smartphone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Cart from "./cart";
import { useUserQuery } from "@/hooks/use-user";
import { getFallbackString } from "@/lib/utils";

interface NavbarProps {
	navItems: { name: string; href: string }[];
}

export default function Navbar({ navItems }: NavbarProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
	const { data } = useUserQuery();
	const user = data?.me;
	const fallbackAvatar = getFallbackString(user?.fullname ?? "");

	return (
		<nav className="bg-color-100 fixed top-0 z-50 w-full border-b shadow-md backdrop-blur-sm transition-colors">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<Link href="/" className="flex items-center space-x-2">
						<Smartphone className="h-8 w-8 text-blue-600" />
						<span className="text-xl font-bold text-gray-900">DigitalPro</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden items-center space-x-8 md:flex">
						{navItems.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className="text-gray-700 transition-colors duration-200"
							>
								{item.name}
							</Link>
						))}
						<div className="flex items-center space-x-2">
							<Cart isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
							{user ? (
								<Avatar>
									<Link href="/profile">
										<AvatarImage src={user.avatarUrl ?? undefined} alt={fallbackAvatar} />
										<AvatarFallback>{fallbackAvatar}</AvatarFallback>
									</Link>
								</Avatar>
							) : (
								<>
									<Button className="bg-blue-600 hover:bg-blue-700" type="button">
										<Link href="/register">Register</Link>
									</Button>
									<Button variant="outline">
										<Link href="/login">Login</Link>
									</Button>
								</>
							)}
						</div>
					</div>

					{/* Mobile Navigation */}
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild className="md:hidden">
							<Button variant="ghost" size="icon">
								<Menu className="h-6 w-6" />
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[300px]">
							<div className="mt-8 flex flex-col space-y-4">
								{navItems.map((item) => (
									<Link
										key={item.name}
										href={item.href}
										className="text-lg text-gray-700 transition-colors duration-200"
										onClick={() => setIsOpen(false)}
									>
										{item.name}
									</Link>
								))}
								<div className="flex items-center justify-center gap-4 py-4">
									<Cart isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
								</div>
								{user ? (
									<Avatar>
										<Link href="/profile">
											<AvatarImage src={user.avatarUrl ?? undefined} alt={fallbackAvatar} />
											<AvatarFallback>{fallbackAvatar}</AvatarFallback>
										</Link>
									</Avatar>
								) : (
									<>
										<Button className="mt-4 bg-blue-600 hover:bg-blue-700">Register</Button>
										<Button className="mt-4" variant="outline">
											Login
										</Button>
									</>
								)}
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</nav>
	);
}

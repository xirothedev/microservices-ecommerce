"use client"

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Smartphone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Cart from "./cart";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Pricing", href: "#pricing" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ]

  return (
		<nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm transition-colors">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center space-x-2">
						<Smartphone className="h-8 w-8 text-blue-600" />
						<span className="text-xl font-bold text-gray-900">DigitalPro</span>
					</div>

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
							<Cart />
							<Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
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
									<Cart />
								</div>
								<Button className="mt-4 bg-blue-600 hover:bg-blue-700">Get Started</Button>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</nav>
  );
}

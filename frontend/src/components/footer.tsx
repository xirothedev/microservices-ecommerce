import Link from "next/link";
import { Smartphone, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
	return (
		<footer className="bg-color-1000 text-white transition-colors">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<div className="grid gap-8 md:grid-cols-4">
					<div className="space-y-4">
						<div className="flex items-center space-x-2">
							<Smartphone className="h-8 w-8 text-blue-400" />
							<span className="text-xl font-bold">DigitalPro</span>
						</div>
						<p className="leading-relaxed text-gray-300">
							Professional digital services with security, reliability, and expert support. Trusted by
							thousands worldwide.
						</p>
					</div>

					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Services</h3>
						<ul className="space-y-2 text-gray-300">
							<li>
								<Link href="#" className="transition-colors hover:text-white">
									Apple ID Setup
								</Link>
							</li>
							<li>
								<Link href="#" className="transition-colors hover:text-white">
									Social Media Management
								</Link>
							</li>
							<li>
								<Link href="#" className="transition-colors hover:text-white">
									YouTube Premium
								</Link>
							</li>
							<li>
								<Link href="#" className="transition-colors hover:text-white">
									Custom Solutions
								</Link>
							</li>
						</ul>
					</div>

					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Company</h3>
						<ul className="space-y-2 text-gray-300">
							<li>
								<Link href="#" className="transition-colors hover:text-white">
									About Us
								</Link>
							</li>
							<li>
								<Link href="#" className="transition-colors hover:text-white">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link href="#" className="transition-colors hover:text-white">
									Terms of Service
								</Link>
							</li>
							<li>
								<Link href="#" className="transition-colors hover:text-white">
									Support
								</Link>
							</li>
						</ul>
					</div>

					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Contact Info</h3>
						<div className="space-y-3 text-gray-300">
							<div className="flex items-center space-x-2">
								<Mail className="h-4 w-4" />
								<span>support@digitalpro.com</span>
							</div>
							<div className="flex items-center space-x-2">
								<Phone className="h-4 w-4" />
								<span>+1 (555) 123-4567</span>
							</div>
							<div className="flex items-center space-x-2">
								<MapPin className="h-4 w-4" />
								<span>San Francisco, CA</span>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-12 border-t border-white pt-8 text-center text-gray-300">
					<p>&copy; 2024 DigitalPro Services. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}

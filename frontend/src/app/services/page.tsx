import ServicesFilter from "@/components/services/services-filter";
import ServicesList from "@/components/services/services-list";

export default function ServicesPage() {
	return (
		<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<ServicesFilter />
			<ServicesList />
		</div>
	);
}

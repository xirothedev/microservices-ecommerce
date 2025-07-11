// "use client";

// import PersonalInformation from "./sections/personal-information";
// import TransactionHistory from "./sections/transaction-history";
// import PurchaseHistory from "./sections/purchase-history";
// import ChangePassword from "./sections/change-password";
// import SupportTickets from "./sections/support-tickets";
// import AccountSettings from "./sections/account-settings";
// import { useContext } from "react";
// import { ProfileSectionContext } from "@/app/profile/page";

// export default function ProfileContent() {
// 	const context = useContext(ProfileSectionContext);
// 	if (!context) throw new Error("ProfileContent must be used within a ProfileSectionContext.Provider");
// 	const { activeSection } = context;

// 	const renderSection = () => {
// 		switch (activeSection) {
// 			case "personal-info":
// 				return <PersonalInformation />;
// 			case "transaction-history":
// 				return <TransactionHistory />;
// 			case "purchase-history":
// 				return <PurchaseHistory />;
// 			case "change-password":
// 				return <ChangePassword />;
// 			case "support-tickets":
// 				return <SupportTickets />;
// 			case "settings":
// 				return <AccountSettings />;
// 			default:
// 				return <PersonalInformation />;
// 		}
// 	};

// 	return <>{renderSection()}</>;
// }

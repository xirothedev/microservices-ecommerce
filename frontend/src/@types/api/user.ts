import z from "zod";

export interface User {
	id: string;
	fullname: string;
	email: string;
	phone: string | null;
	web3Wallet: string | null;
	passwordEnabled: boolean;
	hashedPassword: string | null;
	avatarUrl: string | null;
	address: string | null;
	city: string | null;
	state: string | null;
	zipCode: string | null;
	biography: string | null;
	roles: UserRole[];
	flags: UserFlag[];
	createdAt: string;
	updatedAt: string;
	credit: number;
	visible: UserVisibility;
	isBanned: boolean;
	isLocked: boolean;
	isVerified: boolean;
	lastActiveAt: string | null;
}

export interface UserSettings {
	userId: string;
	emailNotifications: boolean;
	browserNotifications: boolean;
	ticketNotifications: boolean;
	suggestedProducts: boolean;
	promotionNotifications: boolean;
	priceChangesNotifications: boolean;
	loginNotifications: boolean;
	restockNotifications: boolean;
	updatedAt: string;
}

export enum UserRole {
	ROOT = "ROOT",
	ADMINISTRATOR = "ADMINISTRATOR",
	SUPPORTER = "SUPPORTER",
	COLLABORATOR = "COLLABORATOR",
	SELLER = "SELLER",
	USER = "USER",
}

export enum UserFlag {
	BEST_CUSTOMER = "BEST_CUSTOMER",
	DIAMOND_CUSTOMER = "DIAMOND_CUSTOMER",
	GOLD_CUSTOMER = "GOLD_CUSTOMER",
	SILVER_CUSTOMER = "SILVER_CUSTOMER",
	COPPER_CUSTOMER = "COPPER_CUSTOMER",
	CUSTOMER = "CUSTOMER",
}

export enum UserVisibility {
	PUBLIC = "PUBLIC",
	PRIVATE = "PRIVATE",
	CONTACT_ONLY = "CONTACT_ONLY",
}

export interface SafeUser extends Omit<User, "hashedPassword"> {}

// GraphQL query response interface
export interface UserQuery {
	me: SafeUser;
}

// User profile type (alias for SafeUser for REST API)
export interface UserProfile extends SafeUser {}

// Update user input interface (matches backend DTO)
export interface UpdateUserInput {
	fullname?: string;
	address?: string;
	city?: string;
	state?: string;
	zipCode?: string;
	biography?: string;
}

// Update avatar response interface
export interface UpdateAvatarResponse {
	message: string;
	data: SafeUser;
	timestamp?: number;
}

// GraphQL mutation response interface
export interface UpdateUserMutationResponse {
	updateUser: SafeUser;
}

export const profileSchema = z.object({
	fullname: z.string().min(1, "Full name is required"),
	address: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	zipCode: z.string().optional(),
	biography: z.string().optional(),
});

export const loginSchema = z.object({
	email: z.string().email("Invalid email address").min(1, "Email is required"),
	password: z
		.string()
		.min(1, "Password is required")
		.min(8, "Password must be at least 8 characters")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.regex(/[a-z]/, "Password must contain at least one lowercase letter")
		.regex(/[0-9]/, "Password must contain at least one number")
		.regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export const signUpSchema = z.object({
	email: z.string().email("Invalid email address").min(1, "Email is required"),
	fullname: z.string().min(1, "Full name is required"),
	password: z
		.string()
		.min(1, "Password is required")
		.min(8, "Password must be at least 8 characters")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.regex(/[a-z]/, "Password must contain at least one lowercase letter")
		.regex(/[0-9]/, "Password must contain at least one number")
		.regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export type SignUpForm = z.infer<typeof signUpSchema>;
export type LoginForm = z.infer<typeof loginSchema>;
export type ProfileForm = z.infer<typeof profileSchema>;

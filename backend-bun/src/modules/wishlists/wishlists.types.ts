export interface WishlistApp {
	_id: string;
	name: string;
	iconUrl: string;
	price: number;
	subscriptionPrice?: number;
	status?: string;
	developer?: { name?: string };
}

export interface WishlistUser {
	_id: string;
	fullName: string;
	email?: string;
	avatarUrl?: string;
}

export interface Wishlist {
	_id: string;
	user: string;
	apps: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface WishlistWithRelations extends Omit<Wishlist, "user" | "apps"> {
	user: WishlistUser;
	apps: WishlistApp[];
}

export interface CreateWishlistDTO {
	user: string;
	apps: string[];
}

export interface UpdateWishlistDTO {
	user?: string;
	apps?: string[];
}

export interface PaginatedWishlists {
	docs: WishlistWithRelations[];
	totalDocs: number;
	limit: number;
	totalPages: number;
	page: number;
}

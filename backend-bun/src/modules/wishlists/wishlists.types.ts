export interface WishlistApp {
	_id: string;
	name: string;
	iconUrl: string;
	price: number;
	subscriptionPrice?: number;
	status?: string;
	developerId?: { name?: string };
}

export interface WishlistUser {
	_id: string;
	fullName: string;
	email?: string;
	avatarUrl?: string;
}

export interface Wishlist {
	_id: string;
	userId: string;
	appIds: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface WishlistWithRelations extends Wishlist {
	userId: WishlistUser;
	appIds: WishlistApp[];
}

export interface CreateWishlistDTO {
	userId: string;
	appIds: string[];
}

export interface UpdateWishlistDTO {
	userId?: string;
	appIds?: string[];
}

export interface PaginatedWishlists {
	docs: WishlistWithRelations[];
	totalDocs: number;
	limit: number;
	totalPages: number;
	page: number;
}

import { AppError } from "@/shared/errors";
import { WishlistsRepository } from "./wishlists.repository";
import type {
	CreateWishlistDTO,
	PaginatedWishlists,
	UpdateWishlistDTO,
	Wishlist,
	WishlistWithRelations,
} from "./wishlists.types";

export class WishlistsService {
	private repo: WishlistsRepository;

	constructor(repo?: WishlistsRepository) {
		this.repo = repo || new WishlistsRepository();
	}

	async findAll(query: {
		page: number;
		limit: number;
	}): Promise<PaginatedWishlists> {
		const result = await this.repo.findAll(query);
		return {
			docs: result.docs,
			totalDocs: result.total,
			limit: result.limit,
			totalPages: result.totalPages,
			page: result.page,
		};
	}

	async findById(id: string): Promise<Wishlist> {
		const wishlist = await this.repo.findById(id);
		if (!wishlist) throw AppError.notFound("Wishlist not found");
		return wishlist;
	}

	async findByUserId(userId: string): Promise<Wishlist> {
		let wishlist = await this.repo.findByUserId(userId);
		if (!wishlist) {
			// Create empty wishlist for user if not exists
			wishlist = await this.repo.create({ userId, appIds: [] });
		}
		return wishlist;
	}

	async findByUserIdAdmin(userId: string): Promise<WishlistWithRelations> {
		const wishlist = await this.repo.findByUserId(userId);
		if (!wishlist) throw AppError.notFound("Wishlist not found");
		return this.repo.findByIdWithPopulate(
			wishlist._id.toString(),
		) as Promise<WishlistWithRelations>;
	}

	async create(data: CreateWishlistDTO): Promise<Wishlist> {
		const existing = await this.repo.findByUserId(data.userId);
		if (existing) {
			throw AppError.conflict("Wishlist already exists for this user");
		}
		return this.repo.create(data);
	}

	async update(id: string, data: UpdateWishlistDTO): Promise<Wishlist> {
		await this.findById(id);
		const updated = await this.repo.update(id, data);
		if (!updated) throw AppError.notFound("Wishlist not found");
		return updated;
	}

	async delete(id: string): Promise<void> {
		await this.findById(id);
		const deleted = await this.repo.delete(id);
		if (!deleted) throw AppError.internal("Failed to delete wishlist");
	}

	async addApp(userId: string, appId: string): Promise<Wishlist> {
		const wishlist = await this.repo.addApp(userId, appId);
		if (!wishlist) throw AppError.internal("Failed to add app to wishlist");
		return wishlist;
	}

	async removeApp(userId: string, appId: string): Promise<Wishlist> {
		const wishlist = await this.repo.removeApp(userId, appId);
		if (!wishlist) throw AppError.notFound("Wishlist not found");
		return wishlist;
	}

	async clearApps(userId: string): Promise<Wishlist> {
		const wishlist = await this.repo.clearApps(userId);
		if (!wishlist) throw AppError.notFound("Wishlist not found");
		return wishlist;
	}
}

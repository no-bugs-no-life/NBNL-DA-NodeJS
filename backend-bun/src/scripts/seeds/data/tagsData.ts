import { SEED_EPOCH, daysAfter } from "./seedConfig";

export type SeedTag = {
	name: string;
	slug: string;
	createdAt: Date;
	updatedAt: Date;
};

export const seedTags: SeedTag[] = [
	{ name: "Mới nhất", slug: "moi-nhat", createdAt: daysAfter(SEED_EPOCH, 0), updatedAt: daysAfter(SEED_EPOCH, 0) },
	{ name: "Thịnh hành", slug: "thinh-hanh", createdAt: daysAfter(SEED_EPOCH, 0), updatedAt: daysAfter(SEED_EPOCH, 0) },
	{ name: "Miễn phí", slug: "mien-phi", createdAt: daysAfter(SEED_EPOCH, 0), updatedAt: daysAfter(SEED_EPOCH, 0) },
	{ name: "Giảm giá", slug: "giam-gia", createdAt: daysAfter(SEED_EPOCH, 0), updatedAt: daysAfter(SEED_EPOCH, 0) },
	{ name: "Offline", slug: "offline", createdAt: daysAfter(SEED_EPOCH, 0), updatedAt: daysAfter(SEED_EPOCH, 0) },
	{ name: "Nhẹ - tối ưu", slug: "nhe-toi-uu", createdAt: daysAfter(SEED_EPOCH, 0), updatedAt: daysAfter(SEED_EPOCH, 0) },
	{ name: "Bảo mật", slug: "bao-mat-tag", createdAt: daysAfter(SEED_EPOCH, 0), updatedAt: daysAfter(SEED_EPOCH, 0) },
	{ name: "Học tập", slug: "hoc-tap", createdAt: daysAfter(SEED_EPOCH, 0), updatedAt: daysAfter(SEED_EPOCH, 0) },
	{ name: "Ghi chú", slug: "ghi-chu-tag", createdAt: daysAfter(SEED_EPOCH, 0), updatedAt: daysAfter(SEED_EPOCH, 0) },
	{ name: "Tài chính cá nhân", slug: "tai-chinh-ca-nhan", createdAt: daysAfter(SEED_EPOCH, 0), updatedAt: daysAfter(SEED_EPOCH, 0) },
	{ name: "Chỉnh ảnh", slug: "chinh-anh", createdAt: daysAfter(SEED_EPOCH, 0), updatedAt: daysAfter(SEED_EPOCH, 0) },
	{ name: "Lịch", slug: "lich", createdAt: daysAfter(SEED_EPOCH, 0), updatedAt: daysAfter(SEED_EPOCH, 0) },
	{ name: "Sức khỏe", slug: "suc-khoe-tag", createdAt: daysAfter(SEED_EPOCH, 0), updatedAt: daysAfter(SEED_EPOCH, 0) },
	{ name: "PDF", slug: "pdf", createdAt: daysAfter(SEED_EPOCH, 0), updatedAt: daysAfter(SEED_EPOCH, 0) },
	{ name: "Gia đình", slug: "gia-dinh", createdAt: daysAfter(SEED_EPOCH, 0), updatedAt: daysAfter(SEED_EPOCH, 0) },
];


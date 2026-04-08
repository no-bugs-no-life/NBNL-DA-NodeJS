import { SEED_EPOCH, daysAfter } from "./seedConfig";

export type SeedCategory = {
	name: string;
	slug: string;
	iconUrl: string;
	parentSlug: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export const seedCategories: SeedCategory[] = [
	{
		name: "Game Hành động",
		slug: "game-hanh-dong",
		iconUrl: "/icons/categories/action.png",
		parentSlug: null,
		createdAt: daysAfter(SEED_EPOCH, 0),
		updatedAt: daysAfter(SEED_EPOCH, 0),
	},
	{
		name: "Game Trí tuệ",
		slug: "game-tri-tue",
		iconUrl: "/icons/categories/puzzle.png",
		parentSlug: null,
		createdAt: daysAfter(SEED_EPOCH, 0),
		updatedAt: daysAfter(SEED_EPOCH, 0),
	},
	{
		name: "Giáo dục",
		slug: "giao-duc",
		iconUrl: "/icons/categories/education.png",
		parentSlug: null,
		createdAt: daysAfter(SEED_EPOCH, 0),
		updatedAt: daysAfter(SEED_EPOCH, 0),
	},
	{
		name: "Năng suất",
		slug: "nang-suat",
		iconUrl: "/icons/categories/productivity.png",
		parentSlug: null,
		createdAt: daysAfter(SEED_EPOCH, 0),
		updatedAt: daysAfter(SEED_EPOCH, 0),
	},
	{
		name: "Tiện ích",
		slug: "tien-ich",
		iconUrl: "/icons/categories/utilities.png",
		parentSlug: null,
		createdAt: daysAfter(SEED_EPOCH, 0),
		updatedAt: daysAfter(SEED_EPOCH, 0),
	},
	{
		name: "Tài chính",
		slug: "tai-chinh",
		iconUrl: "/icons/categories/finance.png",
		parentSlug: null,
		createdAt: daysAfter(SEED_EPOCH, 0),
		updatedAt: daysAfter(SEED_EPOCH, 0),
	},
	{
		name: "Sức khỏe",
		slug: "suc-khoe",
		iconUrl: "/icons/categories/health.png",
		parentSlug: null,
		createdAt: daysAfter(SEED_EPOCH, 0),
		updatedAt: daysAfter(SEED_EPOCH, 0),
	},
	{
		name: "Ảnh & Video",
		slug: "anh-va-video",
		iconUrl: "/icons/categories/photo-video.png",
		parentSlug: null,
		createdAt: daysAfter(SEED_EPOCH, 0),
		updatedAt: daysAfter(SEED_EPOCH, 0),
	},
	{
		name: "Bảo mật",
		slug: "bao-mat",
		iconUrl: "/icons/categories/security.png",
		parentSlug: null,
		createdAt: daysAfter(SEED_EPOCH, 0),
		updatedAt: daysAfter(SEED_EPOCH, 0),
	},
	{
		name: "Âm nhạc",
		slug: "am-nhac",
		iconUrl: "/icons/categories/music.png",
		parentSlug: null,
		createdAt: daysAfter(SEED_EPOCH, 0),
		updatedAt: daysAfter(SEED_EPOCH, 0),
	},
	{
		name: "Du lịch",
		slug: "du-lich",
		iconUrl: "/icons/categories/travel.png",
		parentSlug: null,
		createdAt: daysAfter(SEED_EPOCH, 0),
		updatedAt: daysAfter(SEED_EPOCH, 0),
	},
	{
		name: "Công cụ học tập",
		slug: "cong-cu-hoc-tap",
		iconUrl: "/icons/categories/study.png",
		parentSlug: "giao-duc",
		createdAt: daysAfter(SEED_EPOCH, 1),
		updatedAt: daysAfter(SEED_EPOCH, 1),
	},
	{
		name: "Lịch & Nhắc việc",
		slug: "lich-nhac-viec",
		iconUrl: "/icons/categories/calendar.png",
		parentSlug: "nang-suat",
		createdAt: daysAfter(SEED_EPOCH, 1),
		updatedAt: daysAfter(SEED_EPOCH, 1),
	},
	{
		name: "Ghi chú",
		slug: "ghi-chu",
		iconUrl: "/icons/categories/notes.png",
		parentSlug: "nang-suat",
		createdAt: daysAfter(SEED_EPOCH, 1),
		updatedAt: daysAfter(SEED_EPOCH, 1),
	},
	{
		name: "PDF & Tài liệu",
		slug: "pdf-tai-lieu",
		iconUrl: "/icons/categories/pdf.png",
		parentSlug: "tien-ich",
		createdAt: daysAfter(SEED_EPOCH, 1),
		updatedAt: daysAfter(SEED_EPOCH, 1),
	},
];


import { SEED_EPOCH, daysAfter } from "./seedConfig";
import type { Platform, VersionStatus } from "@/modules/versions/versions.types";

export type SeedVersion = {
	appSlug: string;
	versionNumber: string;
	versionCode: number;
	releaseName: string;
	changelog: string;
	status: VersionStatus;
	isLatest: boolean;
	publishedAt?: Date;
	files: Array<{
		platform: Platform;
		fileKey: string;
		fileName: string;
		fileSize: number;
		mimeType?: string;
		checksum?: string;
	}>;
	accessControl?: {
		isFree?: boolean;
		requiresPurchase?: boolean;
		requiredSubscription?: "premium" | "pro" | null;
		allowedRoles?: string[];
		allowedUserIds?: string[];
	};
	downloadCount?: number;
};

const f = (args: {
	platform: Platform;
	appSlug: string;
	versionCode: number;
	fileName: string;
	size: number;
}) => ({
	platform: args.platform,
	fileKey: `seed/${args.appSlug}/${args.platform}/v${args.versionCode}/${args.fileName}`,
	fileName: args.fileName,
	fileSize: args.size,
	mimeType: args.platform === "web" ? "application/zip" : "application/octet-stream",
	checksum: "seed",
});

export const seedVersions: SeedVersion[] = [
	// Nimbus Notes (3)
	{
		appSlug: "nimbus-notes",
		versionNumber: "1.0.0",
		versionCode: 100,
		releaseName: "Initial release",
		changelog: "Ghi chú cơ bản, markdown, tìm kiếm nhanh.",
		status: "published",
		isLatest: false,
		publishedAt: daysAfter(SEED_EPOCH, 22),
		files: [f({ platform: "android", appSlug: "nimbus-notes", versionCode: 100, fileName: "nimbus-notes-1.0.0.apk", size: 28_400_000 })],
		downloadCount: 320,
	},
	{
		appSlug: "nimbus-notes",
		versionNumber: "1.1.0",
		versionCode: 110,
		releaseName: "Offline improvements",
		changelog: "Tối ưu offline-first, thêm tag và pin note.",
		status: "published",
		isLatest: false,
		publishedAt: daysAfter(SEED_EPOCH, 28),
		files: [f({ platform: "android", appSlug: "nimbus-notes", versionCode: 110, fileName: "nimbus-notes-1.1.0.apk", size: 29_200_000 })],
		downloadCount: 540,
	},
	{
		appSlug: "nimbus-notes",
		versionNumber: "1.2.0",
		versionCode: 120,
		releaseName: "Sync & history",
		changelog: "Đồng bộ ổn định, lịch sử phiên bản ghi chú.",
		status: "published",
		isLatest: true,
		publishedAt: daysAfter(SEED_EPOCH, 35),
		files: [f({ platform: "android", appSlug: "nimbus-notes", versionCode: 120, fileName: "nimbus-notes-1.2.0.apk", size: 30_100_000 })],
		accessControl: { isFree: true, requiresPurchase: false, requiredSubscription: null, allowedRoles: [], allowedUserIds: [] },
		downloadCount: 880,
	},
	// Flashcards Việt (3)
	{
		appSlug: "flashcards-viet",
		versionNumber: "1.0.0",
		versionCode: 100,
		releaseName: "Launch",
		changelog: "Deck theo chủ đề, SRS cơ bản, nhắc ôn tập.",
		status: "published",
		isLatest: false,
		publishedAt: daysAfter(SEED_EPOCH, 23),
		files: [f({ platform: "web", appSlug: "flashcards-viet", versionCode: 100, fileName: "flashcards-viet-1.0.0.zip", size: 6_800_000 })],
		downloadCount: 410,
	},
	{
		appSlug: "flashcards-viet",
		versionNumber: "1.1.0",
		versionCode: 110,
		releaseName: "Study stats",
		changelog: "Thống kê theo tuần, cải thiện import/export.",
		status: "published",
		isLatest: false,
		publishedAt: daysAfter(SEED_EPOCH, 30),
		files: [f({ platform: "web", appSlug: "flashcards-viet", versionCode: 110, fileName: "flashcards-viet-1.1.0.zip", size: 7_100_000 })],
		downloadCount: 690,
	},
	{
		appSlug: "flashcards-viet",
		versionNumber: "1.2.0",
		versionCode: 120,
		releaseName: "Premium packs",
		changelog: "Bổ sung bộ đề Premium và luyện tập thông minh.",
		status: "published",
		isLatest: true,
		publishedAt: daysAfter(SEED_EPOCH, 37),
		files: [f({ platform: "web", appSlug: "flashcards-viet", versionCode: 120, fileName: "flashcards-viet-1.2.0.zip", size: 7_600_000 })],
		accessControl: { isFree: false, requiresPurchase: true, requiredSubscription: "premium", allowedRoles: [], allowedUserIds: [] },
		downloadCount: 1040,
	},
	// Panda PDF Tools (3)
	{
		appSlug: "panda-pdf-tools",
		versionNumber: "1.0.0",
		versionCode: 100,
		releaseName: "Toolkit",
		changelog: "Gộp/tách, nén và ký tên PDF cơ bản.",
		status: "published",
		isLatest: false,
		publishedAt: daysAfter(SEED_EPOCH, 24),
		files: [f({ platform: "windows", appSlug: "panda-pdf-tools", versionCode: 100, fileName: "panda-pdf-tools-1.0.0.exe", size: 48_200_000 })],
		downloadCount: 220,
	},
	{
		appSlug: "panda-pdf-tools",
		versionNumber: "1.1.0",
		versionCode: 110,
		releaseName: "OCR basic",
		changelog: "Thêm OCR cơ bản và export chất lượng cao.",
		status: "published",
		isLatest: false,
		publishedAt: daysAfter(SEED_EPOCH, 31),
		files: [f({ platform: "windows", appSlug: "panda-pdf-tools", versionCode: 110, fileName: "panda-pdf-tools-1.1.0.exe", size: 49_900_000 })],
		downloadCount: 360,
	},
	{
		appSlug: "panda-pdf-tools",
		versionNumber: "1.2.0",
		versionCode: 120,
		releaseName: "Batch workflows",
		changelog: "Xử lý hàng loạt, tối ưu tốc độ và ổn định.",
		status: "published",
		isLatest: true,
		publishedAt: daysAfter(SEED_EPOCH, 40),
		files: [f({ platform: "windows", appSlug: "panda-pdf-tools", versionCode: 120, fileName: "panda-pdf-tools-1.2.0.exe", size: 50_400_000 })],
		downloadCount: 510,
	},
	// VaultKey Passwords (3)
	{
		appSlug: "vaultkey-passwords",
		versionNumber: "1.0.0",
		versionCode: 100,
		releaseName: "Vault",
		changelog: "Vault mã hóa, generator mật khẩu, auto-lock.",
		status: "published",
		isLatest: false,
		publishedAt: daysAfter(SEED_EPOCH, 25),
		files: [f({ platform: "android", appSlug: "vaultkey-passwords", versionCode: 100, fileName: "vaultkey-1.0.0.apk", size: 22_900_000 })],
		downloadCount: 180,
	},
	{
		appSlug: "vaultkey-passwords",
		versionNumber: "1.1.0",
		versionCode: 110,
		releaseName: "Security patch",
		changelog: "Cải thiện mã hóa và cảnh báo mật khẩu yếu.",
		status: "published",
		isLatest: false,
		publishedAt: daysAfter(SEED_EPOCH, 33),
		files: [f({ platform: "android", appSlug: "vaultkey-passwords", versionCode: 110, fileName: "vaultkey-1.1.0.apk", size: 23_400_000 })],
		downloadCount: 260,
	},
	{
		appSlug: "vaultkey-passwords",
		versionNumber: "1.2.0",
		versionCode: 120,
		releaseName: "Leak reports",
		changelog: "Báo cáo rò rỉ nâng cao và đồng bộ an toàn.",
		status: "published",
		isLatest: true,
		publishedAt: daysAfter(SEED_EPOCH, 44),
		files: [f({ platform: "android", appSlug: "vaultkey-passwords", versionCode: 120, fileName: "vaultkey-1.2.0.apk", size: 24_100_000 })],
		accessControl: { isFree: false, requiresPurchase: true, requiredSubscription: "pro", allowedRoles: [], allowedUserIds: [] },
		downloadCount: 430,
	},
	// MintPixel Photo (3)
	{
		appSlug: "mintpixel-photo",
		versionNumber: "1.0.0",
		versionCode: 100,
		releaseName: "Presets",
		changelog: "Preset màu cơ bản, crop nhanh.",
		status: "published",
		isLatest: false,
		publishedAt: daysAfter(SEED_EPOCH, 26),
		files: [f({ platform: "ios", appSlug: "mintpixel-photo", versionCode: 100, fileName: "mintpixel-1.0.0.ipa", size: 31_300_000 })],
		downloadCount: 300,
	},
	{
		appSlug: "mintpixel-photo",
		versionNumber: "1.1.0",
		versionCode: 110,
		releaseName: "Batch edit",
		changelog: "Chỉnh ảnh hàng loạt, tối ưu export.",
		status: "published",
		isLatest: false,
		publishedAt: daysAfter(SEED_EPOCH, 34),
		files: [f({ platform: "ios", appSlug: "mintpixel-photo", versionCode: 110, fileName: "mintpixel-1.1.0.ipa", size: 32_700_000 })],
		downloadCount: 520,
	},
	{
		appSlug: "mintpixel-photo",
		versionNumber: "1.2.0",
		versionCode: 120,
		releaseName: "Pro tools",
		changelog: "Bộ preset Pro và công cụ tinh chỉnh nâng cao.",
		status: "published",
		isLatest: true,
		publishedAt: daysAfter(SEED_EPOCH, 46),
		files: [f({ platform: "ios", appSlug: "mintpixel-photo", versionCode: 120, fileName: "mintpixel-1.2.0.ipa", size: 34_100_000 })],
		accessControl: { isFree: false, requiresPurchase: true, requiredSubscription: "premium", allowedRoles: [], allowedUserIds: [] },
		downloadCount: 780,
	},
];


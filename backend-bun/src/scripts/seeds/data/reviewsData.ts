import { SEED_EPOCH, daysAfter } from "./seedConfig";

export type SeedReview = {
	userEmail: string;
	appSlug: string;
	rating: 1 | 2 | 3 | 4 | 5;
	comment: string;
	status: "pending" | "approved" | "rejected";
	createdAt: Date;
	updatedAt: Date;
};

export const seedReviews: SeedReview[] = [
	{
		userEmail: "vy.pham@nbnl.com",
		appSlug: "nimbus-notes",
		rating: 5,
		comment: "Gọn, dễ dùng, tìm kiếm nhanh. Offline hoạt động ổn định.",
		status: "approved",
		createdAt: daysAfter(SEED_EPOCH, 40),
		updatedAt: daysAfter(SEED_EPOCH, 40),
	},
	{
		userEmail: "khoa.vo@nbnl.com",
		appSlug: "nimbus-notes",
		rating: 4,
		comment: "UI sạch, nhưng mình muốn thêm lựa chọn font cho markdown.",
		status: "approved",
		createdAt: daysAfter(SEED_EPOCH, 41),
		updatedAt: daysAfter(SEED_EPOCH, 41),
	},
	{
		userEmail: "thao.ngo@nbnl.com",
		appSlug: "flashcards-viet",
		rating: 5,
		comment: "SRS dễ hiểu, nhắc ôn hợp lý. Bộ đề theo chủ đề rất tiện.",
		status: "approved",
		createdAt: daysAfter(SEED_EPOCH, 42),
		updatedAt: daysAfter(SEED_EPOCH, 42),
	},
	{
		userEmail: "huy.dao@nbnl.com",
		appSlug: "flashcards-viet",
		rating: 4,
		comment: "Import/export ổn, nếu có thêm widget nhắc học thì tuyệt.",
		status: "approved",
		createdAt: daysAfter(SEED_EPOCH, 43),
		updatedAt: daysAfter(SEED_EPOCH, 43),
	},
	{
		userEmail: "mai.nguyen@nbnl.com",
		appSlug: "mintpixel-photo",
		rating: 4,
		comment: "Preset đẹp, nhẹ máy. Thiếu vài công cụ fine-tune thì sẽ hoàn hảo.",
		status: "approved",
		createdAt: daysAfter(SEED_EPOCH, 44),
		updatedAt: daysAfter(SEED_EPOCH, 44),
	},
	{
		userEmail: "son.pham@nbnl.com",
		appSlug: "panda-pdf-tools",
		rating: 4,
		comment: "Làm việc PDF nhanh, OCR cơ bản dùng được. Cần thêm hướng dẫn chi tiết.",
		status: "approved",
		createdAt: daysAfter(SEED_EPOCH, 45),
		updatedAt: daysAfter(SEED_EPOCH, 45),
	},
	{
		userEmail: "user.quyen@nbnl.com",
		appSlug: "sunrise-habit",
		rating: 5,
		comment: "Nhắc thói quen thông minh, báo cáo rõ ràng. Dễ duy trì streak.",
		status: "approved",
		createdAt: daysAfter(SEED_EPOCH, 46),
		updatedAt: daysAfter(SEED_EPOCH, 46),
	},
	{
		userEmail: "user.duy@nbnl.com",
		appSlug: "vaultkey-passwords",
		rating: 5,
		comment: "Tập trung privacy, auto-lock hợp lý. Đồng bộ an toàn là điểm cộng.",
		status: "approved",
		createdAt: daysAfter(SEED_EPOCH, 47),
		updatedAt: daysAfter(SEED_EPOCH, 47),
	},
	{
		userEmail: "user.anh@nbnl.com",
		appSlug: "paperplane-tasks",
		rating: 4,
		comment: "Kanban đủ dùng, thao tác nhanh. Nếu có export CSV sẽ tốt hơn.",
		status: "approved",
		createdAt: daysAfter(SEED_EPOCH, 48),
		updatedAt: daysAfter(SEED_EPOCH, 48),
	},
	{
		userEmail: "google.user01@nbnl.com",
		appSlug: "banana-run",
		rating: 4,
		comment: "Chơi giải trí nhanh, nhẹ máy. Quảng cáo ít thì tuyệt.",
		status: "approved",
		createdAt: daysAfter(SEED_EPOCH, 49),
		updatedAt: daysAfter(SEED_EPOCH, 49),
	},
	{
		userEmail: "google.user02@nbnl.com",
		appSlug: "puzzle-bento",
		rating: 5,
		comment: "Puzzle vui, level ngắn, chơi offline rất ổn.",
		status: "approved",
		createdAt: daysAfter(SEED_EPOCH, 50),
		updatedAt: daysAfter(SEED_EPOCH, 50),
	},
	{
		userEmail: "vy.pham@nbnl.com",
		appSlug: "travelpocket",
		rating: 4,
		comment: "Checklist du lịch hữu ích. Offline tốt, UI gọn gàng.",
		status: "approved",
		createdAt: daysAfter(SEED_EPOCH, 51),
		updatedAt: daysAfter(SEED_EPOCH, 51),
	},
	{
		userEmail: "khoa.vo@nbnl.com",
		appSlug: "coconut-budget",
		rating: 4,
		comment: "Nhập chi tiêu nhanh, báo cáo ổn. Muốn thêm import bank csv.",
		status: "pending",
		createdAt: daysAfter(SEED_EPOCH, 52),
		updatedAt: daysAfter(SEED_EPOCH, 52),
	},
	{
		userEmail: "thao.ngo@nbnl.com",
		appSlug: "lotuslab-dictionary",
		rating: 5,
		comment: "Tra cứu nhanh, lưu từ vựng tiện. Bài luyện mỗi ngày rất hay.",
		status: "approved",
		createdAt: daysAfter(SEED_EPOCH, 53),
		updatedAt: daysAfter(SEED_EPOCH, 53),
	},
	{
		userEmail: "son.pham@nbnl.com",
		appSlug: "riversoft-recorder",
		rating: 3,
		comment: "Ghi âm ổn, nhưng đôi lúc export chậm. Mong cải thiện hiệu năng.",
		status: "rejected",
		createdAt: daysAfter(SEED_EPOCH, 54),
		updatedAt: daysAfter(SEED_EPOCH, 54),
	},
];


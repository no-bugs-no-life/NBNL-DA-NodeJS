import { SEED_EPOCH, daysAfter } from "./seedConfig";
import type { Notification } from "@/modules/notifications/notifications.types";

export type SeedNotification = {
	userEmail: string;
	type: Notification["type"];
	channel: Notification["channel"];
	message: string;
	isRead: boolean;
	sentAt?: Date;
	createdAt: Date;
	updatedAt: Date;
};

export const seedNotifications: SeedNotification[] = [
	{
		userEmail: "vy.pham@nbnl.com",
		type: "promotion",
		channel: "inapp",
		message: "Ưu đãi tuần này: giảm 20% cho gói PDF và ảnh Pro.",
		isRead: false,
		createdAt: daysAfter(SEED_EPOCH, 90),
		updatedAt: daysAfter(SEED_EPOCH, 90),
	},
	{
		userEmail: "khoa.vo@nbnl.com",
		type: "update",
		channel: "inapp",
		message: "Panda PDF Tools vừa có bản cập nhật 1.2.0 với batch workflows.",
		isRead: true,
		createdAt: daysAfter(SEED_EPOCH, 91),
		updatedAt: daysAfter(SEED_EPOCH, 92),
	},
	{
		userEmail: "thao.ngo@nbnl.com",
		type: "system",
		channel: "email",
		message: "Xác nhận đăng ký gói học tập thành công. Chúc bạn học hiệu quả!",
		isRead: true,
		sentAt: daysAfter(SEED_EPOCH, 55),
		createdAt: daysAfter(SEED_EPOCH, 55),
		updatedAt: daysAfter(SEED_EPOCH, 55),
	},
	{
		userEmail: "huy.dao@nbnl.com",
		type: "new_review",
		channel: "inapp",
		message: "Ứng dụng Nimbus Notes vừa nhận được đánh giá mới.",
		isRead: false,
		createdAt: daysAfter(SEED_EPOCH, 93),
		updatedAt: daysAfter(SEED_EPOCH, 93),
	},
	{
		userEmail: "mai.nguyen@nbnl.com",
		type: "update",
		channel: "email",
		message: "MintPixel Photo 1.2.0 đã sẵn sàng. Pro tools và preset mới.",
		isRead: true,
		sentAt: daysAfter(SEED_EPOCH, 96),
		createdAt: daysAfter(SEED_EPOCH, 96),
		updatedAt: daysAfter(SEED_EPOCH, 96),
	},
	{
		userEmail: "son.pham@nbnl.com",
		type: "system",
		channel: "inapp",
		message: "Cảm ơn bạn đã đóng góp review. Đội ngũ sẽ xem xét trong 24h.",
		isRead: true,
		createdAt: daysAfter(SEED_EPOCH, 97),
		updatedAt: daysAfter(SEED_EPOCH, 97),
	},
	{
		userEmail: "user.quyen@nbnl.com",
		type: "promotion",
		channel: "inapp",
		message: "Gói sức khỏe 1 năm đang có giá ưu đãi trong 48 giờ.",
		isRead: false,
		createdAt: daysAfter(SEED_EPOCH, 98),
		updatedAt: daysAfter(SEED_EPOCH, 98),
	},
	{
		userEmail: "user.duy@nbnl.com",
		type: "system",
		channel: "inapp",
		message: "Bảo mật tài khoản: bật xác thực 2 bước để an toàn hơn.",
		isRead: false,
		createdAt: daysAfter(SEED_EPOCH, 99),
		updatedAt: daysAfter(SEED_EPOCH, 99),
	},
	{
		userEmail: "user.anh@nbnl.com",
		type: "promotion",
		channel: "email",
		message: "Gói trọn đời đang có ưu đãi. Mua 1 lần dùng lâu dài.",
		isRead: true,
		sentAt: daysAfter(SEED_EPOCH, 100),
		createdAt: daysAfter(SEED_EPOCH, 100),
		updatedAt: daysAfter(SEED_EPOCH, 100),
	},
	{
		userEmail: "google.user01@nbnl.com",
		type: "new_download",
		channel: "inapp",
		message: "Cảm ơn bạn đã tải Banana Run. Chúc bạn chơi vui!",
		isRead: true,
		createdAt: daysAfter(SEED_EPOCH, 101),
		updatedAt: daysAfter(SEED_EPOCH, 101),
	},
	{
		userEmail: "google.user02@nbnl.com",
		type: "system",
		channel: "inapp",
		message: "Bạn có thể đăng nhập đa thiết bị bằng Google để đồng bộ dữ liệu.",
		isRead: false,
		createdAt: daysAfter(SEED_EPOCH, 102),
		updatedAt: daysAfter(SEED_EPOCH, 102),
	},
	{
		userEmail: "admin@nbnl.com",
		type: "system",
		channel: "inapp",
		message: "Tổng quan hệ thống: có 2 app đang chờ duyệt và 1 report mới.",
		isRead: false,
		createdAt: daysAfter(SEED_EPOCH, 103),
		updatedAt: daysAfter(SEED_EPOCH, 103),
	},
	{
		userEmail: "moderator@nbnl.com",
		type: "sendmail",
		channel: "email",
		message: "Có review cần kiểm duyệt. Vui lòng kiểm tra mục Reviews.",
		isRead: true,
		sentAt: daysAfter(SEED_EPOCH, 104),
		createdAt: daysAfter(SEED_EPOCH, 104),
		updatedAt: daysAfter(SEED_EPOCH, 104),
	},
	{
		userEmail: "devstudio@nbnl.com",
		type: "app_approved",
		channel: "inapp",
		message: "Chúc mừng! Ứng dụng Nimbus Notes đã được phê duyệt.",
		isRead: true,
		createdAt: daysAfter(SEED_EPOCH, 105),
		updatedAt: daysAfter(SEED_EPOCH, 105),
	},
	{
		userEmail: "tuan.nguyen@nbnl.com",
		type: "app_approved",
		channel: "inapp",
		message: "Ứng dụng Flashcards Việt đã được phê duyệt và hiển thị trên store.",
		isRead: true,
		createdAt: daysAfter(SEED_EPOCH, 106),
		updatedAt: daysAfter(SEED_EPOCH, 106),
	},
];


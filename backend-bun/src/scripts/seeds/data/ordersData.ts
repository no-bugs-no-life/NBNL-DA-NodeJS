import { SEED_EPOCH, daysAfter } from "./seedConfig";
import type { PaymentMethod, OrderStatus } from "@/modules/orders/orders.types";

export type SeedOrderItem = {
	appSlug: string;
	name: string;
	price: number;
	iconUrl?: string;
};

export type SeedOrder = {
	orderNo: string;
	userEmail: string;
	items: SeedOrderItem[];
	discountAmount: number;
	status: OrderStatus;
	paymentMethod: PaymentMethod;
	paymentId?: string;
	paidAt?: Date;
	createdAt: Date;
	updatedAt: Date;
};

export const seedOrders: SeedOrder[] = [
	{
		orderNo: "ORD-2025-0001",
		userEmail: "son.pham@nbnl.com",
		items: [{ appSlug: "panda-pdf-tools", name: "Panda PDF Tools", price: 59000 }],
		discountAmount: 0,
		status: "completed",
		paymentMethod: "momo",
		paymentId: "momo_0001",
		paidAt: daysAfter(SEED_EPOCH, 30),
		createdAt: daysAfter(SEED_EPOCH, 30),
		updatedAt: daysAfter(SEED_EPOCH, 30),
	},
	{
		orderNo: "ORD-2025-0002",
		userEmail: "mai.nguyen@nbnl.com",
		items: [{ appSlug: "mintpixel-photo", name: "MintPixel Photo", price: 49000 }],
		discountAmount: 10000,
		status: "completed",
		paymentMethod: "paypal",
		paymentId: "paypal_0002",
		paidAt: daysAfter(SEED_EPOCH, 31),
		createdAt: daysAfter(SEED_EPOCH, 31),
		updatedAt: daysAfter(SEED_EPOCH, 31),
	},
	{
		orderNo: "ORD-2025-0003",
		userEmail: "user.duy@nbnl.com",
		items: [{ appSlug: "vaultkey-passwords", name: "VaultKey Passwords", price: 99000 }],
		discountAmount: 0,
		status: "completed",
		paymentMethod: "card",
		paymentId: "card_0003",
		paidAt: daysAfter(SEED_EPOCH, 32),
		createdAt: daysAfter(SEED_EPOCH, 32),
		updatedAt: daysAfter(SEED_EPOCH, 32),
	},
	{
		orderNo: "ORD-2025-0004",
		userEmail: "vy.pham@nbnl.com",
		items: [{ appSlug: "coconut-budget", name: "Coconut Budget", price: 39000 }],
		discountAmount: 0,
		status: "processing",
		paymentMethod: "momo",
		paymentId: "momo_0004",
		createdAt: daysAfter(SEED_EPOCH, 33),
		updatedAt: daysAfter(SEED_EPOCH, 33),
	},
	{
		orderNo: "ORD-2025-0005",
		userEmail: "khoa.vo@nbnl.com",
		items: [{ appSlug: "puzzle-bento", name: "Puzzle Bento", price: 29000 }],
		discountAmount: 0,
		status: "completed",
		paymentMethod: "coin",
		paymentId: "coin_0005",
		paidAt: daysAfter(SEED_EPOCH, 34),
		createdAt: daysAfter(SEED_EPOCH, 34),
		updatedAt: daysAfter(SEED_EPOCH, 34),
	},
	{
		orderNo: "ORD-2025-0006",
		userEmail: "thao.ngo@nbnl.com",
		items: [{ appSlug: "panda-pdf-tools", name: "Panda PDF Tools", price: 59000 }],
		discountAmount: 5000,
		status: "completed",
		paymentMethod: "paypal",
		paymentId: "paypal_0006",
		paidAt: daysAfter(SEED_EPOCH, 35),
		createdAt: daysAfter(SEED_EPOCH, 35),
		updatedAt: daysAfter(SEED_EPOCH, 35),
	},
	{
		orderNo: "ORD-2025-0007",
		userEmail: "huy.dao@nbnl.com",
		items: [{ appSlug: "nimbus-notes", name: "Nimbus Notes", price: 0 }],
		discountAmount: 0,
		status: "completed",
		paymentMethod: "coin",
		paymentId: "coin_0007",
		paidAt: daysAfter(SEED_EPOCH, 36),
		createdAt: daysAfter(SEED_EPOCH, 36),
		updatedAt: daysAfter(SEED_EPOCH, 36),
	},
	{
		orderNo: "ORD-2025-0008",
		userEmail: "user.quyen@nbnl.com",
		items: [{ appSlug: "sunrise-habit", name: "Sunrise Habit", price: 0 }],
		discountAmount: 0,
		status: "completed",
		paymentMethod: "coin",
		paymentId: "coin_0008",
		paidAt: daysAfter(SEED_EPOCH, 37),
		createdAt: daysAfter(SEED_EPOCH, 37),
		updatedAt: daysAfter(SEED_EPOCH, 37),
	},
	{
		orderNo: "ORD-2025-0009",
		userEmail: "google.user01@nbnl.com",
		items: [{ appSlug: "banana-run", name: "Banana Run", price: 0 }],
		discountAmount: 0,
		status: "completed",
		paymentMethod: "paypal",
		paymentId: "paypal_0009",
		paidAt: daysAfter(SEED_EPOCH, 38),
		createdAt: daysAfter(SEED_EPOCH, 38),
		updatedAt: daysAfter(SEED_EPOCH, 38),
	},
	{
		orderNo: "ORD-2025-0010",
		userEmail: "google.user02@nbnl.com",
		items: [{ appSlug: "flashcards-viet", name: "Flashcards Việt", price: 0 }],
		discountAmount: 0,
		status: "completed",
		paymentMethod: "momo",
		paymentId: "momo_0010",
		paidAt: daysAfter(SEED_EPOCH, 39),
		createdAt: daysAfter(SEED_EPOCH, 39),
		updatedAt: daysAfter(SEED_EPOCH, 39),
	},
	{
		orderNo: "ORD-2025-0011",
		userEmail: "user.anh@nbnl.com",
		items: [{ appSlug: "paperplane-tasks", name: "PaperPlane Tasks", price: 0 }],
		discountAmount: 0,
		status: "failed",
		paymentMethod: "card",
		paymentId: "card_0011",
		createdAt: daysAfter(SEED_EPOCH, 40),
		updatedAt: daysAfter(SEED_EPOCH, 40),
	},
	{
		orderNo: "ORD-2025-0012",
		userEmail: "vy.pham@nbnl.com",
		items: [
			{ appSlug: "vaultkey-passwords", name: "VaultKey Passwords", price: 99000 },
			{ appSlug: "panda-pdf-tools", name: "Panda PDF Tools", price: 59000 },
		],
		discountAmount: 15000,
		status: "completed",
		paymentMethod: "paypal",
		paymentId: "paypal_0012",
		paidAt: daysAfter(SEED_EPOCH, 41),
		createdAt: daysAfter(SEED_EPOCH, 41),
		updatedAt: daysAfter(SEED_EPOCH, 41),
	},
	{
		orderNo: "ORD-2025-0013",
		userEmail: "son.pham@nbnl.com",
		items: [{ appSlug: "coconut-budget", name: "Coconut Budget", price: 39000 }],
		discountAmount: 0,
		status: "completed",
		paymentMethod: "momo",
		paymentId: "momo_0013",
		paidAt: daysAfter(SEED_EPOCH, 42),
		createdAt: daysAfter(SEED_EPOCH, 42),
		updatedAt: daysAfter(SEED_EPOCH, 42),
	},
	{
		orderNo: "ORD-2025-0014",
		userEmail: "thao.ngo@nbnl.com",
		items: [{ appSlug: "mintpixel-photo", name: "MintPixel Photo", price: 49000 }],
		discountAmount: 0,
		status: "completed",
		paymentMethod: "card",
		paymentId: "card_0014",
		paidAt: daysAfter(SEED_EPOCH, 43),
		createdAt: daysAfter(SEED_EPOCH, 43),
		updatedAt: daysAfter(SEED_EPOCH, 43),
	},
	{
		orderNo: "ORD-2025-0015",
		userEmail: "khoa.vo@nbnl.com",
		items: [{ appSlug: "vaultkey-passwords", name: "VaultKey Passwords", price: 99000 }],
		discountAmount: 5000,
		status: "completed",
		paymentMethod: "paypal",
		paymentId: "paypal_0015",
		paidAt: daysAfter(SEED_EPOCH, 44),
		createdAt: daysAfter(SEED_EPOCH, 44),
		updatedAt: daysAfter(SEED_EPOCH, 44),
	},
];


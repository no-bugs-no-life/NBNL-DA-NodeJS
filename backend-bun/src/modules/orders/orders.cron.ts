import cron from "node-cron";
import { env } from "@/config/env";
import { logger } from "@/infra/logger/logger";
import { OrdersService } from "./orders.service";

type SepayTransaction = {
	id: string;
	transaction_content?: string;
	transactionContent?: string;
	content?: string;
	description?: string;
	transferContent?: string;
	amount_in?: string;
};

type SepayResponse = {
	status: number;
	transactions?: SepayTransaction[];
};

const ORDER_REGEXES = [
	/APK\s+([A-Z0-9-]+)/i,
	/#([A-Z0-9-]+)/i,
];

export function extractOrderNo(content?: string): string | null {
	if (!content) return null;
	for (const regex of ORDER_REGEXES) {
		const match = content.match(regex);
		const orderNo = match?.[1]?.trim();
		if (orderNo) return orderNo.toUpperCase();
	}
	return null;
}

export async function processSepayTransactions(
	ordersService: Pick<OrdersService, "markOrderPaidByOrderNo">,
	transactions: SepayTransaction[],
) {
	for (const tx of transactions) {
		const content =
			tx.transaction_content ||
			tx.transactionContent ||
			tx.content ||
			tx.description ||
			tx.transferContent;
		const orderNo = extractOrderNo(content);
		if (!orderNo) continue;
		await ordersService.markOrderPaidByOrderNo(orderNo, tx.id, tx.amount_in);
	}
}

async function fetchTransactions() {
	const res = await fetch("https://my.sepay.vn/userapi/transactions/list?limit=5", {
		headers: {
			Authorization: `Bearer ${env.SEPAY_TOKEN}`,
		},
	});
	if (!res.ok) throw new Error(`SePay HTTP ${res.status}`);
	const data = (await res.json()) as SepayResponse;
	logger.info(
		{
			sepayStatus: data.status,
			transactionCount: data.transactions?.length ?? 0,
			transactionsPreview: (data.transactions || []).slice(0, 3).map((tx) => ({
				id: tx.id,
				transaction_content: tx.transaction_content,
				transactionContent: tx.transactionContent,
				content: tx.content,
				description: tx.description,
				transferContent: tx.transferContent,
				amount_in: tx.amount_in,
			})),
		},
		"SePay transactions response",
	);
	return data;
}

export function startOrderPaymentCron() {
	if (!env.SEPAY_TOKEN) {
		logger.warn("SEPAY_TOKEN missing, skip SePay cron");
		return;
	}

	const ordersService = new OrdersService();
	cron.schedule(env.SEPAY_POLL_CRON, async () => {
		try {
			const pendingOrders = await ordersService.listPendingBankOrders(1);
			if (pendingOrders.length === 0) return;
			const data = await fetchTransactions();
			const txs = data.transactions || [];
			await processSepayTransactions(ordersService, txs);
		} catch (error) {
			logger.error({ err: error }, "SePay cron failed");
		}
	});
	logger.info(`SePay cron started: ${env.SEPAY_POLL_CRON}`);
}

function paymentTimeoutCutoff(): Date {
	const ms = env.ORDER_PAYMENT_TIMEOUT_MINUTES * 60 * 1000;
	return new Date(Date.now() - ms);
}

export function startOrderExpireCron() {
	const ordersService = new OrdersService();
	cron.schedule(env.ORDER_EXPIRE_CRON, async () => {
		try {
			const cutoff = paymentTimeoutCutoff();
			const count = await ordersService.cancelUnpaidOrdersCreatedBefore(cutoff);
			if (count > 0) {
				logger.info(
					{ count, cutoff: cutoff.toISOString() },
					"Đã hủy đơn quá hạn thanh toán",
				);
			}
		} catch (error) {
			logger.error({ err: error }, "Cron hủy đơn quá hạn thất bại");
		}
	});
	logger.info(
		`Cron hủy đơn quá hạn đã chạy: ${env.ORDER_EXPIRE_CRON} (sau ${env.ORDER_PAYMENT_TIMEOUT_MINUTES} phút từ createdAt)`,
	);
}

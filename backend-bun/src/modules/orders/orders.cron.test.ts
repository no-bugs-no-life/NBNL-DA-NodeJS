import { describe, expect, it, mock } from "bun:test";
import { extractOrderNo, processSepayTransactions } from "./orders.cron";

describe("orders payment cron business logic", () => {
	it("extracts order number from transaction content", () => {
		expect(extractOrderNo("CK APK APK-123456")).toBe("APK-123456");
		expect(extractOrderNo("abc APK ORD001 xyz")).toBe("ORD001");
		expect(extractOrderNo("thanh toan #042D1986")).toBe("042D1986");
	});

	it("returns null when content has no order marker", () => {
		expect(extractOrderNo("chuyen khoan don hang")).toBeNull();
		expect(extractOrderNo("")).toBeNull();
		expect(extractOrderNo(undefined)).toBeNull();
	});

	it("marks only transactions containing supported order markers", async () => {
		const markOrderPaidByOrderNo = mock(async () => null);
		await processSepayTransactions(
			{ markOrderPaidByOrderNo },
			[
				{ id: "100", transaction_content: "ND: APK APK-ORDER-01" },
				{ id: "101", transaction_content: "khong co ma" },
				{ id: "102", transaction_content: "abc APK ORDXYZ" },
				{ id: "103", transaction_content: "thanh toan don #042D1986" },
				{ id: "104", transferContent: "CK APK APK892381036300" },
			],
		);

		expect(markOrderPaidByOrderNo).toHaveBeenCalledTimes(4);
		expect(markOrderPaidByOrderNo).toHaveBeenNthCalledWith(
			1,
			"APK-ORDER-01",
			"100",
			undefined,
		);
		expect(markOrderPaidByOrderNo).toHaveBeenNthCalledWith(2, "ORDXYZ", "102", undefined);
		expect(markOrderPaidByOrderNo).toHaveBeenNthCalledWith(3, "042D1986", "103", undefined);
		expect(markOrderPaidByOrderNo).toHaveBeenNthCalledWith(4, "APK892381036300", "104", undefined);
	});
});

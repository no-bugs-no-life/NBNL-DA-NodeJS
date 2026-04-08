import type {
	IOrder,
	OrderQuery,
	OrderStatus,
	PaymentStatus,
} from "./orders.types";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export interface IOrderRepository {
	findByUserId(user: string): Promise<IOrder[]>;
	findById(id: string): Promise<IOrder | null>;
	findAllPaginated(
		query: OrderQuery,
	): Promise<{ orders: IOrder[]; total: number }>;
	create(data: Partial<IOrder>): Promise<IOrder>;
	updateStatus(id: string, status: OrderStatus): Promise<IOrder | null>;
	updatePayment(
		id: string,
		paymentId: string,
		paidAt: Date,
		paidAmount?: number,
		paymentStatus?: PaymentStatus,
	): Promise<IOrder | null>;
	findPendingBankOrders(limit?: number): Promise<IOrder[]>;
	cancelUnpaidOrdersOlderThan(cutoff: Date): Promise<number>;
	delete(id: string): Promise<boolean>;
}

export class OrdersRepository implements IOrderRepository {
	private get db() {
		// biome-ignore lint/style/noNonNullAssertion: initialized on app bootstrap
		return mongoose.connection.db!;
	}

	private get collection() {
		return this.db.collection<IOrder>("orders");
	}

	async findByUserId(user: string): Promise<IOrder[]> {
		if (!ObjectId.isValid(user)) return [];
		return this.collection
			.find({ user: new ObjectId(user) as unknown as IOrder["user"] })
			.sort({ createdAt: -1 })
			.toArray();
	}

	async findById(id: string): Promise<IOrder | null> {
		if (!ObjectId.isValid(id)) return null;
		return this.collection.findOne({
			_id: new ObjectId(id) as unknown as IOrder["_id"],
		});
	}

	async findAllPaginated(
		query: OrderQuery,
	): Promise<{ orders: IOrder[]; total: number }> {
		const page = Math.max(1, query.page ?? 1);
		const limit = Math.max(1, Math.min(100, query.limit ?? 20));
		const skip = (page - 1) * limit;
		const filter: Record<string, unknown> = {};
		if (query.status) filter.status = query.status;
		if (query.paymentMethod) filter.paymentMethod = query.paymentMethod;
		const [orders, total] = await Promise.all([
			this.collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
			this.collection.countDocuments(filter),
		]);
		return { orders, total };
	}

	async create(data: Partial<IOrder>): Promise<IOrder> {
		const now = new Date();
		const doc = {
			...data,
			createdAt: now,
			updatedAt: now,
		} as IOrder;
		const result = await this.collection.insertOne(doc);
		return { ...doc, _id: result.insertedId as unknown as IOrder["_id"] };
	}

	async updateStatus(
		id: string,
		status: OrderStatus,
	): Promise<IOrder | null> {
		if (!ObjectId.isValid(id)) return null;
		const result = await this.collection.findOneAndUpdate(
			{ _id: new ObjectId(id) as unknown as IOrder["_id"] },
			{ $set: { status, updatedAt: new Date() } },
			{ returnDocument: "after" },
		);
		return result ?? null;
	}

	async updatePayment(
		id: string,
		paymentId: string,
		paidAt: Date,
		paidAmount?: number,
		paymentStatus?: PaymentStatus,
	): Promise<IOrder | null> {
		if (!ObjectId.isValid(id)) return null;
		const result = await this.collection.findOneAndUpdate(
			{ _id: new ObjectId(id) as unknown as IOrder["_id"] },
			{
				$set: {
					paymentId,
					paidAt,
					paidAmount,
					paymentStatus,
					status: "completed",
					updatedAt: new Date(),
				},
			},
			{ returnDocument: "after" },
		);
		return result ?? null;
	}

	async findPendingBankOrders(limit = 200): Promise<IOrder[]> {
		return this.collection
			.find({
				status: { $in: ["pending", "processing"] },
				paymentMethod: "bank_qr",
			})
			.sort({ createdAt: -1 })
			.limit(limit)
			.toArray();
	}

	async cancelUnpaidOrdersOlderThan(cutoff: Date): Promise<number> {
		const result = await this.collection.updateMany(
			{
				status: { $in: ["pending", "processing"] },
				createdAt: { $lt: cutoff },
			},
			{
				$set: { status: "cancelled", updatedAt: new Date() },
			},
		);
		return result.modifiedCount ?? 0;
	}

	async delete(id: string): Promise<boolean> {
		if (!ObjectId.isValid(id)) return false;
		const result = await this.collection.deleteOne({
			_id: new ObjectId(id) as unknown as IOrder["_id"],
		});
		return result.deletedCount > 0;
	}
}

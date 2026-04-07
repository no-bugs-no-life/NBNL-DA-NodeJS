import type { IOrder, OrderQuery, OrderStatus } from "./orders.types";

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
	): Promise<IOrder | null>;
	delete(id: string): Promise<boolean>;
}

export class OrdersRepository implements IOrderRepository {
	async findAll(): Promise<IOrder[]> {
		// TODO: Implement with MongoDB
		return [];
	}

	async findByUserId(_user: string): Promise<IOrder[]> {
		// TODO: Implement with MongoDB
		return [];
	}

	async findById(_id: string): Promise<IOrder | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async findAllPaginated(
		_query: OrderQuery,
	): Promise<{ orders: IOrder[]; total: number }> {
		// TODO: Implement with MongoDB
		return { orders: [], total: 0 };
	}

	async create(_data: Partial<IOrder>): Promise<IOrder> {
		// TODO: Implement with MongoDB
		return {} as IOrder;
	}

	async update(_id: string, _data: Partial<IOrder>): Promise<IOrder | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async updateStatus(
		_id: string,
		_status: OrderStatus,
	): Promise<IOrder | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async updatePayment(
		_id: string,
		_paymentId: string,
		_paidAt: Date,
	): Promise<IOrder | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async delete(_id: string): Promise<boolean> {
		// TODO: Implement with MongoDB - soft delete
		return false;
	}
}

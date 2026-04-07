import type { INotification } from "./notifications.types";

export interface INotificationRepository {
	findAllByUser(userId: string): Promise<INotification[]>;
	findById(id: string): Promise<INotification | null>;
	create(data: Omit<INotification, "id" | "isRead" | "createdAt">): Promise<INotification>;
	markAsRead(id: string): Promise<INotification | null>;
	markAllAsRead(userId: string): Promise<number>;
	delete(id: string): Promise<boolean>;
	getUnreadCount(userId: string): Promise<number>;
}

export class NotificationRepository implements INotificationRepository {
	private store: INotification[] = [
		{
			id: "1",
			userId: "1",
			title: "Chào mừng đến với NBNL Store",
			message: "Cảm ơn bạn đã đăng ký tài khoản!",
			type: "system",
			isRead: false,
			link: "/welcome",
			createdAt: new Date(),
		},
	];

	async findAllByUser(userId: string): Promise<INotification[]> {
		return this.store.filter((n) => n.userId === userId).sort(
			(a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
		);
	}

	async findById(id: string): Promise<INotification | null> {
		return this.store.find((n) => n.id === id) ?? null;
	}

	async create(data: Omit<INotification, "id" | "isRead" | "createdAt">): Promise<INotification> {
		const notification: INotification = {
			id: Date.now().toString(),
			...data,
			isRead: false,
			createdAt: new Date(),
		};
		this.store.push(notification);
		return notification;
	}

	async markAsRead(id: string): Promise<INotification | null> {
		const index = this.store.findIndex((n) => n.id === id);
		if (index === -1) return null;
		this.store[index]!.isRead = true;
		return this.store[index]!;
	}

	async markAllAsRead(userId: string): Promise<number> {
		let count = 0;
		this.store.forEach((n, i) => {
			if (n.userId === userId && !n.isRead) {
				this.store[i]!.isRead = true;
				count++;
			}
		});
		return count;
	}

	async delete(id: string): Promise<boolean> {
		const index = this.store.findIndex((n) => n.id === id);
		if (index === -1) return false;
		this.store.splice(index, 1);
		return true;
	}

	async getUnreadCount(userId: string): Promise<number> {
		return this.store.filter((n) => n.userId === userId && !n.isRead).length;
	}
}

import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import type {
	CreateNotificationDTO,
	Notification,
	NotificationQueryDTO,
	NotificationWithUser,
	PaginatedNotifications,
	UpdateNotificationDTO,
	UserInfo,
} from "./notifications.types";

const COLLECTION = "notifications";

const notificationSchema = new mongoose.Schema<Notification>(
	{
		userId: { type: String, required: true, index: true },
		type: {
			type: String,
			enum: [
				"app_approved",
				"app_rejected",
				"new_review",
				"new_download",
				"system",
				"promotion",
				"update",
				"sendmail",
			],
			required: true,
			index: true,
		},
		channel: {
			type: String,
			enum: ["inapp", "email", "firebase"],
			default: "inapp",
		},
		message: { type: String, required: true },
		isRead: { type: Boolean, default: false, index: true },
		sentAt: { type: Date },
	},
	{ timestamps: true, collection: COLLECTION },
);

// Indexes
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

export const NotificationModel =
	mongoose.models[COLLECTION] ||
	mongoose.model<Notification>(COLLECTION, notificationSchema);

export interface INotificationRepository {
	findAll(options: NotificationQueryDTO): Promise<PaginatedNotifications>;
	findAllByUser(userId: string): Promise<Notification[]>;
	findById(id: string): Promise<Notification | null>;
	create(data: CreateNotificationDTO): Promise<Notification>;
	update(id: string, data: UpdateNotificationDTO): Promise<Notification | null>;
	markAsRead(id: string): Promise<Notification | null>;
	markAllAsRead(userId: string): Promise<number>;
	delete(id: string): Promise<boolean>;
	getUnreadCount(userId: string): Promise<number>;
}

export class NotificationRepository implements INotificationRepository {
	private get db() {
		// biome-ignore lint/style/noNonNullAssertion: Required by mongoose
		return mongoose.connection.db!;
	}

	private get collection() {
		return this.db.collection(COLLECTION);
	}

	async findAll(
		options: NotificationQueryDTO = {},
	): Promise<PaginatedNotifications> {
		const query: Record<string, unknown> = {};
		if (options.userId) query.userId = options.userId;
		if (options.type) query.type = options.type;
		if (options.isRead !== undefined) query.isRead = options.isRead;

		const page = options.page || 1;
		const limit = options.limit || 20;
		const skip = (page - 1) * limit;

		const [docs, totalDocs] = await Promise.all([
			this.collection
				.find(query)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.toArray(),
			this.collection.countDocuments(query),
		]);

		const notifications = await this.populateUserInfo(docs as Notification[]);

		return {
			docs: notifications,
			totalDocs,
			limit,
			totalPages: Math.ceil(totalDocs / limit),
			page,
		};
	}

	async findAllByUser(userId: string): Promise<Notification[]> {
		const docs = await this.collection
			.find({ userId })
			.sort({ createdAt: -1 })
			.toArray();
		return docs as Notification[];
	}

	async findById(id: string): Promise<Notification | null> {
		if (!ObjectId.isValid(id)) return null;
		const doc = await this.collection.findOne({ _id: new ObjectId(id) });
		return doc as Notification | null;
	}

	async create(data: CreateNotificationDTO): Promise<Notification> {
		const notification: Omit<Notification, "_id"> = {
			userId: data.userId,
			type: data.type,
			channel: data.channel || "inapp",
			message: data.message,
			isRead: false,
			sentAt: data.channel !== "inapp" ? new Date() : undefined,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const result = await this.collection.insertOne(
			notification as Record<string, unknown>,
		);
		return { _id: result.insertedId.toString(), ...notification };
	}

	async update(
		id: string,
		data: UpdateNotificationDTO,
	): Promise<Notification | null> {
		if (!ObjectId.isValid(id)) return null;
		const updateData: Record<string, unknown> = {
			...data,
			updatedAt: new Date(),
		};
		const result = await this.collection.findOneAndUpdate(
			{ _id: new ObjectId(id) },
			{ $set: updateData },
			{ returnDocument: "after" },
		);
		return result as Notification | null;
	}

	async markAsRead(id: string): Promise<Notification | null> {
		if (!ObjectId.isValid(id)) return null;
		const result = await this.collection.findOneAndUpdate(
			{ _id: new ObjectId(id) },
			{ $set: { isRead: true, updatedAt: new Date() } },
			{ returnDocument: "after" },
		);
		return result as Notification | null;
	}

	async markAllAsRead(userId: string): Promise<number> {
		const result = await this.collection.updateMany(
			{ userId, isRead: false },
			{ $set: { isRead: true, updatedAt: new Date() } },
		);
		return result.modifiedCount;
	}

	async delete(id: string): Promise<boolean> {
		if (!ObjectId.isValid(id)) return false;
		const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
		return result.deletedCount > 0;
	}

	async getUnreadCount(userId: string): Promise<number> {
		return this.collection.countDocuments({ userId, isRead: false });
	}

	/**
	 * Populate user info (fullName, email, avatar)
	 */
	private async populateUserInfo(
		notifications: Notification[],
	): Promise<NotificationWithUser[]> {
		if (notifications.length === 0) return [];

		const userIds = [
			...new Set(
				notifications.map((n) => n.userId).filter((id) => ObjectId.isValid(id)),
			),
		];

		const users =
			userIds.length > 0
				? await this.db
					.collection("users")
					.find({ _id: { $in: userIds } })
					.project({ _id: 1, fullName: 1, email: 1, avatar: 1 })
					.toArray()
				: [];

		const userMap = new Map<string, UserInfo>(
			users.map((u) => [
				u._id.toString(),
				{
					_id: u._id.toString(),
					fullName:
						(u.fullName as string) || (u.username as string) || "Unknown",
					email: (u.email as string) || "",
					avatarUrl: u.avatar as string | undefined,
				},
			]),
		);

		return notifications.map((n) => ({
			...n,
			createdAt:
				n.createdAt instanceof Date ? n.createdAt.toISOString() : n.createdAt,
			updatedAt:
				n.updatedAt instanceof Date ? n.updatedAt.toISOString() : n.updatedAt,
			sentAt:
				n.sentAt instanceof Date ? n.sentAt.toISOString() : (n.sentAt ?? null),
			userId: userMap.get(n.userId) || {
				_id: n.userId,
				fullName: "Unknown",
				email: "",
			},
		})) as NotificationWithUser[];
	}
}

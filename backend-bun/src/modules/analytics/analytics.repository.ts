import { ObjectId, type WithId } from "mongodb";
import mongoose from "mongoose";
import type {
    AnalyticsRecord,
    AnalyticsSummary,
    AnalyticsWithRelations,
    AnalyticsFilters,
    PaginatedAnalytics,
} from "./analytics.types";
import type { UpdateAnalyticsRequest } from "./analytics.schema";

const COLLECTION = "analytics";

export class AnalyticsRepository {
    private get db() {
        // biome-ignore lint/style/noNonNullAssertion: Required by mongoose
        return mongoose.connection.db!;
    }

    private get collection() {
        return this.db.collection(COLLECTION);
    }

    async findAll(
        filters?: AnalyticsFilters,
        page = 1,
        limit = 15,
    ): Promise<PaginatedAnalytics> {
        const query: Record<string, unknown> = {};

        if (filters?.appId && ObjectId.isValid(filters.appId)) {
            query.appId = new ObjectId(filters.appId);
        }

        if (filters?.startDate || filters?.endDate) {
            const dateFilter: { $gte?: string; $lte?: string } = {};
            if (filters.startDate) {
                dateFilter.$gte = filters.startDate;
            }
            if (filters.endDate) {
                dateFilter.$lte = filters.endDate;
            }
            query.date = dateFilter;
        }

        const skip = (page - 1) * limit;
        const [docs, totalDocs] = await Promise.all([
            this.collection
                .find(query)
                .sort({ date: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .toArray(),
            this.collection.countDocuments(query),
        ]);

        const records = await this.populateRelations(
            docs as unknown as WithId<AnalyticsRecord>[],
        );

        return {
            docs: records,
            totalDocs,
            limit,
            totalPages: Math.ceil(totalDocs / limit),
            page,
        };
    }

    async findSummaryByAppId(appId: string): Promise<AnalyticsSummary | null> {
        if (!ObjectId.isValid(appId)) return null;

        const pipeline = [
            { $match: { appId: new ObjectId(appId) } },
            {
                $group: {
                    _id: "$appId",
                    totalViews: { $sum: "$views" },
                    totalDownloads: { $sum: "$downloads" },
                    totalInstalls: { $sum: "$installs" },
                    avgActiveUsers: { $avg: "$activeUsers" },
                    avgRating: { $avg: "$ratingAverage" },
                    totalCrashes: { $sum: "$crashCount" },
                    recordCount: { $sum: 1 },
                },
            },
        ];

        const [summary] = await this.collection.aggregate(pipeline).toArray();

        if (!summary) return null;

        // Fetch app details
        const appDoc = await this.db
            .collection("apps")
            .findOne({ _id: new ObjectId(appId) });

        return {
            appId,
            appName: appDoc?.name || "Unknown App",
            totalViews: summary.totalViews || 0,
            totalDownloads: summary.totalDownloads || 0,
            totalInstalls: summary.totalInstalls || 0,
            avgActiveUsers: Math.round(summary.avgActiveUsers || 0),
            avgRating: summary.avgRating || 0,
            totalCrashes: summary.totalCrashes || 0,
            recordCount: summary.recordCount || 0,
        };
    }

    async findById(id: string): Promise<AnalyticsWithRelations | null> {
        if (!ObjectId.isValid(id)) return null;
        const doc = await this.collection.findOne({ _id: new ObjectId(id) });
        if (!doc) return null;

        const [record] = await this.populateRelations([
            doc as unknown as WithId<AnalyticsRecord>,
        ]);
        return record ?? null;
    }

    async update(
        id: string,
        data: UpdateAnalyticsRequest,
    ): Promise<AnalyticsRecord | null> {
        const updateData: Record<string, unknown> = {
            ...data,
            updatedAt: new Date(),
        };

        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: "after" },
        );

        return result ? (result as unknown as AnalyticsRecord) : null;
    }

    async delete(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) return false;
        const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }

    private async populateRelations(
        records: WithId<AnalyticsRecord>[],
    ): Promise<AnalyticsWithRelations[]> {
        if (records.length === 0) return [];

        const appIds = [
            ...new Set(
                records.map((r) => r.appId).filter((id) => ObjectId.isValid(id as unknown as string)), // appId is a string or ObjectId depending on driver return type
            ),
        ].map((id) => new ObjectId(id));

        const apps =
            appIds.length > 0
                ? await this.db
                    .collection("apps")
                    .find({ _id: { $in: appIds } })
                    .project({ _id: 1, name: 1, iconUrl: 1 })
                    .toArray()
                : [];

        const appsMap = new Map();
        apps.forEach((a) => {
            appsMap.set(a._id.toString(), a);
        });

        return records.map((record) => {
            const recordAppIdStr = record.appId.toString();
            const app = appsMap.get(recordAppIdStr);

            return {
                _id: record._id.toString(),
                date: record.date,
                views: record.views || 0,
                downloads: record.downloads || 0,
                installs: record.installs || 0,
                activeUsers: record.activeUsers || 0,
                ratingAverage: record.ratingAverage || 0,
                crashCount: record.crashCount || 0,
                createdAt:
                    record.createdAt instanceof Date
                        ? record.createdAt.toISOString()
                        : String(record.createdAt),
                updatedAt:
                    record.updatedAt instanceof Date
                        ? record.updatedAt.toISOString()
                        : String(record.updatedAt),
                appId: app
                    ? {
                        _id: app._id.toString(),
                        name: app.name,
                        iconUrl: app.iconUrl,
                    }
                    : {
                        _id: recordAppIdStr,
                        name: "Unknown App",
                    },
            } as AnalyticsWithRelations;
        });
    }
}

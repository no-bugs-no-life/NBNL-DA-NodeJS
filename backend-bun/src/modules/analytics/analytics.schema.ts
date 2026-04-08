import { z } from "zod";

export const AnalyticsQuerySchema = z.object({
    page: z.string().regex(/^\d+$/).optional().default("1").transform(Number),
    limit: z.string().regex(/^\d+$/).optional().default("15").transform(Number),
    appId: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

export const UpdateAnalyticsSchema = z.object({
    views: z.number().int().min(0).optional(),
    downloads: z.number().int().min(0).optional(),
    installs: z.number().int().min(0).optional(),
    activeUsers: z.number().int().min(0).optional(),
    ratingAverage: z.number().min(0).max(5).optional(),
    crashCount: z.number().int().min(0).optional(),
});

export type AnalyticsQuery = z.infer<typeof AnalyticsQuerySchema>;
export type UpdateAnalyticsRequest = z.infer<typeof UpdateAnalyticsSchema>;

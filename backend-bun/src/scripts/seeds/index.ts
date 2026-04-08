import { connectDB, closeDatabase, mongoose } from "../../infra/db/connection";
import { seedUsersCollection } from "./seedUsers";
import { seedDevelopersCollection } from "./seedDevelopers";
import { seedCategoriesCollection } from "./seedCategory";
import { seedTagsCollection } from "./seedTags";
import { seedAppsCollection } from "./seedApps";
import { seedSubPackagesCollection } from "./seedSubPackages";
import { seedVersionsCollection } from "./seedVersions";
import { seedReviewsCollection } from "./seedReviews";
import { seedSubscriptionsCollection } from "./seedSubscriptions";
import { seedWishlistsCollection } from "./seedWishlists";
import { seedNotificationsCollection } from "./seedNotifications";
import { seedAnalyticsCollection } from "./seedAnalytics";
import { seedOrdersCollection } from "./seedOrders";
import { seedReportsCollection } from "./seedReports";

const runSeed = async () => {
    try {
        console.log("🌱 Starting Database Seed...");
        await connectDB();

        // Đợi mongoose kết nối db thành công để tránh lỗi "Database not connected"
        while (!mongoose.connection.db) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        await seedUsersCollection();
        await seedDevelopersCollection();
        await seedCategoriesCollection();
        await seedTagsCollection();
        await seedAppsCollection();
        await seedSubPackagesCollection();
        await seedVersionsCollection();
        await seedReviewsCollection();
        await seedSubscriptionsCollection();
        await seedWishlistsCollection();
        await seedNotificationsCollection();
        await seedAnalyticsCollection();
        await seedOrdersCollection();
        await seedReportsCollection();

        console.log("✅ All seeds completed successfully!");
    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exitCode = 1;
    } finally {
        await closeDatabase();
    }
};

runSeed();

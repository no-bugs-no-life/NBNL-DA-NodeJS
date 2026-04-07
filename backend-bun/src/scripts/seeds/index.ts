import { connectDB, closeDatabase, mongoose } from "../../infra/db/connection";
import { seedAdmin } from "./seedAdmin";
import { seedCategory } from "./seedCategory";
import { seedTags } from "./seedTags";
import { seedApps } from "./seedApps";
import { seedSubPackages } from "./seedSubPackages";

const runSeed = async () => {
    try {
        console.log("🌱 Starting Database Seed...");
        await connectDB();

        // Đợi mongoose kết nối db thành công để tránh lỗi "Database not connected"
        while (!mongoose.connection.db) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        await seedAdmin();
        await seedCategory();
        await seedTags();
        await seedApps();
        await seedSubPackages();

        console.log("✅ All seeds completed successfully!");
    } catch (error) {
        console.error("❌ Seed failed:", error);
    } finally {
        await closeDatabase();
        process.exit(0);
    }
};

runSeed();

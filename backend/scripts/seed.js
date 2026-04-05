/**
 * Master Seed script - Runner cho tat ca cac file seed
 * Run: node scripts/seed.js
 */
const mongoose = require('mongoose');

// Bắt buộc khởi tạo các file Schema trước khi chạy seed()
require('../schemas/roles');
require('../schemas/users');
require('../schemas/categories');
require('../schemas/tags');
require('../schemas/apps');
require('../schemas/products');
require('../schemas/analytics');
require('../schemas/cart');
require('../schemas/coupons');
require('../schemas/developers');
require('../schemas/files');
require('../schemas/reports');
require('../schemas/subPackages');
require('../schemas/subscriptions');
require('../schemas/wishlists');

// Import sub-seeders
const seedUser = require('./seedUser');
const seedCategories = require('./seedCategories');
const seedApps = require('./seedApps');
const seedGames = require('./seedGames');
const seedProducts = require('./seedProducts');
const seedReviews = require('./seedReviews');

const seedDevelopers = require('./seedDevelopers');
const seedWishlists = require('./seedWishlists');
const seedAnalytics = require('./seedAnalytics');
const seedCart = require('./seedCart');
const seedFiles = require('./seedFiles');
const seedCoupons = require('./seedCoupons');
const seedSubPackages = require('./seedSubPackages');
const seedSubscriptions = require('./seedSubscriptions');
const seedReports = require('./seedReports');

async function mainSeed() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/NNPTUD-C2');
        console.log('✅ Connected to MongoDB (Master Seeder)');

        console.log('\n--- Running Sub-Seeders ---');

        await seedUser();
        // Create developer profile for users
        await seedDevelopers();

        await seedCategories();
        await seedApps();
        await seedGames();
        await seedProducts();
        await seedReviews();

        // New module seeds
        await seedWishlists();
        await seedAnalytics();
        await seedCart();
        await seedFiles();
        await seedCoupons();
        await seedSubPackages();
        await seedSubscriptions();
        await seedReports();

        console.log('---------------------------\n');

        console.log('🎉 All Seeding Tasks Completed!');
        console.log('\nDefault accounts:');
        console.log('  ADMIN     - admin / Admin@123');
        console.log('  MODERATOR - moderator / Mod@123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Master Seed failed:', error.message);
        process.exit(1);
    }
}

mainSeed();

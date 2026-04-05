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

// Import sub-seeders
const seedUser = require('./seedUser');
const seedHome = require('./seedHome');
const seedTags = require('./seedTags');

async function mainSeed() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/NNPTUD-C2');
        console.log('✅ Connected to MongoDB (Master Seeder)');

        console.log('\n--- Running Sub-Seeders ---');

        await seedUser();
        await seedHome();
        await seedTags();

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

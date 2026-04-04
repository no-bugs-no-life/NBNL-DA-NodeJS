/**
 * Seed script - Chay 1 lan de khoi tao roles + users mac dinh
 * Run: node scripts/seed.js
 */
const mongoose = require('mongoose');
require('../schemas/roles');
require('../schemas/users');

let roleModel = mongoose.model('role');
let userModel = mongoose.model('user');

const ROLES = [
    { name: 'ADMIN', description: 'Quan tri he thong' },
    { name: 'MODERATOR', description: 'Kiem duyet noi dung' },
    { name: 'USER', description: 'Nguoi dung thong thuong' }
];

const USERS = [
    {
        username: 'admin',
        password: 'Admin@123',
        email: 'admin@nnptud.com',
        fullName: 'Quan Tri Vien',
        roleName: 'ADMIN'
    },
    {
        username: 'moderator',
        password: 'Mod@123',
        email: 'mod@nnptud.com',
        fullName: 'Nguoi Kiem Duyet',
        roleName: 'MODERATOR'
    }
];

async function seed() {
    try {
        await mongoose.connect('mongodb://localhost:27017/NNPTUD-C2');
        console.log('✅ Connected to MongoDB');

        // === Seed Roles ===
        let roleMap = {};
        for (let roleData of ROLES) {
            let role = await roleModel.findOne({ name: roleData.name, isDeleted: false });
            if (!role) {
                role = new roleModel({ name: roleData.name, description: roleData.description });
                await role.save();
                console.log(`✅ Created role: ${roleData.name}`);
            } else {
                console.log(`⏭️  Role exists: ${roleData.name}`);
            }
            roleMap[roleData.name] = role._id;
        }

        // === Seed Users ===
        for (let userData of USERS) {
            let existing = await userModel.findOne({ username: userData.username, isDeleted: false });
            if (!existing) {
                let newUser = new userModel({
                    username: userData.username,
                    password: userData.password,
                    email: userData.email,
                    fullName: userData.fullName,
                    role: roleMap[userData.roleName],
                    status: true
                });
                await newUser.save();
                console.log(`✅ Created user: ${userData.username} (${userData.roleName})`);
            } else {
                console.log(`⏭️  User exists: ${userData.username}`);
            }
        }

        console.log('\n🎉 Seed completed!');
        console.log('\nDefault accounts:');
        console.log('  ADMIN     - admin / Admin@123');
        console.log('  MODERATOR - moderator / Mod@123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        process.exit(1);
    }
}

seed();

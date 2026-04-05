const mongoose = require('mongoose');
let roleModel = mongoose.model('role');
let userModel = mongoose.model('user');

const ROLES = [
    { name: 'ADMIN', description: 'Quan tri he thong' },
    { name: 'MODERATOR', description: 'Kiem duyet noi dung' },
    { name: 'USER', description: 'Nguoi dung thong thuong' },
    { name: 'DEVELOPER', description: 'Nha phat trien ung dung' }
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
    },
    {
        username: 'system_dev',
        password: 'Dev@123',
        email: 'dev@horizon.com',
        fullName: 'System Developer',
        roleName: 'DEVELOPER'
    }
];

async function seedUser() {
    try {
        console.log("Starting User & Roles Seeding...");
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
        console.log('✅ User & Roles Seeding Completed!');
    } catch (err) {
        console.error('❌ Error during User Seeding: ', err);
        throw err;
    }
}

module.exports = seedUser;

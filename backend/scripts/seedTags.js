// scripts/seedTags.js
// Script để seed dữ liệu tags mẫu vào MongoDB

const mongoose = require('mongoose');
const Tag = require('../schemas/tags');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nbnl';

const tags = [
    { name: 'game' },
    { name: 'productivity' },
    { name: 'education' },
    { name: 'entertainment' },
    { name: 'utility' },
    { name: 'music' },
    { name: 'photo' },
    { name: 'video' },
    { name: 'news' },
    { name: 'finance' }
];

async function seedTags() {
    try {
        await mongoose.connect(MONGO_URI);
        await Tag.deleteMany({}); 
        await Tag.insertMany(tags);
        console.log('Seed tags thành công!');
        process.exit(0);
    } catch (err) {
        console.error('Lỗi seed tags:', err);
        process.exit(1);
    }
}

seedTags();

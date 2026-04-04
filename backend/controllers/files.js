let fileModel = require('../schemas/files');
let fs = require('fs');
let path = require('path');

module.exports = {
    // GET - List files (filter by ownerType/ownerId/fileType)
    getFiles: async function (queries) {
        let { limit = 20, page = 1, ownerType, ownerId, fileType } = queries;
        let filter = { isDeleted: false };
        if (ownerType) filter.ownerType = ownerType;
        if (ownerId) filter.ownerId = ownerId;
        if (fileType) filter.fileType = fileType;

        return await fileModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(parseInt(limit) * (parseInt(page) - 1))
            .limit(parseInt(limit));
    },

    // GET - Get file by ID
    getFileById: async function (id) {
        return await fileModel.findOne({ _id: id, isDeleted: false });
    },

    // POST - Save file metadata after upload
    saveFileMetadata: async function (data) {
        let { ownerType, ownerId, fileType, url, size } = data;

        let newFile = new fileModel({
            ownerType,
            ownerId,
            fileType,
            url,
            size: size || 0
        });
        await newFile.save();
        return newFile;
    },

    // PUT - Update file metadata (ADMIN/MODERATOR or owner)
    updateFile: async function (id, userId, isAdminOrMod, data) {
        let file = await fileModel.findOne({ _id: id, isDeleted: false });
        if (!file) return { error: "File not found", code: 404 };

        // Chi ADMIN/MODERATOR hoac chinh chu moi duoc sua
        if (!isAdminOrMod && file.ownerId.toString() !== userId) {
            return { error: "Ban khong co quyen chinh sua file nay", code: 403 };
        }

        let allowedFields = ['fileType', 'url'];
        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
                file[field] = data[field];
            }
        });
        await file.save();
        return file;
    },

    // DELETE - Soft delete file + remove physical file (ADMIN/MODERATOR or owner)
    deleteFile: async function (id, userId, isAdminOrMod) {
        let file = await fileModel.findOne({ _id: id, isDeleted: false });
        if (!file) return { error: "File not found", code: 404 };

        if (!isAdminOrMod && file.ownerId.toString() !== userId) {
            return { error: "Ban khong co quyen xoa file nay", code: 403 };
        }

        // Xoa file vat ly
        let filePath = path.join(__dirname, '../', file.url);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        file.isDeleted = true;
        await file.save();
        return { message: "File da duoc xoa" };
    }
};

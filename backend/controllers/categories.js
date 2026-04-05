let categoryModel = require('../schemas/categories');

module.exports = {
    getAllCategories: async function (queries = {}) {
        let { page = 1, limit = 20 } = queries;
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            populate: 'parentId'
        };
        return await categoryModel.paginate({ isDeleted: false }, options);
    },
    getCategoryById: async function (id) {
        return await categoryModel.findOne({ _id: id, isDeleted: false }).populate('parentId');
    },
    createCategory: async function (name, parentId, iconUrl) {
        let newCategory = new categoryModel({
            name: name,
            parentId: parentId || null,
            iconUrl: iconUrl || ""
        });
        await newCategory.save();
        return newCategory;
    },
    updateCategory: async function (id, data) {
        let category = await categoryModel.findOne({ _id: id, isDeleted: false });
        if (!category) return null;
        if (data.name !== undefined) category.name = data.name;
        if (data.parentId !== undefined) category.parentId = data.parentId;
        if (data.iconUrl !== undefined) category.iconUrl = data.iconUrl;
        await category.save();
        return category;
    },
    deleteCategory: async function (id) {
        let category = await categoryModel.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );
        return category;
    }
};

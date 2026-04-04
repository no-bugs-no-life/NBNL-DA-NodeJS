let categoryModel = require('../schemas/categories');

module.exports = {
    getAllCategories: async function () {
        return await categoryModel.find({ isDeleted: false }).populate('parentId');
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

let inventoryModel = require('../schemas/inventories');

module.exports = {
    getAllInventories: async function () {
        return await inventoryModel.find()
            .populate({ path: 'product', select: 'title price' });
    },

    getInventoryByProduct: async function (productId) {
        return await inventoryModel.findOne({ product: productId })
            .populate({ path: 'product', select: 'title price' });
    },

    increaseStock: async function (productId, quantity) {
        let inventory = await inventoryModel.findOne({ product: productId });
        if (!inventory) return null;
        inventory.stock += quantity;
        await inventory.save();
        return inventory;
    },

    decreaseStock: async function (productId, quantity) {
        let inventory = await inventoryModel.findOne({ product: productId });
        if (!inventory) return null;
        if (inventory.stock < quantity) return { error: "Khong du so luong" };
        inventory.stock -= quantity;
        await inventory.save();
        return inventory;
    }
};
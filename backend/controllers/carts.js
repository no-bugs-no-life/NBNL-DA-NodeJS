let cartModel = require('../schemas/cart');
let appModel = require('../schemas/apps');

module.exports = {
    // GET - Lay gio hang cua user (populate app details)
    getCart: async function (userId) {
        let cart = await cartModel.findOne({ user: userId, isDeleted: false })
            .populate({
                path: 'items.appId',
                select: 'name iconUrl price subscriptionPrice'
            });
        return cart || null;
    },

    // POST - Them app vao gio hang
    addItem: async function (userId, data) {
        let { appId, itemType, plan, quantity } = data;
        quantity = quantity || 1;

        // Kiem tra app ton tai
        let app = await appModel.findOne({ _id: appId, isDeleted: false });
        if (!app) return { error: "App not found", code: 404 };

        // Neu la one_time thi gia = price; subscription thi gia = subscriptionPrice
        let priceAtAdd = (itemType === 'subscription') ? (app.subscriptionPrice || 0) : (app.price || 0);
        if (priceAtAdd === 0) {
            return { error: "App nay khong co gia, khong the them vao gio hang", code: 400 };
        }

        // Tim hoac tao gio hang
        let cart = await cartModel.findOne({ user: userId, isDeleted: false });
        if (!cart) {
            cart = new cartModel({ user: userId, items: [] });
        }

        // Kiem tra app da co trong gio hang chua
        let existIndex = cart.items.findIndex(i =>
            i.appId.toString() === appId && i.itemType === (itemType || 'one_time')
        );
        if (existIndex >= 0) {
            return { error: "App nay da co trong gio hang", code: 400 };
        }

        cart.items.push({
            appId,
            itemType: itemType || 'one_time',
            plan: plan || null,
            quantity,
            priceAtAdd
        });
        await cart.save();
        await cart.populate({
            path: 'items.appId',
            select: 'name iconUrl price subscriptionPrice'
        });
        return cart;
    },

    // PUT - Cap nhat so luong item trong gio hang
    updateItem: async function (userId, appId, data) {
        let cart = await cartModel.findOne({ user: userId, isDeleted: false });
        if (!cart) return { error: "Cart not found", code: 404 };

        let index = cart.items.findIndex(i => i.appId.toString() === appId);
        if (index < 0) return { error: "Item not found in cart", code: 404 };

        let item = cart.items[index];

        // Cho phep cap nhat quantity hoac plan (doi subscription)
        if (data.quantity !== undefined) {
            if (data.quantity < 1) {
                cart.items.splice(index, 1); // Xoa neu quantity < 1
            } else {
                item.quantity = data.quantity;
            }
        }

        if (data.plan !== undefined && item.itemType === 'subscription') {
            // Tinh lai gia neu doi plan
            let app = await appModel.findOne({ _id: appId, isDeleted: false });
            if (!app) return { error: "App not found", code: 404 };
            item.plan = data.plan;
            item.priceAtAdd = app.subscriptionPrice || 0;
        }

        await cart.save();
        await cart.populate({
            path: 'items.appId',
            select: 'name iconUrl price subscriptionPrice'
        });
        return cart;
    },

    // DELETE - Xoa 1 item khoi gio hang
    removeItem: async function (userId, appId) {
        let cart = await cartModel.findOne({ user: userId, isDeleted: false });
        if (!cart) return { error: "Cart not found", code: 404 };

        let before = cart.items.length;
        cart.items = cart.items.filter(i => i.appId.toString() !== appId);

        if (cart.items.length === before) {
            return { error: "Item not found in cart", code: 404 };
        }

        await cart.save();
        await cart.populate({
            path: 'items.appId',
            select: 'name iconUrl price subscriptionPrice'
        });
        return cart;
    },

    // DELETE - Xoa toan bo gio hang
    clearCart: async function (userId) {
        let cart = await cartModel.findOne({ user: userId, isDeleted: false });
        if (!cart) return null;
        cart.items = [];
        await cart.save();
        return cart;
    }
};

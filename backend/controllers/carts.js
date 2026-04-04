let cartModel = require('../schemas/cart');

module.exports = {
    getCart: async function (userId) {
        let cart = await cartModel.findOne({ user: userId });
        return cart ? cart.items : [];
    },

    addItem: async function (userId, productId, quantity) {
        let cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            cart = new cartModel({ user: userId, items: [] });
        }

        let index = cart.items.findIndex(e => e.product.toString() === productId);
        if (index < 0) {
            cart.items.push({ product: productId, quantity });
        } else {
            cart.items[index].quantity += quantity;
        }
        await cart.save();
        return cart;
    },

    decreaseItem: async function (userId, productId, quantity) {
        let cart = await cartModel.findOne({ user: userId });
        if (!cart) return null;

        let index = cart.items.findIndex(e => e.product.toString() === productId);
        if (index < 0) return cart;

        if (cart.items[index].quantity > quantity) {
            cart.items[index].quantity -= quantity;
        } else {
            cart.items.splice(index, 1);
        }
        await cart.save();
        return cart;
    },

    clearCart: async function (userId) {
        let cart = await cartModel.findOne({ user: userId });
        if (!cart) return null;
        cart.items = [];
        await cart.save();
        return cart;
    }
};

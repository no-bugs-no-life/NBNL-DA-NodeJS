const mongoose = require("mongoose");
const Cart = require("../schemas/cart");
const User = require("../schemas/users");
const App = require("../schemas/apps");

async function seedCart() {
    try {
        console.log("Starting Carts Seeding...");

        const normalUser = await User.findOne({ username: "user" });
        const apps = await App.find().limit(2);

        if (!normalUser || apps.length === 0) {
            console.log("⚠️ user or apps not found. Skipping cart seeding.");
            return;
        }

        const items = apps.map(app => ({
            appId: app._id,
            itemType: 'one_time',
            quantity: 1,
            priceAtAdd: app.price || 0
        }));

        let cart = await Cart.findOne({ user: normalUser._id });
        if (!cart) {
            cart = new Cart({ user: normalUser._id, items: [] });
        }

        cart.items = items;
        // totalPrice will be auto-calculated due to pre('save') hook
        await cart.save();

        console.log("✅ Carts seeded successfully.");
    } catch (err) {
        console.error("❌ Error during Carts seeding: ", err);
        throw err;
    }
}

module.exports = seedCart;

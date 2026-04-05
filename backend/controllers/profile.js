const userModel = require('../schemas/users');
const paymentModel = require('../schemas/payments');
const reservationModel = require('../schemas/reservations');
const wishlistModel = require('../schemas/wishlists');

module.exports = {
    getProfile: async function (req, res, next) {
        try {
            let userId = req.userId;
            let user = await userModel.findById(userId).populate('role');
            if (!user) return res.status(404).send({ message: "User not found" });

            // Format response to match UserProfile frontend structure
            res.send({
                id: user._id,
                username: user.username,
                email: user.email,
                displayName: user.fullName || user.username,
                joinDate: user.createdAt,
                avatarUrl: user.avatarUrl,
                coverUrl: user.coverUrl,
                level: user.level,
                xp: user.xp,
                maxXp: user.maxXp,
                bio: user.bio,
                loginCount: user.loginCount
            });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    updateSettings: async function (req, res, next) {
        try {
            let userId = req.userId;
            let updatableFields = ["fullName", "avatarUrl", "coverUrl", "bio"];
            let updates = {};
            for (let field of updatableFields) {
                if (req.body[field] !== undefined) {
                    updates[field] = req.body[field];
                }
            }

            let updatedUser = await userModel.findByIdAndUpdate(
                userId,
                { $set: updates },
                { new: true }
            );

            res.send(updatedUser);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    getWishlist: async function (req, res, next) {
        try {
            let userId = req.userId;
            let wishlist = await wishlistModel.findOne({ userId, isDeleted: false }).populate('appIds');
            if (!wishlist) {
                return res.send([]);
            }
            res.send(wishlist.appIds);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    getHistory: async function (req, res, next) {
        try {
            let userId = req.userId;
            let { page = 1, limit = 20 } = req.query || {};
            let options = {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 20,
                sort: { createdAt: -1 },
                populate: {
                    path: 'reservation',
                    populate: {
                        path: 'items.product',
                        model: 'product'
                    }
                }
            };
            let history = await paymentModel.paginate({ user: userId }, options);
            res.send(history);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    getLibrary: async function (req, res, next) {
        try {
            let userId = req.userId;
            // Get all paid reservations
            let reservations = await reservationModel.find({ user: userId, status: "paid" })
                .populate('items.product');

            let libraryMap = new Map();
            for (let resv of reservations) {
                for (let item of resv.items) {
                    if (item.product && item.product._id) {
                        let prodId = item.product._id.toString();
                        if (!libraryMap.has(prodId)) {
                            libraryMap.set(prodId, {
                                id: item.product._id,
                                title: item.product.title,
                                image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : "",
                                playTime: 0, // Fallback placeholder
                                lastPlayed: resv.createdAt,
                                type: (item.product.category || "").toLowerCase() === "app" ? "app" : "game" // Heuristic based on categories
                            });
                        }
                    }
                }
            }

            res.send(Array.from(libraryMap.values()));
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }
}

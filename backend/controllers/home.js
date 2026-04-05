const appModel = require('../schemas/apps');
const productModel = require('../schemas/products');
const categoryModel = require('../schemas/categories');

module.exports = {
    getHomeData: async function (req, res, next) {
        try {
            // Aggregate from real existing schemas
            let trendingApps = await appModel.find({ isDeleted: false, status: "published" }).limit(5).populate('categoryId');
            let bestSellingGames = await productModel.find({ isDeleted: false }).limit(6);
            let collections = await categoryModel.find({ isDeleted: false, parentId: null }).limit(2);

            // In a real scenario, productivity might be queried by a specific category.
            // We just fetch a few more apps as productivity apps here for the demo home page
            let productivityApps = await appModel.find({ isDeleted: false, status: "published" }).sort({ createdAt: -1 }).limit(3);

            // We return the aggregated data. 
            // Hero slides usually come from marketing/frontend config, or can be top 3 products.
            res.send({
                trendingApps,
                bestSellingGames,
                collections,
                productivityApps
            });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }
}

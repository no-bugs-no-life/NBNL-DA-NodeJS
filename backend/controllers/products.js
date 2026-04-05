let productModel = require('../schemas/products');
let inventoryModel = require('../schemas/inventories');
let slugify = require('slugify');
let mongoose = require('mongoose');

module.exports = {
    getAllProducts: async function (queries) {
        let titleQ = queries.title ? queries.title.toLowerCase() : '';
        let maxPrice = queries.maxPrice ? parseFloat(queries.maxPrice) : 1e4;
        let minPrice = queries.minPrice ? parseFloat(queries.minPrice) : 0;
        let limit = queries.limit ? parseInt(queries.limit) : 5;
        let page = queries.page ? parseInt(queries.page) : 1;

        let filter = {
            isDeleted: false,
            price: { $gte: minPrice, $lte: maxPrice }
        };
        if (titleQ) {
            filter.title = { $regex: titleQ, $options: 'i' };
        }

        let options = {
            page: page,
            limit: limit
        };

        return await productModel.paginate(filter, options);
    },

    getProductById: async function (id) {
        return await productModel.findOne({ _id: id, isDeleted: false });
    },

    createProduct: async function (data, session) {
        let newProduct = new productModel({
            title: data.title,
            slug: slugify(data.title, { replacement: '-', remove: undefined, locale: 'vi', trim: true }),
            sku: data.sku || "",
            price: data.price || 0,
            description: data.description || "",
            category: data.category || "",
            images: data.images || "https://niteair.co.uk/wp-content/uploads/2023/08/default-product-image.png"
        });
        await newProduct.save({ session });

        // Tao inventory cung luc
        let newInventory = new inventoryModel({
            product: newProduct._id,
            stock: 100,
            reserved: 0,
            soldCount: 0
        });
        await newInventory.save({ session });

        return newProduct;
    },

    updateProduct: async function (id, data) {
        let product = await productModel.findOne({ _id: id, isDeleted: false });
        if (!product) return null;

        let allowedFields = ['title', 'slug', 'sku', 'price', 'description', 'category', 'images'];
        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
                if (field === 'title' && data.title !== product.title) {
                    product.title = data.title;
                    product.slug = slugify(data.title, { replacement: '-', remove: undefined, locale: 'vi', trim: true });
                } else {
                    product[field] = data[field];
                }
            }
        });
        await product.save();
        return product;
    },

    deleteProduct: async function (id) {
        return await productModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    }
};

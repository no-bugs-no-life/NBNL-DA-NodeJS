let couponModel = require('../schemas/coupons');
let appModel = require('../schemas/apps');

module.exports = {
    // GET - List all coupons (ADMIN/MODERATOR)
    getAllCoupons: async function (queries) {
        let { limit = 20, page = 1, status, appId } = queries;
        let filter = { isDeleted: false };

        if (appId) filter.appIds = appId;

        if (status === 'active') {
            let now = new Date();
            filter.startDate = { $lte: now };
            filter.endDate = { $gte: now };
        } else if (status === 'expired') {
            filter.endDate = { $lt: new Date() };
        }

        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort: { createdAt: -1 },
            populate: { path: 'appIds', select: 'name iconUrl' }
        };

        return await couponModel.paginate(filter, options);
    },

    // GET - Get coupon by code (validate coupon)
    getCouponByCode: async function (code) {
        return await couponModel.findOne({ code: code.toUpperCase(), isDeleted: false })
            .populate('appIds', 'name iconUrl price subscriptionPrice');
    },

    // GET - Get coupon by ID
    getCouponById: async function (id) {
        return await couponModel.findOne({ _id: id, isDeleted: false })
            .populate('appIds', 'name iconUrl');
    },

    // POST - Create coupon (ADMIN/MODERATOR)
    createCoupon: async function (data) {
        let { code, discountType, discountValue, startDate, endDate, usageLimit, appIds } = data;

        // Validate date range
        if (new Date(startDate) > new Date(endDate)) {
            return { error: "startDate phai truoc endDate", code: 400 };
        }

        // Validate percentage
        if (discountType === 'percentage' && (discountValue < 0 || discountValue > 100)) {
            return { error: "percentage phai nam trong khoang 0-100", code: 400 };
        }

        // Kiem tra code da ton tai
        let existing = await couponModel.findOne({ code: code.toUpperCase(), isDeleted: false });
        if (existing) {
            return { error: "Coupon code da ton tai", code: 400 };
        }

        let newCoupon = new couponModel({
            code,
            discountType,
            discountValue,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            usageLimit: usageLimit || 0,
            appIds: appIds || [],
            usedCount: 0
        });
        await newCoupon.save();
        await newCoupon.populate('appIds', 'name iconUrl');
        return newCoupon;
    },

    // PUT - Update coupon (ADMIN/MODERATOR)
    updateCoupon: async function (id, data) {
        let coupon = await couponModel.findOne({ _id: id, isDeleted: false });
        if (!coupon) return { error: "Coupon not found", code: 404 };

        let allowedFields = ['discountType', 'discountValue', 'startDate', 'endDate', 'usageLimit', 'appIds'];
        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
                if (field === 'startDate' || field === 'endDate') {
                    coupon[field] = new Date(data[field]);
                } else if (field === 'appIds') {
                    coupon[field] = data[field];
                } else {
                    coupon[field] = data[field];
                }
            }
        });

        if (coupon.discountType === 'percentage' && (coupon.discountValue < 0 || coupon.discountValue > 100)) {
            return { error: "percentage phai nam trong khoang 0-100", code: 400 };
        }

        await coupon.save();
        await coupon.populate('appIds', 'name iconUrl');
        return coupon;
    },

    // POST - Validate & apply coupon for user (login required)
    applyCoupon: async function (code, userId, appId, cartTotal) {
        let coupon = await couponModel.findOne({ code: code.toUpperCase(), isDeleted: false });
        if (!coupon) return { error: "Coupon not found", code: 404 };

        let now = new Date();

        // Kiem tra han su dung
        if (now < coupon.startDate || now > coupon.endDate) {
            return { error: "Coupon da het han hoac chua kich hoat", code: 400 };
        }

        // Kiem tra usage limit
        if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
            return { error: "Coupon da duoc su dung toi han", code: 400 };
        }

        // Kiem tra appIds - neu co thi chi ap dung cho app cu the
        if (coupon.appIds.length > 0) {
            if (!coupon.appIds.some(id => id._id.toString() === appId)) {
                return { error: "Coupon khong ap dung cho app nay", code: 400 };
            }
        }

        // Tinh discount
        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = Math.round(cartTotal * coupon.discountValue / 100 * 100) / 100;
        } else {
            discountAmount = Math.min(coupon.discountValue, cartTotal);
        }

        return {
            coupon,
            discountAmount,
            finalPrice: Math.round((cartTotal - discountAmount) * 100) / 100
        };
    },

    // DELETE - Soft delete coupon (ADMIN/MODERATOR)
    deleteCoupon: async function (id) {
        let coupon = await couponModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!coupon) return { error: "Coupon not found", code: 404 };
        return coupon;
    }
};

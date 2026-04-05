let subPackageModel = require('../schemas/subPackages');

module.exports = {
    // GET - Lay tat ca packages (co phan trang)
    getAllPackages: async function (queries = {}) {
        let { limit = 20, page = 1, type, isActive } = queries;
        let filter = { isDeleted: false };
        if (type) filter.type = type;
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort: { createdAt: -1 }
        };

        return await subPackageModel.paginate(filter, options);
    },

    // GET - Lay package theo id
    getPackageById: async function (id) {
        return await subPackageModel.findOne({ _id: id, isDeleted: false });
    },

    // POST - Tao package moi
    createPackage: async function (data) {
        let { name, type, price, durationDays, description } = data;

        // Tinh durationDays tu dong neu khong truyen
        if (!durationDays && type) {
            if (type === 'monthly') durationDays = 30;
            else if (type === 'yearly') durationDays = 365;
            else if (type === 'lifetime') durationDays = 0;
        }

        let newPkg = new subPackageModel({
            name,
            type: type || 'monthly',
            price: price || 0,
            durationDays: durationDays ?? 30,
            description: description || "",
            isActive: true
        });
        await newPkg.save();
        return newPkg;
    },

    // PUT - Cap nhat package
    updatePackage: async function (id, data) {
        let pkg = await subPackageModel.findOne({ _id: id, isDeleted: false });
        if (!pkg) return { error: "Package not found", code: 404 };

        if (data.name !== undefined) pkg.name = data.name;
        if (data.type !== undefined) pkg.type = data.type;
        if (data.price !== undefined) pkg.price = data.price;
        if (data.durationDays !== undefined) pkg.durationDays = data.durationDays;
        if (data.description !== undefined) pkg.description = data.description;
        if (data.isActive !== undefined) pkg.isActive = data.isActive;

        await pkg.save();
        return pkg;
    },

    // DELETE - Xoa mem package
    deletePackage: async function (id) {
        let pkg = await subPackageModel.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );
        if (!pkg) return { error: "Package not found", code: 404 };
        return pkg;
    }
};

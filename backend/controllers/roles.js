let roleModel = require('../schemas/roles');

module.exports = {
    getAllRoles: async function (queries = {}) {
        let { page = 1, limit = 20 } = queries;
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20
        };
        return await roleModel.paginate({ isDeleted: false }, options);
    },

    getRoleById: async function (id) {
        return await roleModel.findOne({ _id: id, isDeleted: false });
    },

    createRole: async function (name, description) {
        let newRole = new roleModel({
            name,
            description: description || ""
        });
        await newRole.save();
        return newRole;
    },

    updateRole: async function (id, data) {
        let role = await roleModel.findOne({ _id: id, isDeleted: false });
        if (!role) return null;
        if (data.name !== undefined) role.name = data.name;
        if (data.description !== undefined) role.description = data.description;
        await role.save();
        return role;
    },

    deleteRole: async function (id) {
        return await roleModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    }
};

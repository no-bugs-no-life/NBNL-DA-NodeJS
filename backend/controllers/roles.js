let roleModel = require('../schemas/roles');

module.exports = {
    getAllRoles: async function () {
        return await roleModel.find({ isDeleted: false });
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

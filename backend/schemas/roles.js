const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            default: ""
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const mongoosePaginate = require('mongoose-paginate-v2');
roleSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("role", roleSchema);
const mongoose = require("mongoose");
let bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true
        },

        password: {
            type: String,
            required: [true, "Password is required"]
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
        },

        fullName: {
            type: String,
            default: ""
        },

        avatar: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "file",
            default: null
        },

        status: {
            type: Boolean,
            default: false
        },

        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "role",
            required: true
        },

        cover: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "file",
            default: null
        },

        level: {
            type: Number,
            default: 1
        },

        xp: {
            type: Number,
            default: 0
        },

        maxXp: {
            type: Number,
            default: 1000
        },

        bio: {
            type: String,
            default: ""
        },

        socialLinks: {
            facebook: { type: String, default: "" },
            twitter: { type: String, default: "" },
            github: { type: String, default: "" },
            linkedin: { type: String, default: "" },
            website: { type: String, default: "" }
        },

        coin: {
            type: Number,
            default: 0,
            min: [0, "Coin balance cannot be negative"]
        },

        loginCount: {
            type: Number,
            default: 0,
            min: [0, "Login count cannot be negative"]
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        forgotpasswordToken: String,
        forgotpasswordTokenExp: Date
    },
    {
        timestamps: true
    }
);

userSchema.index({
    username: 1,
    email: 1
})

userSchema.pre('save', function (next) {
    let salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(
        this.password, salt
    )
})

const mongoosePaginate = require('mongoose-paginate-v2');
userSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("user", userSchema);
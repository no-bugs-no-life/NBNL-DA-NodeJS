const mongoose = require('mongoose');

const itemCartSchema = mongoose.Schema({
    appId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'app',
        required: [true, "App ID is required"]
    },
    itemType: {
        type: String,
        enum: ['one_time', 'subscription'],
        default: 'one_time'
    },
    // Dung cho subscription
    plan: {
        type: String,
        enum: ['monthly', 'yearly'],
        default: null
    },
    quantity: {
        type: Number,
        min: 1,
        default: 1
    },
    priceAtAdd: {
        type: Number,
        default: 0
    }
}, { _id: true });

const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        unique: true,
        required: [true, "User ID is required"]
    },
    items: {
        type: [itemCartSchema],
        default: []
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

cartSchema.index({ user: 1 });

// Auto recalculate totalPrice before save
cartSchema.pre('save', function (next) {
    this.totalPrice = this.items.reduce((sum, item) => {
        return sum + (item.priceAtAdd * item.quantity);
    }, 0);
    next();
});

const mongoosePaginate = require('mongoose-paginate-v2');
cartSchema.plugin(mongoosePaginate);
module.exports = new mongoose.model('cart', cartSchema);

'use strict';

const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'discounts'

const discountShema = new Schema({

    discount_name: {
        type: String,
        required: true,
    },
    discount_description: {
        type: String,
        required: true,
    },
    discount_type: {
        type: String,
        // required: true,
        default: 'fixed_amount', // percentage
    },
    discount_value: {
        type: Number,
        required: true,
    }, //10.00 , 10%
    discount_code: {
        type: String,
        required: true
    },
    discount_start_date: {
        type: Date,
        required: true
    },
    discount_end_date: {
        type: Date,
        required: true
    },
    discount_max_uses: {
        type: Number,
        required: true
    },// So luong sua dung discount coupon
    discount_uses_count: {
        type: Number,
        required: true
    },  // so discount da sua dung
    discount_users_used: {
        type: Array,
        default: []
    }, // Ai da sua dung
    discount_max_uses_per_user: {
        type: Number,
        required: true

    }, // So luong cho phep toi da duoc sua dung moi user

    discount_min_oder_value: {
        type: Number,
        required: true,

    },
    discount_shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',

    },
    discount_is_active: {
        type: Boolean,
        // required: true,
        default: false
    },
    discount_applies_to: {
        type: String,
        required: true,
        enum: ['all', 'specific']
    },
    discount_product_ids: {
        type: Array,
        default: []
    } // So san pham duoc ap dung 






}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, apiKeySchema);
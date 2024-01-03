'use strict';
const { Types } = require('mongoose');
const { BadRequestError, NotFoundError } = require('../core/error.response');
const discountModel = require('../models/discount.model');
const discount = require('../models/discount.model');
const { findAllDiscountCodesUnselect, checkDiscountExists, findAllDiscountCodesSelect } = require('../models/repositories/discount.repo');
const { findAllProducts } = require('../models/repositories/product.repo');
const { convertToObjectIdMongodb } = require('../utils');

/*
  Discount Services
   1 - Generate Discount Code [Shop / Admin]
   2 - Get discount amount [User]
   3 - Get all discount codes [User / Shop]
   4 - Verify discount code [User]
   5 - Delete discount Code [Admin / Shop] 
   6 - Cancel discount code [User]
*/

class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, is_active, shopId, users_used,
            min_oder_value, product_ids, applies_to, name,
            description, type, value, max_value, max_uses, uses_count, max_uses_per_user

        } = payload;
        if (new Date() < new Date(start_date) && new Date(end_date) < new Date()) {
            throw new BadRequestError(`Discount code has expired!`);
        }
        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start date must be before end date')
        }

        //Create index for discount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId),

        }).lean()
        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError(`Discount code already exists!`);
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_min_oder_value: min_oder_value || 0,
            discount_max_oder_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_shopId: new Types.ObjectId(shopId),
            discount_max_uses_per_user: max_uses_per_user,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids

        })

        return newDiscount
    }
    static async updateDiscount() {

    }

    /*
     Get all discount available with products
    */

    static async getAllDiscountWithProduct({
        code, shopId, userId, limit, page
    }) {
        console.log('discount_codeeeeeee', code)
        //create index for discount
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId),

        }).lean()

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount not exists!!')
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount
        // const products = {}
        let products
        if (discount_applies_to === 'all') {
            //get all product
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true,

                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']

            })

        }
        if (discount_applies_to === 'specific') {
            //get the prodcut id
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },

                    isPublished: true,

                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']

            })

        }
        return products




    }
    /*
    get all discount code of shop
    */
    static async getAllDiscountCodesByShop({
        limit, page, shopId
    }) {
        const discounts = await findAllDiscountCodesSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true

            },
            select: ['discount_code', 'discount_name', 'discount_type'],
            model: discount

        })

        return discounts
    }

    /*
    Apply Discount code

    */

    static async getDiscountAmount({ codeId, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })
        if (!foundDiscount)
            throw new NotFoundError(`Discount code doesn't exist`)
        const { discount_is_active,
            discount_max_uses,
            discount_min_oder_value,
            discount_start_date,
            discount_end_date,
            discount_users_used,
            discount_max_uses_per_user,
            discount_type,
            discount_value,

        } = foundDiscount

        if (!discount_is_active) {
            throw new NotFoundError(`Discount expired`)
        }
        if (!discount_max_uses)
            throw new NotFoundError(`Discount are out`)
        // if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date))
        //     throw new NotFoundError(`Discount are exprired!`)
        // check xem co set gia tri toi thieu hay khong
        let totalOrder = 0
        if (discount_min_oder_value > 0) {
            // get total go hang
            totalOrder = products.reduce((total, product) => {
                return total + (product.quantity * product.price)
            }, 0)
            if (totalOrder < discount_min_oder_value) {
                throw new NotFoundError(`Minimum order value is ${discount_min_oder_value}`)
            }
        }

        if (discount_max_uses_per_user > 0) {
            const userUsesDiscount = discount_users_used.find(user => user.userId === userId)
            if (!userUsesDiscount) {


            }

        }

        //Check xem discount nay la fixed amout hay la percentage
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount

        }
    }

    static async deleteDiscount({
        shopId,
        codeId
    }) {
        // foundDiscount = ''
        // if (!foundDiscount) {

        // }
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId)

        })
        return deleted
    }

    /*
    Cancel Discount code ()
    
    
    */


    static async cancelDiscount({
        codeId,
        shopId,
        userId,

    }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })
        if (!foundDiscount)
            throw new NotFoundError(`Discount code doesn't exist`)


        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: {
                    userId: userId
                }
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1

            }

        })
        return result
    }




}

module.exports = DiscountService
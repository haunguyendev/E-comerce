'use strict'
const { BadRequestError, NotFoundError } = require('../core/error.response');

const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require('../models/repositories/product.repo');
const { getDiscountAmount } = require('./discount.service');
const { releaseLock, acquireLock } = require('./redis.service');
const order = require('../models/order.model');

class CheckoutService {
    /*
    {
       cartId,
       userId,
       shop_oder_ids:[{
        shopId,
        shop_discount,
        item_product:[
            price:
            quantiy,
            productId,

        ]
       }
           
       ]
    }
    */

    static async checkoutReview({
        cartId,
        userId,
        shop_order_ids,
    }) {
        // Check cartId ton tai khong ?
        const foundCart = await findCartById(cartId);
        if (!foundCart) throw new BadRequestError(`Cart does not exist`);

        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0,
        },
            shop_order_ids_new = []

        // tinh tong tien bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i];
            const checkProductServer = await checkProductByServer(item_products)
            console.log(`checkProductServer::: ${checkProductServer}`)

            if (!checkProductServer[0]) throw new BadRequestError(` Order wrong!!`);
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.price * product.quantity)
            }, 0)

            //tong tien truoc khi xu ly

            checkout_order.totalPrice = +checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }
            // new shop_discounts ton tai > 0, check xem co hop le hay khong
            if (shop_discounts.length > 0) {
                // gia su chi co 1 discount
                // get amount discount
                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })

                // tong cong discount giam gia
                checkout_order.totalDiscount += discount

                // new tien giam gia lon hon 0
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
                // tong thanh toan cuoi cung

                checkout_order.totalCheckout += itemCheckout.priceApplyDiscount

                shop_order_ids_new.push(itemCheckout)


            }


        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order


        }





    }
    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }) {
        const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })

        // check lai mot lan nua xem vuot ton kho hay khong
        // get new Array products

        const products = shop_order_ids_new.flatMap(order => order.item_products)

        console.log(`[1]:`, products)
        const acquireProduct = []
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i];
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireProduct.push(keyLock ? true : false)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }
        // check if  co mot san pham het hang trong kho
        if (acquireProduct.includes(false)) {
            throw new BadRequestError(`Mot so san pham da duoc cap nhat, vui long quay lai gio hang`);
        }
        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new,

        })
        // truong hop : neu insert thanh cong, thi remove product co trong gio hang trong cart
        if (newOrder) {
            //remove product in my cart
        }
        return newOrder


    }
    /*
    1> Query Orders [Users]
    */
    static async getOrdersByUser() {

    }
    /*
    2> Query Order Using Id [Users]
    */
    static async getOneOrderByUser() {

    }
    /*
    3> Cancel Order [Users]
    */
    static async cancelOrderByUser() {

    }
    /*
    4> Update Order Status [Shop| Admin] 
    */
    static async updateOrderStatusByShop() {

    }


    /*
    */




}

module.exports = CheckoutService
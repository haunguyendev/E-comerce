'use strict';

const CartService = require("../services/cart.service")
// const ProductServiceV2 = require("../services/product.service.xxx")
const { SuccessResponse } = require('../core/success.response')

class CartController {
    addToCart = async (req, res, next) => {
        console.log(req.body)
        new SuccessResponse({
            message: 'Successful Add To Cart',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    updateCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful Update Cart',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }
    deleteCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful Delete Cart',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }
    getListCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful Get List Cart',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)
    }
}




module.exports = new CartController()
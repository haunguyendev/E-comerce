'use strict';

const DiscountService = require("../services/discount.service")
// const ProductServiceV2 = require("../services/product.service.xxx")
const { SuccessResponse } = require('../core/success.response')


class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful Code Generations',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)

    }
    getAllDiscountCodes = async (req, res, next) => {

        new SuccessResponse({
            message: 'Successful Code Found',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }
    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful Get Discount Amount',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)

    }
    getAllDiscountCodesWithProduct = async (req, res, next) => {
        // console.log("aaaaaaaaaaaaaaaaaaaa", req.query)
        new SuccessResponse({
            message: 'Successful Get Discount Amount',
            metadata: await DiscountService.getAllDiscountWithProduct({
                ...req.query
            })

        }).send(res)


    }





}

module.exports = new DiscountController()
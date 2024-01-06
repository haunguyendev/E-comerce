'use strict';

const CheckoutService = require("../services/checkout.service")
// const ProductServiceV2 = require("../services/product.service.xxx")
const { SuccessResponse } = require('../core/success.response')

class CheckoutController {
    checkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful Checkout Review',
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    }

}




module.exports = new CheckoutController()
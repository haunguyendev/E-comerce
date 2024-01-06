'use strict'
const express = require('express')
const cartController = require('../../controllers/cart.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const { authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()


router.post('', asyncHandler(cartController.addToCart))
router.delete('', asyncHandler(cartController.deleteCart))
router.post('/update', asyncHandler(cartController.updateCart))
router.get('', asyncHandler(cartController.getListCart))






//////////////////////


module.exports = router
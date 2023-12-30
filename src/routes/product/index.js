'use strict'
const express = require('express')
const productController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const { authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))


//authentication//
router.use(authenticationV2)
router.post('', asyncHandler(productController.createProduct))
router.post('/publish/:id', asyncHandler(productController.publicProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unPublicProductByShop))


router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublicForShop))

//////////////////////


module.exports = router
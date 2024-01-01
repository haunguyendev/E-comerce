'use strict'

const ProductService = require("../services/product.service")
const ProductServiceV2 = require("../services/product.service.xxx")
const { SuccessResponse } = require('../core/success.response')


class ProductController {


    createProduct = async (req, res, next) => {

        // console.log("data1111", await ProductService.createProduct(req.body.product_type, {
        //     ...req.body,
        //     product_shop: req.user.userId,

        // }))

        // new SuccessResponse({
        //     message: 'Create new product successfully!',
        //     metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        //         ...req.body,
        //         product_shop: req.user.userId,

        //     })
        // }).send(res);
        new SuccessResponse({
            message: 'Create new product successfully!',
            metadata: await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId,

            })
        }).send(res);

    }
    //Update product
    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update product successfully!',
            metadata: await ProductServiceV2.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId,

            })
        }).send(res);

    }




    publicProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Published product successfully!',
            metadata: await ProductServiceV2.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId,
            })
        }).send(res);

    }
    unPublicProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Published product successfully!',
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId,
            })
        }).send(res);

    }

    //QUERY//
    /**
     * @desc Get all Drafts for shop
     * @param {Number} limit
     * @param {Number} skip
     * @return {JSON}
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list draft successfully!',
            metadata: await ProductServiceV2.findAllDraftsForShop({

                product_shop: req.user.userId,

            })
        }).send(res);

    }
    getAllPublicForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list getAllPublicForShop successfully!',
            metadata: await ProductServiceV2.findAllPublishForShop({

                product_shop: req.user.userId,

            })
        }).send(res);

    }
    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list getListSearchProduct successfully!',
            metadata: await ProductServiceV2.searchProducts(req.params)
        }).send(res);

    }
    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list getAllPublicForShop successfully!',
            metadata: await ProductServiceV2.findAllProducts(req.query)
        }).send(res);

    }
    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list findProduct successfully!',
            metadata: await ProductServiceV2.findProduct({
                product_id: req.params.product_id
            })
        }).send(res);

    }



    //END QUERY//


}

module.exports = new ProductController()
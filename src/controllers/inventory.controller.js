'use strict';

const InventoryService = require("../services/inventory.service")
// const ProductServiceV2 = require("../services/product.service.xxx")
const { SuccessResponse } = require('../core/success.response')


class InventoryController {
    addStockToInventory = async (req, res, next) => {
        new SuccessResponse({
            message: "Successfully added stock to inventory",
            metadata: await InventoryService.addStockToInventory(req.body)
        }).send(res);
    }





}

module.exports = new InventoryController()
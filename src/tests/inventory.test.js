const redisPubSubService = require('../services/redisPubSub.service')

class inventoryServiceTest {
    constructor() {
        redisPubSubService.subscribe('purchase_events', (channel, message) => {
            inventoryServiceTest.updateInventory(message)

        })

    }

    static updateInventory({ productId, quantity }) {
        console.log(`Updated inventory ${productId} quantity: ${quantity}`);


    }


}

module.exports = new inventoryServiceTest()
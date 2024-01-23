const { json } = require('express');
const redisPubSubService = require('../services/redisPubSub.service')

class inventoryServiceTest {
    constructor() {
        console.log("actionnnnn in inventory service");
        redisPubSubService.subscribe('purchase_events', (channel, message) => {
            console.log(`Received message from channel ${channel}:`, message);

            const messageObject = JSON.parse(message);
            this.updateInventory(messageObject); // Call the method on the instance
        });


    }

    updateInventory({ productId, quantity }) {
        console.log(`Updated inventory ${productId} quantity: ${quantity}`);
    }


}

module.exports = new inventoryServiceTest()
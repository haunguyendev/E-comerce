const amqp = require('amqplib');
const messages = 'New a Product: Title ';

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost');
        const channel = await connection.createChannel();

        const notificationExchange = 'notificationEx'; // notificationEx direct
        const notiQueue = 'notificationQueueProcess'; // assertQueue
        const notificationExchangeDLX = 'notificationExDLX';
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';
        //1.create Exchange
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true,
        })
        //2.Creaet Queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false,// cho phep cac ket noi truy cap vao cung mot luc hang doi,
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX

        })
        //3. bindQueue
        await channel.bindQueue(queueResult.queue, notificationExchange);
        //4. Send message
        const msg = 'A new product';
        console.log(` Producer msg::`, msg);
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: '10000'
        });






        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500)

    } catch (err) {
        console.error(err);
    }
}

runProducer().then(rs => console.log(rs)).catch(console.error);
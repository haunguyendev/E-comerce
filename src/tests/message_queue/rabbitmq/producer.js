const amqp = require('amqplib');
const messages = 'New a Product: Title ';

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost');
        const channel = await connection.createChannel();
        const queueName = 'test-topic'
        await channel.assertExchange(queueName, 'topic', {
            durable: true
        });
        //send message to consumer
        channel.sendToQueue(queueName, Buffer.from(messages))
        console.log(`message sent: `, messages);

    } catch (err) {
        console.error(err);
    }
}

runProducer().catch(console.error);
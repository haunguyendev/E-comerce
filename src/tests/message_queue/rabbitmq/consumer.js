const amqp = require('amqplib');

const runConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost');
        const channel = await connection.createChannel();
        const queueName = 'test-topic';

        // Declare a queue and bind it to the exchange
        const q = await channel.assertQueue(queueName, { durable: true });
        await channel.bindQueue(q.queue, queueName, '');

        // Consume messages from the queue
        channel.consume(q.queue, (message) => {
            console.log(`Received ${message.content.toString()}`);
        }, {
            noAck: true // Acknowledge messages automatically
        });

    } catch (err) {
        console.error(err);
    }
}

runConsumer().catch(console.error);

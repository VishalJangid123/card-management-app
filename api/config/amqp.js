const amqplib = require('amqplib');

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE_NAME = 'paymentStatusQueue';

async function connectToRabbitMQ() {
  try {
    const connection = await amqplib.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true, messageTtl: 5000 });
    return { connection, channel };
  } catch (err) {
    console.error('Error connecting to RabbitMQ:', err);
    throw err;
  }
}

module.exports = { connectToRabbitMQ, QUEUE_NAME };

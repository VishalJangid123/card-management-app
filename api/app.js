const express = require('express');
const bodyParser = require('body-parser');
const Omise = require('omise');
require('dotenv').config();

const { connectToRabbitMQ, QUEUE_NAME } = require('./config/amqp');
const { setupSocketServer, sendPaymentStatusToClient } = require('./services/setupSocketServer');
const publicKey = process.env.OMISE_PUBLIC_KEY;
const secretKey = process.env.OMISE_SECRET_KEY;

const omise = Omise({
  secretKey: secretKey,
});

const app = express();
app.use(bodyParser.json());
const server = require('http').Server(app);
const io = setupSocketServer(server);
const port = 3000;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.post('/create-charge', async (req, res) => {
  const { amount, currency, customer } = req.body;
  if (!amount || !currency || !customer) {
    return res.status(400).send('Missing required fields');
  }

  let paymentStatus = {
    status: 'Started',
    charge: null,
    clientId: customer,
  };

  const { connection, channel } = await connectToRabbitMQ();
  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(paymentStatus)), {
    persistent: true,
  });

  try {
    const charge = await omise.charges.create({
      amount: amount,
      currency: currency,
      customer: customer,
    });
    paymentStatus = {
      status: 'success',
      amount: charge.amount / 100 + ' ' + charge.currency,
      chargeId: charge.id,
      lastDigits: charge.card.last_digits,
      clientId: customer,
    };
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(paymentStatus)), {
      persistent: true,
    });
    res.json({ success: true });
  } catch (error) {
    paymentStatus = {
      status: 'failed',
      error: error,
    };
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(paymentStatus)), {
      persistent: true,
    });
    console.error('Error creating charge:', error);
    res.status(500).send('Error creating charge');
  }
});

async function listenForPaymentStatusUpdates() {
  const { connection, channel } = await connectToRabbitMQ();
  console.log('Listening for payment status updates...');

  channel.consume(QUEUE_NAME, (message) => {
    if (message !== null) {
      const paymentStatus = JSON.parse(message.content.toString());
      console.log('Received payment status update:', paymentStatus);

      // After receiving the payment status, send it to the relevant client via WebSocket
      sendPaymentStatusToClient(io, paymentStatus.clientId, paymentStatus);

      // Acknowledge that the message has been processed
      channel.ack(message);
    }
  });
}

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  listenForPaymentStatusUpdates();
});

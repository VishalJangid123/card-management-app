const express = require('express');
const bodyParser = require('body-parser');
const Omise = require('omise');
require('dotenv').config();

const publicKey = process.env.OMISE_PUBLIC_KEY;
const secretKey = process.env.OMISE_SECRET_KEY;

const omise = Omise({
  secretKey: secretKey,
});

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/create-charge', async (req, res) => {
  const { amount, currency, cardToken, customer } = req.body;
  if (!amount || !currency || !customer) {
    return res.status(400).send('Missing required fields');
  }
  try {
    const charge = await omise.charges.create({
      amount: amount, 
      currency: currency,
      customer: customer
    });
    res.json({ success: true, charge });
  } catch (error) {
    console.error('Error creating charge:', error);
    res.status(500).send('Error creating charge');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

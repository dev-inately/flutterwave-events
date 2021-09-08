require('dotenv/config');
const express = require('express');
const FlutterwaveEvents = require('..');

const flutterwaveEvents = new FlutterwaveEvents(process.env.FLUTTERWAVE_SECRET_HASH);

const app = express();
app.use(express.json());

app.post('/webhook', log, flutterwaveEvents.webhook());

flutterwaveEvents.on('charge.success', (data) => {
  console.log(data);
});

app.listen(3000, () => console.log('App started on port 3000'));

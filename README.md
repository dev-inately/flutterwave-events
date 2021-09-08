# Flutterwave Events
![David](https://img.shields.io/david/dev-inately/flutterwave-events) ![npm bundle size](https://img.shields.io/bundlephobia/min/flutterwave-events) ![NPM](https://img.shields.io/npm/l/flutterwave-events)
>  Express Middleware that helps you to listen to webhook events from Flutterwave easily, without writing much codes

This module helps you listen to [event](https://flutterwave.com/docs/payments/webhooks/#supported-events) from [Flutterwave webhook](https://flutterwave.com) securely while emitting it as a [NodeJS event](https://nodejs.org/api/events.html) which you can listen to easily at any point in your application. It decouples your request handler by emitting the webhook event and returning a response immediately to the caller, so a long-running action won't let the response (which Flutterwave uses to acknowledge your receipt) timeout.

So, Instead of modifying your service that handles the webhook event from your controller, you can just listen to any particular events, and your callback will take care of the rest.

## Installing

Install via npm

```shell
npm install flutterwave-events
```

## Example
This examples shows how you will use it typically in your express app. It doesn't not show you   

```js
require('dotenv/config');
const express = require('express');
const FlutterwaveEvents = require('flutterwave-events');

const flutterwaveEvents = new FlutterwaveEvents(process.env.PAYSTACK_SECRET_KEY);

const app = express();
app.use(express.json());

app.post('/webhook', log, flutterwaveEvents.webhook());

flutterwaveEvents.on('charge.success', (data) => {
  console.log(data);
});
// user.on('body', (x) => console.log(`Yay ${typeof x}`));
app.listen(3000, () => console.log('App started on port 3000'));

```



 ```json
 {
    "status": "fail",
    "message": "Invalid JSON: The server is unable to process your request as it is badly malformed!
 }

 ```


```js

const JSONSyntaxErr =  require('json-syntax-error')
...
const app = express();
...
app.use(express.json());
app.use(JSONSyntaxErr()); // That's all, really!

...
```

You can also pass in your custom response. It can be JSON, HTML, text or any format allowed by express `.send()`

```js
app.use(JSONSyntaxErr({ error: 'Why are you sending a bad json?' })); // Torture their conscience!

```
or

```js
app.use(JSONSyntaxErr('<p>Really? A bad JSON? Really?</p>')); // Wasn't hard, was it?!

```

## Tests

```shell
npm test
```

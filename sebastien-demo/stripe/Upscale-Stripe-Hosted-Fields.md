**Stripe Hosted Fields**

- Should we try continuity order?
- Promotions
- ...

1- Direct payment request
200 OK
POST https://api.stripe.com/v1/payment_intents

Request:
amount=13500&currency=USD

* Fields to be added to update Payment Intent
https://stripe.com/docs/api/payment_intents/create#create_payment_intent-customer

- customer -> where can we get the data from?
- metadata -> KV pair -> could be used to store customer internal Upscale ID  - https://stripe.com/docs/api/metadata
You can specify up to 50 keys, with key names up to 40 characters long and values up to 500 characters long.
- payment_method_types -> default card - make it customizable in JS
- setup_future_usage -> ???
- shipping        -> where can we get the data from?
    .address
    .name
- capture_method -> automatic or manual -> make it configurable? in github we have auto-capture and deferred-capture - should we now create a new Hosted Fields collection with configurable - capture method?

Response sample:
{
    "id": "pi_...",
    "object": "payment_intent",
    "amount": 13500,
    "amount_capturable": 0,
    "amount_received": 0,
    "application": null,
    "application_fee_amount": null,
    "canceled_at": null,
    "cancellation_reason": null,
    "capture_method": "automatic",
    ...
}

200 OK
POST https://sebastien-demo-approuter-caas2-sap-stage.cfapps.us10.hana.ondemand.com/consumer/payment-service/gateway/initiate

Request:
{
    "orderId": "2092581759",
    "resultURL": "https://544e2aaa00f1f6044aaadc8f1c9ba2b7.sebastien-demo.us10.hosting-staging.upscalecommerce.com/en-US/redirect-result/checkout/resume",
    "cancelURL": "https://544e2aaa00f1f6044aaadc8f1c9ba2b7.sebastien-demo.us10.hosting-staging.upscalecommerce.com/en-US/redirect-result/checkout/resume",
    "channel": "BROWSER",
    "browserInfo": {
        "colorDepth": 24,
        "javaEnabled": false,
        "javaScriptEnabled": true,
        "language": "en-US",
        "screenHeight": 1200,
        "screenWidth": 1920,
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36",
        "timezoneOffset": 240,
        "originUrl": "https://544e2aaa00f1f6044aaadc8f1c9ba2b7.sebastien-demo.us10.hosting-staging.upscalecommerce.com"
    }
}

Response: 
HTML from Upscale back-end (stripe JS).


UI Form

-> POST https://sebastien-demo-approuter-caas2-sap-stage.cfapps.us10.hana.ondemand.com/consumer/payment-service/gateway/submit

Stripe API: https://api.stripe.com/v1/payment_intents/${input.additionalData.paymentIntent}/confirm


window.Upscale.payments.submit(submitBody)
-> POST https://sebastien-demo-approuter-caas2-sap-stage.cfapps.us10.hana.ondemand.com/consumer/payment-service/gateway/submit
    {
        additionalData: [{
            {key: "paymentIntent", value: "..."}
        }]
    }

https://api.stripe.com/v1/payment_intents

https://api.stripe.com/v1/payment_intents/${input.additionalData.paymentIntent}/confirm

curl https://api.stripe.com/v1/payment_intents \
  -u ...: \
  -d amount=2000 \
  -d currency=cad \
  -d "payment_method_types[]"=card


# To create a PaymentIntent for confirmation, see our guide at: https://stripe.com/docs/payments/payment-intents/creating-payment-intents#creating-for-automatic

curl https://api.stripe.com/v1/payment_intents/pi_3JXVOSIgtNFLzkSy0zN48Cuj/confirm \
  -u ...: \
  -d payment_method=pm_card_visa
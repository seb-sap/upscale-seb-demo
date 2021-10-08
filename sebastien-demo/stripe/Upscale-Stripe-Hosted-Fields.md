# Stripe Hosted Fields

## Flow:

1- Hosted fields initialization request:

1st call:
Create customer
POST https://api.stripe.com/v1/customers
    -> Response mapping - Retain: customer -> id

2nd call:
Create new PaymentIntent
POST https://api.stripe.com/v1/payment_intents
    -> Request body: customer -> existing field: Customer (custom field)

2- Payment form configuration scripts
Stripe JS - Stripe Elements

Sequence:
2.1- Init Stripe JS
2.2- List submit button clic:
    -> stripe.retrievePaymentIntent
    -> stripe.createPaymentMethod -> // TODO: create on back-end?
        From back-end, get error:
        ```
        BadRequest: 400 Bad Request: [{ "error": { "code": "parameter_missing", "doc_url": "https://stripe.com/docs/error-codes/parameter-missing", "message": "Missing required param: card.", "param": "card", "type": "invalid_request_error" } } ] 
        ```
    -> stripe.confirmCardPayment
    -> Upscale.payments.submit

## Remaining TODOs

* test multi-browsers
* support for google + apple pay?
* test reauth + settlement, continuity.
* test international cards and postal codes (france, us, canada, etc) & 3DS secure (success & error scenarios) https://stripe.com/docs/testing#regulatory-cards
* localization of pay button? FRENCH
* test order with 2 line items and ship one at a time to check the capture fund is correct
(function () {
    const DEBUG = true;

    const log = (data) => {
        DEBUG && console.log(data);
    }

    // Next steps:
    // More order data in initial request -> metadata POST payment_intent in OPF

    const initStripe = () => {
        const stripe = Stripe('${vars.publickey}', {
            locale: 'en-US', // TODO: get locale from customer and/or order?
        });
        const elements = stripe.elements();
        const style = {
            base: {
                color: "#32325d", // TODO: add variable
            }
        };
        const card = elements.create("card", {
            style: style
        });
        card.mount("#card-element");
        return {
            stripe,
            card
        };
    }

    const getUpscaleOrder = () => {
        return Upscale.payments.global.getOrder([]).then(draftOrder => {
            log('Draft order:');
            log(draftOrder);
            return draftOrder;
        });
    }

    // https://stripe.com/docs/js/payment_intents/confirm_card_payment
    const doSubmit = (stripe, paymentIntentId, paymentMethodId, secret) => {
        stripe.confirmCardPayment(secret, {
            payment_method: paymentMethodId
        }).then((result) => {
            doSubmitBackend(stripe, paymentIntentId, paymentMethodId, secret);
        });
    }

    // FIXME: not used
    const doSubmitBackend = (stripe, paymentIntentId, paymentMethodId, secret) => {
        Upscale.payments.submit({
            'additionalData': [{
                    'key': 'paymentIntent',
                    'value': paymentIntentId
                }, {
                    'key': 'paymentMethod',
                    'value': paymentMethodId
                }
                /*, {
                    'key': 'customer',
                    'value': paymentIntent.customer
                }*/
            ],
            'submitPending': (response) => {
                log('OPF - handling submitPending...');
                log(response);

                /*if (response) {
                    if (response.customFields && response.customFields.length) {
                        if (response.customFields['next_action']) {
                            const nextAction = JSON.parse(response.customFields['next_action']);
                            log('nextAction:');
                            log(nextAction);
                            if (nextAction && nextAction.type === 'redirect_to_url') {
                                window.location = nextAction.redirect_to_url.url;
                            }   
                        }
                    }
                }*/

                /*stripe
                    .handleCardAction(secret)
                    .then(function(result) {
                        // Handle result.error or result.paymentIntent
                        handleError(error);
                        log('stripe handleCardAction successful');
                        log(result);
                    });*/
            }
        });
    }

    const handleError = (error) => {
        let displayError = document.getElementById('card-errors');
        if (error) {
            displayError.textContent = error.message;
            log(error.message);
            Upscale.payments.global.throwPaymentError(); // TODO: add error msg.
            return true;
        } else {
            displayError.textContent = '';
            return false;
        }
    }

    const updatePaymentIntent = (stripe, draftOrder, paymentIntent) => {
        // https://stripe.com/docs/api/payment_intents/create#create_payment_intent-shipping
        let updatedPaymentIntent = paymentIntent;
        updatedPaymentIntent.metadata = {
            customerNumber: draftOrder.customerNumber,
            customerEmail: draftOrder.customerEmail
        }
        updatedPaymentIntent.shipping = {
            address: {
                city: draftOrder.shippingAddress.city,
                country: draftOrder.shippingAddress.country,
                line1: draftOrder.shippingAddress.addressLine1,
                line2: draftOrder.shippingAddress.addressLine2,
                // postal_code: draftOrder.shippingAddress.,
                // state: draftOrder.shippingAddress.
            },
            name: `${draftOrder.shippingAddress.firstName} ${draftOrder.shippingAddress.lastName}`,
        };
        // update payment intent with data from order
        // IntegrationError: You cannot call `stripe.updatePaymentIntent` without supplying an appropriate beta flag when initializing Stripe.js.
        stripe.updatePaymentIntent(updatedPaymentIntent).then(updatedPaymentIntent => {
            log('updatedPaymentIntent:');
            log(updatedPaymentIntent);
        });
    }

    // TODO: add customer to create intent POST request to avoid creating new intent for same orderId?

    const listenOnSubmit = (stripe, card) => {
        const paymentForm = document.getElementById('payment-form');
        paymentForm.addEventListener('submit', function (ev) {
            ev.preventDefault();
            const secret = paymentForm.dataset.secret;
            // https://stripe.com/docs/js/payment_intents/retrieve_payment_intent
            stripe.retrievePaymentIntent(secret).then(function (result) {
                const hasError = handleError(result.error);
                if (hasError) {
                    return;
                }
                const paymentIntent = result.paymentIntent;
                log('paymentIntent id:' + paymentIntent.id);

                getUpscaleOrder().then(draftOrder => {
                    // FIXME: not allowed (beta??)
                    // updatePaymentIntent(stripe, draftOrder, paymentIntent);

                    /*
                    FIXME: should we call createPaymentMethod?
                    From: https://stripe.com/docs/api/payment_methods/create
                    "Instead of creating a PaymentMethod directly, we recommend using the PaymentIntents API to accept a payment immediately or the SetupIntent API to collect payment method details ahead of a future payment."
                    if the payment_method specified, Stripe returns this error:
                    "You cannot confirm this PaymentIntent because it's missing a payment method. You can either update the PaymentIntent with a payment method and then confirm it again, or confirm it again directly with a payment method."
                    See https://dashboard.stripe.com/test/logs/req_sAwRRUXorXDThA
                    payment_method is optional in create intend method: https://stripe.com/docs/api/payment_intents/create#create_payment_intent-payment_method
                    */
                    // Doc: https://stripe.com/docs/js/payment_methods/create_payment_method
                    stripe
                    .createPaymentMethod({ // TODO: create on back-end.
                        type: 'card',
                        card
                    })
                    .then(function (result) {
                        const hasError = handleError(result.error);
                        if (hasError) {
                            return;
                        }
                        log('paymentMethod id:' + result.paymentMethod.id);
                        doSubmit(stripe, paymentIntent.id, result.paymentMethod.id, secret);
                    });
                    
                });
                
            });
    
        });
    }

    const { stripe, card } = initStripe();
    listenOnSubmit(stripe, card);
})();

<form id="payment-form" data-secret="${input.customFields.client_secret}">
  <div id="card-element"></div>
  <div id="card-errors" role="alert"></div>
  <button id="submit">Submit Payment</button>
</form>
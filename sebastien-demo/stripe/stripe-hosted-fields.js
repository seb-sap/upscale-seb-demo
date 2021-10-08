(function (Upscale, Stripe) {
    const DEBUG = true;
    const VERSION = '0.0.1';
    const log = (data) => {
        DEBUG && console.log(data);
    }

    /**
     * Initialize stripe js - using Stripe Elements
     */
    const initStripe = () => {
        log('OPF - Stripe Hosted Fields - OPF script version:' + VERSION + ' - Stripe JS version:' + Stripe.version);
        const stripe = Stripe('${vars.publickey}', {
            locale: 'auto',
        });
        const elements = stripe.elements();
        const style = {
            base: {
                color: "${vars.cardColor}",
            }
        };
        const card = elements.create("card", {
            style
        });
        card.mount("#card-element");
        card.on('change', function(event) {
            handleError(event.error);
        });
        return {
            stripe,
            card
        };
    }

    const toggleLoadIndicator = (showIndicator) => {
        showIndicator ? Upscale.payments.startLoadIndicator(): Upscale.payments.stopLoadIndicator(); 
    }

    /**
     * Confirm card payment, this will confirm the Stripe PaymentIntent with 3DS support.
     * See https://stripe.com/docs/js/payment_intents/confirm_card_payment
     * @param {object} stripe 
     * @param {string} paymentIntentId
     * @param {string} paymentMethodId 
     * @param {string} secret
     */
    const confirmCardPayment = (stripe, paymentIntentId, paymentMethodId, secret) => {
        return stripe.confirmCardPayment(secret, {
            payment_method: paymentMethodId
        }).then((result) => {
            const hasError = handleError(result.error);
            if (hasError) {
                Upscale.payments.global.throwPaymentError();
                toggleLoadIndicator(false);
                return;
            }
            return doSubmit(paymentIntentId, paymentMethodId);
        });
    }

    /**
     * Submit payment to OPF.
     * @param {string} paymentIntentId 
     * @param {string} paymentMethodId 
     */
    const doSubmit = (paymentIntentId, paymentMethodId) => {
        return Upscale.payments.submit({
            'additionalData': [{
                    'key': 'paymentIntent',
                    'value': paymentIntentId
                }, {
                    'key': 'paymentMethod',
                    'value': paymentMethodId
                }
            ]
        });
    }

    const handleError = (error) => {
        let displayError = document.getElementById('card-errors');
        if (error) {
            displayError.textContent = error.message;
            log('Stripe error: ' + error.message);
            return true;
        } else {
            displayError.textContent = '';
            return false;
        }
    }

    const listenOnSubmit = (stripe, card) => {
        const paymentForm = document.getElementById('payment-form');
        paymentForm.addEventListener('submit', function (ev) {
            ev.preventDefault();
            toggleLoadIndicator(true);

            const secret = paymentForm.dataset.secret;
            // https://stripe.com/docs/js/payment_intents/retrieve_payment_intent
            stripe.retrievePaymentIntent(secret).then(function (result) {
                const hasError = handleError(result.error);
                if (hasError) {
                    Upscale.payments.global.throwPaymentError();
                    toggleLoadIndicator(false);
                    return;
                }
                const paymentIntent = result.paymentIntent;
                log('paymentIntent id:' + paymentIntent.id);

                // Doc: https://stripe.com/docs/js/payment_methods/create_payment_method
                stripe.createPaymentMethod({
                    type: 'card',
                    card
                }).then(function (result) {
                    const hasError = handleError(result.error);
                    if (hasError) {
                        Upscale.payments.global.throwPaymentError();
                        toggleLoadIndicator(false);
                        return;
                    }
                    log('paymentMethod id:' + result.paymentMethod.id);
                    confirmCardPayment(stripe, paymentIntent.id, result.paymentMethod.id, secret).then(() => {
                        log('Stripe payment completed');
                    }).catch(() => {
                        log('Error while processing Stripe payment');
                        Upscale.payments.global.throwPaymentError();
                    }).finally(() => {
                        toggleLoadIndicator(false);
                    });
                });
            });

        });
    }

    const {
        stripe,
        card
    } = initStripe();
    listenOnSubmit(stripe, card);
})(window.Upscale, window.Stripe);

<style type="text/css">
    .card-element {
    padding: 10px;
    }
    .pay_button {
        cursor: pointer;
        user-select: none;
        background-color: black;
        border: 0;
        border-radius: 4px;
        color: white;
        font-size: 16px;
        font-family: Roboto;
        padding: 0;
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;  
        appearance: button;
        -webkit-writing-mode: horizontal-tb !important;
        text-rendering: auto;
        letter-spacing: normal;
        word-spacing: normal;
        text-transform: none;
        text-indent: 0px;
        text-shadow: none;
        text-align: center;
        box-sizing: border-box;
        margin: 0em;
    }
</style>

<form id="payment-form" data-secret="${input.customFields.client_secret}">
  <div id="card-element" class="card-element"></div>
  <div id="card-errors" role="alert"></div>
  <button id="submit" class="pay_button" type="submit">Submit Payment</button>
</form>
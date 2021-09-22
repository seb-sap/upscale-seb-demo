# SAP Upscale Commerce - Custom Checkout Native Extension

From Native Extension:
```sh
npm run demo
npm run demo_pack
```

From PWA app - to re-install the Native Extension:
```
rm -rf ./node_modules/demo-checkout && npm cache clear --force && npm i demo-checkout
```

```
-OpenPaymentCheckout
	- CheckoutProcess
		x AlternatePaymentMethodButtonGroup
		x IncentiveMessageListing
		x AttributeSet
	x IncentiveMessageListing
		x GenericImage
	- CheckoutAddressForm
		- FormInputContainer
		- AddressBlock
	- FormInputContainer
	x ExplicitConsent
	x ConsentInput
```

## How to obtain support

[Create an issue](https://github.com/SAP-samples/<repository-name>/issues) in this repository if you find a bug or have questions about the content.
 
For additional support, [ask a question in SAP Community](https://answers.sap.com/questions/ask.html).

## License
Copyright (c) 2021 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSES/Apache-2.0.txt) file.
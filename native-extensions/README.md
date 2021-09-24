# SAP Upscale Commerce - Custom Checkout Native Extension

Search for `// FIXME` in code to see places where code was not fully imported from PWA.
The tsconfig.lib.json - enableIvy must be set to true to be able to run "npm run demo" successfully.

```
strictMetadataEmit is set to false
When set to true, error in CookieStorageService, unable to inject Document Symbol
```

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
To be removed:
- Google + Apple Pay
- APM

CP:
Delivery section:
	User select delivery days
		-> Saved Order AS

```

Components to remove:
```
-OpenPaymentCheckout
	- CheckoutProcess component: can remove coupons - can remove APM - can remove incentive messages - can remove attribute sets
		x AlternatePaymentMethodButtonGroup
		x IncentiveMessageListing (promotions)
		x AttributeSet
		Min/Max validation: keep it
		one-tap-buy-button -> ignore
	x IncentiveMessageListing
		x GenericImage
	- CheckoutAddressForm
		- FormInputContainer
		- AddressBlock
	- FormInputContainer
	x ExplicitConsent -> bring it later afger we have a functioning checkout flow - there is a function in ConsentService so maybe dont keep it. The explicit consent is opt-in config so its set to false then we may not need it.
	x ConsentInput
```

- CP PWA version? Will it be older version of PWA? Angular 12?

Redeploy flow:
1- Download new PWA when update is available
2- Update Native extension locally with same libs versions and deploy the new tarball with bumped version (use semver)
3- Before redeploy in test, update the native extension location so that the build on server can use the newer version (so that CP can use older version if need be).
4- Redeploy PWA in test environment & test the new Native Ext. integration (sanity check)
5- Redeploy to prod.
## How to obtain support

[Create an issue](https://github.com/SAP-samples/<repository-name>/issues) in this repository if you find a bug or have questions about the content.
 
For additional support, [ask a question in SAP Community](https://answers.sap.com/questions/ask.html).

## License
Copyright (c) 2021 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSES/Apache-2.0.txt) file.

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActiveConfiguration, PaymentProvider } from '@caas/service-client-angular';
// import { PaymentConfigurationService } from '@upscale/web-storefront-sdk';
import { concatMap, finalize, map, take, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PaymentConfigurationService } from './core/payment-configuration/payment-configuration.service';
import { ApplicationLoggerService } from './core/application-logger/application-logger.service';
import { ComponentComponent } from './components/component.components';
@Component({
  selector: 'demo-checkout-component',
  templateUrl: "./demo-checkout-native-extension.html",
  styles: [
  ]
})
export class DemoCheckoutNativeExtensionComponent2 extends ComponentComponent implements OnInit, OnDestroy {
  paymentConfigs: Array<ActiveConfiguration> = [];
  loading = true;
  
  constructor(
		private paymentConfigurationService: PaymentConfigurationService,
		private applicationLogger: ApplicationLoggerService,
		// private genericAlertDialog: GenericAlertDialogService, // FIXME
		// private router: LocaleRoutingService
	) {
		super();
		console.log('DemoCheckoutNativeExtensionComponent2::ctor');
		this.paymentConfigurationService
			.getAllPaymentConfigurations()
			.pipe(
				take(1),
				concatMap(configs => {
					if (!configs.length) {
						return this.paymentConfigurationService.manualFetchPaymentConfigs();
					} else {
						return of(configs);
					}
				}),
				map(configs => {
					if (!configs.length) {
						throw new Error('PAYMENT_CONFIGS_EMPTY');
					}

					this.applicationLogger.log({ description: 'Active payment configs', configs });
					const gatewayConfigs: Array<ActiveConfiguration> = [];
					const alernateConfigs: Array<ActiveConfiguration> = [];
					const paymentConfigs: Array<ActiveConfiguration> = [];
					configs.forEach(config => {
						if (config.provider === PaymentProvider.UPSCALE_GATEWAY) {
							gatewayConfigs.push(config);
						} else if (config.provider === PaymentProvider.PAYMENT_METHOD) {
							alernateConfigs.push(config);
						}
					});
					paymentConfigs.push(...gatewayConfigs, ...alernateConfigs);
					if (!paymentConfigs.length) {
						throw new Error('LEGACY_PAYMENTS_NOT_SUPPORTED');
					}
					return paymentConfigs;
				}),
				finalize(() => {
					this.loading = false;
				})
			)
			.subscribe(
				configs => {
					this.paymentConfigs = configs;
				},
				error => {
					// this.genericAlertDialog.createErrorDialog(); // FIXME
					// this.router.navigate([aliasRoute.get(AliasType.CART) ?? '']);
          // this.router.navigate(['cart']); // FIXME?

					if (error?.message === 'PAYMENT_CONFIGS_EMPTY') {
						this.applicationLogger.log('Payment configs empty');
					} else if (error?.message === 'LEGACY_PAYMENTS_NOT_SUPPORTED') {
						this.applicationLogger.log('Legacy payment configuration is not supported');
					} else {
						this.applicationLogger.log({ description: 'Payment config retrieval error', error });
					}
				}
			);
	}

  ngOnInit(): void {
    console.log('DemoCheckoutNativeExtensionComponent2::ngOnInit');

  }

  ngOnDestroy(): void {
    console.log('DemoCheckoutNativeExtensionComponent2::ngOnDestroy');
    
  }

}

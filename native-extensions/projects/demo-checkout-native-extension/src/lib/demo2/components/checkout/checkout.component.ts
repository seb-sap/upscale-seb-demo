import { ActiveConfiguration, AliasType, PaymentProvider } from '@caas/service-client-angular';
import { Component } from '@angular/core';
import { concatMap, finalize, map, take, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ApplicationLoggerService } from '../../core/application-logger/application-logger.service';
// import { GenericAlertDialogService } from './core/generic-alert-dialog/generic-alert-dialog.service';
// import { LocaleRoutingService } from './core/localization';
import { PaymentConfigurationService } from '../../core/payment-configuration/payment-configuration.service';
// import { aliasRoute } from 'app/app-routing/alias-route.const';
import { ComponentComponent } from '../component.components';

@Component({
    selector: 'upscale-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent extends ComponentComponent {
    version = '0.1';
    paymentConfigs: Array<ActiveConfiguration> = [];
    loading = true;

    constructor(
        private paymentConfigurationService: PaymentConfigurationService,
        private applicationLogger: ApplicationLoggerService,
        // private genericAlertDialog: GenericAlertDialogService, // FIXME
        // private router: LocaleRoutingService // FIXME
    ) {
        super();
        console.log('CheckoutComponent::ctor');
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
                    // this.router.navigate(['cart']); // FIXME

                    if (error?.message === 'PAYMENT_CONFIGS_EMPTY') {
                        this.applicationLogger.log('Payment configs empty');
                    } else if (error?.message === 'LEGACY_PAYMENTS_NOT_SUPPORTED') { // FIXME: can be removed?
                        this.applicationLogger.log('Legacy payment configuration is not supported');
                    } else {
                        this.applicationLogger.log({ description: 'Payment config retrieval error', error });
                    }
                }
            );
    }
}

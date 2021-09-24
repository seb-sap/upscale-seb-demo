import { ActiveConfiguration, AliasType, PaymentProvider } from '@caas/service-client-angular';
import { Component } from '@angular/core';
import { concatMap, finalize, map, take, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ApplicationLoggerService } from '../../pwa-shared/application-logger.service';
import { ComponentComponent } from '../component.components';
import { PaymentConfigurationService } from '../../pwa-shared/payment-configuration.service';
import { GenericAlertDialogService } from '../../pwa-shared/generic-alert-dialog.service';
import { LocaleRoutingService } from '../../pwa-shared/locale-routing.service';

@Component({
    selector: 'upscale-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent extends ComponentComponent {
    version = '0.2.0';
    paymentConfigs: Array<ActiveConfiguration> = [];
    loading = true;

    constructor(
        private paymentConfigurationService: PaymentConfigurationService,
        private applicationLogger: ApplicationLoggerService,
        private genericAlertDialog: GenericAlertDialogService,
        private router: LocaleRoutingService,
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
                    this.genericAlertDialog.createErrorDialog();
                    this.router.navigate(['cart']); // FIXME: expose const from PWA

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

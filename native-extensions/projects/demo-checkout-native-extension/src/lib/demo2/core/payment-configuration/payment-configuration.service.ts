import { ActiveConfiguration, PaymentProvider, PaymentService } from '@caas/service-client-angular';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, map, retry, shareReplay, tap } from 'rxjs/operators';

import { AppDataService } from '../app-data';

@Injectable({
	providedIn: 'root',
})
export class PaymentConfigurationService {
	request: Observable<Array<ActiveConfiguration>>;

	appExperienceId: string;

	appDivisionId: string | undefined;

	queryPaymentConfig: Observable<Array<ActiveConfiguration>>;

	constructor(protected paymentService: PaymentService, private appDataService: AppDataService) {
		this.queryPaymentConfig = this.manualFetchPaymentConfigs().pipe(shareReplay(1));
	}

	getAllPaymentConfigurations(): Observable<Array<ActiveConfiguration>> {
		return this.queryPaymentConfig;
	}

	getAlternatePaymentMethodConfig(): Observable<Array<ActiveConfiguration>> {
		return this.queryPaymentConfig.pipe(map(configs => this.getAlternatePaymentMethodConfigs(configs)));
	}

	getGatewayConfig(): Observable<ActiveConfiguration | undefined> {
		return this.queryPaymentConfig.pipe(map(configs => this.getGatewayConfiguration(configs)));
	}

	manualFetchPaymentConfigs(): Observable<Array<ActiveConfiguration>> {
		return this.appDataService.getAppData().pipe(
			tap(ad => {
				this.appExperienceId = ad.experienceId;
				this.appDivisionId = ad.experience.divisionId;
			}),
			concatMap(appData => this.paymentService.getActiveConfigurationV2({ divisionId: appData.experience.divisionId })),
			tap(configs => {
				if (!configs.length) {
					throw new Error('PAYMENT_CONFIGS_EMPTY');
				}
			}),
			retry(2),
			catchError(error => {
				if (error?.message === 'PAYMENT_CONFIGS_EMPTY') {
					return of([]);
				} else {
					return throwError(error);
				}
			})
		);
	}

	private getGatewayConfiguration(configs: Array<ActiveConfiguration>): ActiveConfiguration | undefined {
		// replace 'UPSCALE_GATEWAY' with 'PAYMENT_PROVIDER'
		const gatewayConfig = configs.filter(conf => conf.provider !== PaymentProvider.PAYMENT_METHOD);

		if (gatewayConfig.length) {
			return gatewayConfig[0];
		}

		return;
	}

	private getAlternatePaymentMethodConfigs(configs: Array<ActiveConfiguration>): Array<ActiveConfiguration> {
		return configs.filter(conf => conf.provider === PaymentProvider.PAYMENT_METHOD);
	}
}

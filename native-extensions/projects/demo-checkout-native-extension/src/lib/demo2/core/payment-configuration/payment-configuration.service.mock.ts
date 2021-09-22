/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
import { ActiveConfiguration } from '@caas/service-client-angular';
import { Observable, throwError } from 'rxjs';

export class MockPaymentConfigurationService {
	request: Observable<Array<ActiveConfiguration>>;

	getAllPaymentConfigurations(): Observable<Array<ActiveConfiguration>> {
		return throwError('Please stub');
	}

	getAlternatePaymentMethodConfig(): Observable<Array<ActiveConfiguration>> {
		return throwError('Please stub');
	}

	getGatewayConfig(): Observable<ActiveConfiguration | undefined> {
		return throwError('Please stub');
	}

	manualFetchPaymentConfigs(): Observable<ActiveConfiguration> {
		return throwError('Please stub');
	}
}

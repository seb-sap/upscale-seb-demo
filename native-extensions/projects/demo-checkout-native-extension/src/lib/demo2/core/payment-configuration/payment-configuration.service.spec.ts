/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
import { MockPaymentService, PaymentService } from '@caas/service-client-angular';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AppDataService, MockAppDataService } from '../app-data';
import { PaymentConfigurationService } from './payment-configuration.service';

describe('PaymentConfigurationService', () => {
	let service: PaymentConfigurationService;

	let paymentService: PaymentService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{ provide: PaymentService, useClass: MockPaymentService },
				{ provide: AppDataService, useClass: MockAppDataService },
			],
		});
		paymentService = TestBed.inject(PaymentService);

		spyOn(paymentService, 'getActiveConfigurationV2').and.returnValue(of([]));
		service = TestBed.inject(PaymentConfigurationService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});

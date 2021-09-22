/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
import { TestBed } from '@angular/core/testing';

import { SessionCartService } from './session-cart.service';

describe(SessionCartService.name, () => {
	let service: SessionCartService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(SessionCartService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should set a cart', done => {
		const totallyAnOrder = 'foo';
		let expectationMet = false;

		service.get().subscribe({
			next: order => {
				expect(order).toBe(<any>totallyAnOrder);
				expectationMet = true;
			},
			complete: () => {
				expect(expectationMet).toBe(true);
				done();
			},
		});

		expect(service.getImmediately()).toBeUndefined();
		service.set(<any>totallyAnOrder);
	});
});

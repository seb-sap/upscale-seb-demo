/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

import { TestBed } from '@angular/core/testing';

import { ConsentDecisionService } from './consent-decision.service';

describe('ConsentDecisionService', () => {
	let service: ConsentDecisionService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ConsentDecisionService],
		});
		service = TestBed.inject(ConsentDecisionService);
	});

	it('should create', () => {
		expect(service).toBeDefined();
	});
});

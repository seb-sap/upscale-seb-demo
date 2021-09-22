/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
import { TestBed } from '@angular/core/testing';

import { PlatformContextService } from './platform-context.service';

describe('PlatformContextService', () => {
	let service: PlatformContextService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(PlatformContextService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});

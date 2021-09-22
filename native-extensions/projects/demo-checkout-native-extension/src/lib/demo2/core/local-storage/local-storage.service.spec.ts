/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ɵPLATFORM_BROWSER_ID, ɵPLATFORM_SERVER_ID } from '@angular/common';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
	let service: LocalStorageService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [LocalStorageService, { provide: PLATFORM_ID, useValue: ɵPLATFORM_BROWSER_ID }],
		});

		service = TestBed.inject(LocalStorageService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should be able to cache values', () => {
		service = TestBed.inject(LocalStorageService);
		service.clear();

		service.setItem('key', 'Valuable Value');

		expect(service.getItem('key')).toBe('Valuable Value');

		expect(service.key(0)).toBe('key');

		expect(service.length).toBe(1);

		service.removeItem('key');

		expect(service.getItem('key')).toBe(null);
		expect(service.key(0)).toBe(null);

		expect(service.length).toBe(0);

		service.setItem('key', 'Valuable Value');

		expect(service.getItem('key')).toBe('Valuable Value');

		expect(service.key(0)).toBe('key');

		expect(service.length).toBe(1);

		service.clear();

		expect(service.getItem('key')).toBe(null);
		expect(service.key(0)).toBe(null);

		expect(service.length).toBe(0);
	});
});

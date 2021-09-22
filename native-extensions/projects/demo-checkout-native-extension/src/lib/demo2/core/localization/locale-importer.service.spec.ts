/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

import { TestBed } from '@angular/core/testing';

import { LocaleImporterService } from './locale-importer.service';

describe('LocaleImporterService', () => {
	let service: LocaleImporterService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [LocaleImporterService],
		});

		service = TestBed.inject(LocaleImporterService);
	});

	it('should create', () => {
		expect(service).toBeDefined();
	});
});

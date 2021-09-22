/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
import {
	ConfigurationService,
	LocaleResponse,
	LocaleType,
	MockConfigurationService,
	TypedCurrencyLocale,
} from '@caas/service-client-angular';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { LocalStorageService } from '../local-storage';
import { MockLocalStorageService } from '../local-storage/mock';
import { createMockAppBundleServiceProvider } from '../app-data/app-bundle/app-bundle.service.mock';

import { LocaleImporterService } from './locale-importer.service';
import { LocaleService } from './locale.service';
import { MockLocaleImporterService } from './locale-importer.service.mock';

describe('LocaleService', () => {
	let service: LocaleService;

	let localeImporterService: LocaleImporterService;
	let configurationService: ConfigurationService;
	let localStorageService: LocalStorageService;

	const mockLocaleResponse: LocaleResponse<TypedCurrencyLocale> = {
		editable: true,
		locales: [
			{
				country: 'IT',
				currency: 'EUR',
				language: 'it',
				type: LocaleType.Currency,
			},
			{
				country: 'DE',
				language: 'de',
				type: LocaleType.Language,
				defaultFlag: true,
			},
		],
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				LocaleService,
				createMockAppBundleServiceProvider(),
				{ provide: LocaleImporterService, useClass: MockLocaleImporterService },
				{ provide: ConfigurationService, useClass: MockConfigurationService },
				{ provide: LocalStorageService, useClass: MockLocalStorageService },
			],
		});

		configurationService = TestBed.inject(ConfigurationService);

		spyOn(configurationService, 'getLocale').and.returnValue(of(mockLocaleResponse));

		localeImporterService = TestBed.inject(LocaleImporterService);
		localStorageService = TestBed.inject(LocalStorageService);
	});

	it('should create', () => {
		service = TestBed.inject(LocaleService);

		expect(service).toBeDefined();
	});

	describe('getLocaleData()', () => {
		it('should get currency code', done => {
			spyOn(localStorageService, 'getItem').withArgs('locale').and.returnValue('en-US');
			spyOn(localeImporterService, 'loadLocale').and.callThrough();

			service = TestBed.inject(LocaleService);

			service.getCurrencyCode().subscribe(currencyCode => {
				expect(currencyCode).toEqual('EUR');
				done();
			});
		});

		it('should get currency locale id when initial import succeeds', done => {
			spyOn(localStorageService, 'getItem').withArgs('locale').and.returnValue('en-US');
			spyOn(localeImporterService, 'loadLocale').and.callThrough();

			service = TestBed.inject(LocaleService);

			service.getCurrencyLocaleId().subscribe(currencyLocaleId => {
				expect(currencyLocaleId).toEqual('de-DE');
				done();
			});
		});

		it('should get currency locale id when initial import fails', done => {
			spyOn(localStorageService, 'getItem').withArgs('locale').and.returnValue('en-US');
			const handleLocaleImports = (localeString: string) => {
				if (localeString === 'de-DE') {
					return throwError('Import failed');
				} else if (localeString === 'it-IT') {
					return of(localeString);
				} else {
					fail('Should not get any other locale id');
				}
			};

			spyOn(localeImporterService, 'loadLocale').and.callFake(handleLocaleImports);

			service = TestBed.inject(LocaleService);

			service.getCurrencyLocaleId().subscribe(currencyLocaleId => {
				expect(currencyLocaleId).toEqual('it-IT');
				done();
			});
		});

		it('should get currency locale id when initial and fallback import fail', done => {
			spyOn(localStorageService, 'getItem').withArgs('locale').and.returnValue('en-US');
			const handleLocaleImports = (localeString: string) => {
				if (localeString === 'de-DE' || localeString === 'it-IT') {
					return throwError('Import failed');
				} else if (localeString === 'en-US') {
					return of(localeString);
				} else {
					fail('Should not get any other locale id');
				}
			};

			spyOn(localeImporterService, 'loadLocale').and.callFake(handleLocaleImports);

			service = TestBed.inject(LocaleService);

			service.getCurrencyLocaleId().subscribe(currencyLocaleId => {
				expect(currencyLocaleId).toEqual('en-US');
				done();
			});
		});

		it('should get language locale id', done => {
			spyOn(localStorageService, 'getItem').withArgs('locale').and.returnValue('en-US');
			spyOn(localeImporterService, 'loadLocale').and.callThrough();

			service = TestBed.inject(LocaleService);

			service.getLanguageLocaleId().subscribe(languageLocaleId => {
				expect(languageLocaleId).toEqual('de-DE');
				done();
			});
		});

		it('should get default locale if local storage is empty', done => {
			spyOn(localStorageService, 'getItem').withArgs('locale').and.returnValue(null);
			spyOn(localeImporterService, 'loadLocale').and.callThrough();

			const defaultLocale = mockLocaleResponse.locales.find(locale => locale.defaultFlag === true);
			const defaultLocaleString = defaultLocale?.language + '-' + defaultLocale?.country;

			service = TestBed.inject(LocaleService);

			service.getLanguageLocaleId().subscribe(languageLocaleId => {
				expect(languageLocaleId).toEqual(defaultLocaleString);
				done();
			});
		});
	});
});

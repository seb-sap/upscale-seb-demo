/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
import {
	AliasType,
	AttributeService,
	Edition,
	EditionService,
	ErrorSchema,
	Experience,
	GlobalSettingsService,
	IPwaBundleConfiguration,
	InventoryFulfillmentLocation,
	InventoryLocationType,
	InventoryService,
	MockAttributeService,
	MockEditionService,
	MockGlobalSettingsService,
	MockInventoryService,
	MockPaymentProviderService,
	MockPaymentService,
	MockPriceCurrencyService,
	MockTaxService,
	PagedCollection,
	PaymentProviderService,
	PaymentService,
	PriceCurrencyService,
	ShippingService,
	TaxService,
	Template,
	TemplateType,
	UpscaleStylingAttributes,
	VariantAttributeConfig,
} from '@caas/service-client-angular';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';

import { ApplicationConfig } from 'bootstrap/application-configuration.model';

import { AppData } from '../app-data.model';
import { AuthStorageService } from '../auth/auth-storage.service';
import { CookieStorageService } from '../cookie-storage';
import { MockAuthStorageService } from '../auth/auth-storage.service.mock';
import { MockCookieStorageService } from '../cookie-storage/cookie-storage.service.mock';
import { MockSSOService } from '../sso/sso.service.mock';
import { SSOService } from '../sso/sso.service';

import { AppDataService } from './app-data.service';
import { AppHelperService } from './app-helper.service';
import { MockAppHelperService } from './app-helper.service.mock';

describe('AppDataService', () => {
	let service: AppDataService;

	let editionService: EditionService;
	let attributeService: AttributeService;
	let inventoryService: InventoryService;
	let shippingService: ShippingService;
	let globalSettingsService: GlobalSettingsService;
	let appHelperService: AppHelperService;
	let ssoService: SSOService;
	let paymentService: PaymentService;
	let taxService: TaxService;
	let priceCurrencyService: PriceCurrencyService;
	let mockApplicationConfig: ApplicationConfig;

	let mockBundleId: string;

	beforeEach(() => {
		mockBundleId = 'mock-bundle-id';
		const mockShippingService = jasmine.createSpyObj('ShippingService', ['getValidRegions']);
		mockApplicationConfig = {
			API_ROOT: '/mock-api-base',
			BUNDLE_ID: 'mock-bundle-id',
			TENANT_ID: 'mock-tenant-id',
		};

		TestBed.configureTestingModule({
			providers: [
				AppDataService,
				{ provide: EditionService, useClass: MockEditionService },
				{ provide: AttributeService, useClass: MockAttributeService },
				{ provide: InventoryService, useClass: MockInventoryService },
				{ provide: ShippingService, useValue: mockShippingService },
				{ provide: GlobalSettingsService, useClass: MockGlobalSettingsService },
				{ provide: CookieStorageService, useClass: MockCookieStorageService },
				{ provide: AuthStorageService, useClass: MockAuthStorageService },
				{ provide: AppHelperService, useClass: MockAppHelperService },
				{ provide: SSOService, useClass: MockSSOService },
				{ provide: PaymentService, useClass: MockPaymentService },
				{ provide: TaxService, useClass: MockTaxService },
				{ provide: PriceCurrencyService, useClass: MockPriceCurrencyService },
				{ provide: PaymentProviderService, useClass: MockPaymentProviderService },
				{ provide: ApplicationConfig, useValue: mockApplicationConfig },
			],
		});

		attributeService = TestBed.inject(AttributeService);
		editionService = TestBed.inject(EditionService);
		inventoryService = TestBed.inject(InventoryService);
		shippingService = TestBed.inject(ShippingService);
		globalSettingsService = TestBed.inject(GlobalSettingsService);
		appHelperService = TestBed.inject(AppHelperService);
		ssoService = TestBed.inject(SSOService);
		paymentService = TestBed.inject(PaymentService);
		taxService = TestBed.inject(TaxService);
		priceCurrencyService = TestBed.inject(PriceCurrencyService);

		const applicationConfig = TestBed.inject(ApplicationConfig);
		applicationConfig.BUNDLE_ID = mockBundleId;

		service = TestBed.inject(AppDataService);
	});

	it('should create', () => {
		expect(service).toBeDefined();
	});

	describe('getAppData()', () => {
		let bundleConfiguration: IPwaBundleConfiguration;
		let edition: Edition;
		let experience: Experience;
		let stylingAttributes: UpscaleStylingAttributes;
		let templates: Array<Template>;
		let variantAttributeConfig: Array<VariantAttributeConfig<string>>;
		let location: PagedCollection<InventoryFulfillmentLocation>;

		beforeEach(() => {
			bundleConfiguration = {
				editionId: '',
				experienceId: 'mock-experience-id',
				deviceDiscovery: true,
				payMerchants: [
					{
						provider: 'APPLE',
						payMerchantId: 'mock.merchant.pay.id',
						oneTapBuyEnabled: true,
						domainVerificationString: '',
						payMerchantName: '',
					},
				],
			};
			edition = new Edition({ id: 'mock-edition-id' });

			stylingAttributes = {
				brandStyles: {
					backgroundColor: { color: '#FFFFFF', alpha: 'FF' },
					loginRegisterImageUrl: 'https://example.com',
				},
				components: {
					image: {
						contentHeadline: {
							alpha: 'FF',
							color: '#FFFFFF',
							fontSize: 19,
							lineHeight: 19,
							fontFamilyKey: 'Roboto Regular',
						},
					},
				},
				notificationStyles: {
					bannerBackgroundColor: {
						color: '#FFFFFF',
						alpha: 'FF',
					},
				},
				discountStyles: {
					recurrenceFont: {
						alpha: 'FF',
						color: '#000',
						fontFamilyKey: 'ROBOTO_MEDIUM',
					},
				},
			};

			experience = new Experience({
				id: 'experience001',
				stylingAttributes,
			});
			templates = [
				new Template({ id: 'mock-template-id-1', type: TemplateType.BROWSE, aliases: [AliasType.HOME, AliasType.BROWSE] }),
				new Template({ id: 'mock-template-id-2', type: TemplateType.CART, aliases: [AliasType.CART] }),
			];
			variantAttributeConfig = [new VariantAttributeConfig({ attributeKey: 'key', label: 'label', position: 1 })];

			spyOn(editionService, 'getActive').and.returnValue(of(edition));
			spyOn(appHelperService, 'getExperience').and.returnValue(of(experience));

			const spy: jasmine.Spy<() => Observable<IPwaBundleConfiguration>> = spyOn(appHelperService, 'getAppConfiguration');
			spy.and.returnValue(of(bundleConfiguration));

			spyOn(appHelperService, 'getTemplates').and.returnValue(of(templates));
			spyOn(attributeService, 'getVariantAttributes').and.returnValue(of(variantAttributeConfig));

			location = {
				value: [
					{
						id: '',
						active: true,
						address: {
							street: '',
							streetNumber: '',
							line1: '53 State St.',
							line2: '',
							line3: '',
							line4: '',
							city: 'Boston',
							country: 'US',
							state: 'MA',
							zip: '12345',
							phone: '',
						},
						createdAt: '',
						fulfillmentLocationId: '',
						modifiedAt: '',
						name: '',
						type: InventoryLocationType.STORE,
					},
				],
				page: { number: 1, size: 1 },
			};
			spyOn(inventoryService, 'getInventoryLocationsPaged').and.returnValue(of(location));

			spyOn(appHelperService, 'getLocale').and.callThrough();

			spyOn(appHelperService, 'getLanguagePack').and.returnValue(
				of({
					foo: 'foo',
					bar: 'bar',
					replace: <any>(str => str),
				})
			);

			spyOn(priceCurrencyService, 'getPriceCurrency').and.callThrough();

			(<jasmine.Spy>shippingService.getValidRegions).and.returnValue(EMPTY);
		});

		it('should get template data with aliases and components', () => {
			service.getAppData().subscribe();

			expect(appHelperService.getTemplates).toHaveBeenCalledWith(bundleConfiguration.experienceId);
		});

		it('should get the application configuration', () => {
			service.getAppData().subscribe();

			expect(<any>appHelperService.getAppConfiguration).toHaveBeenCalledWith(true); // removing type due to overload
		});

		it('should get the active edition', () => {
			service.getAppData().subscribe();

			expect(editionService.getActive).toHaveBeenCalled();
		});

		it('should get the localization information', () => {
			service.getAppData().subscribe(appData => {
				expect(appData.currencyCode).toEqual('USD');
				expect(appData.currencyLocaleId).toEqual('en-US');
				expect(appData.languageLocaleId).toEqual('en-US');
			});

			expect(appHelperService.getLocale).toHaveBeenCalled();

			expect(priceCurrencyService.getPriceCurrency).toHaveBeenCalled();
		});

		it('should get the Variant Attribute config settings', () => {
			service.getAppData().subscribe();

			expect(attributeService.getVariantAttributes).toHaveBeenCalled();
		});

		it('should return an AppData', done => {
			let actual: AppData;

			service.getAppData().subscribe(appData => (actual = appData));

			expect(actual instanceof AppData).toBe(true);
			expect(actual.editionId).toBe(edition.id);
			expect(actual.deviceDiscovery).toBe(true);
			expect(actual.experienceId).toBe(bundleConfiguration.experienceId);
			expect(actual.templates.all).toBe(templates);

			actual.variantAttributeConfigs.subscribe(config => {
				expect(config).toEqual(variantAttributeConfig);
				done();
			});
		});

		it('should get preview edition id', () => {
			let actual: AppData;

			bundleConfiguration.editionId = 'mock-preview-edition-id';
			service.getAppData().subscribe(appData => (actual = appData));
			expect(actual.editionId).toEqual(bundleConfiguration.editionId);
		});

		it('should get active edition id', () => {
			let actual: AppData;

			bundleConfiguration.editionId = undefined;
			service.getAppData().subscribe(appData => (actual = appData));
			expect(actual.editionId).toEqual(edition.id);
		});

		it('should set applePayEnabled based on application configuration', () => {
			let actual: AppData;

			service.getAppData().subscribe(appData => (actual = appData));

			expect(actual.applePayEnabled).toBe(true);
		});

		it('should fill varaint-attribute position properties that are not provided', done => {
			let actual: AppData;
			const malformedAttributeConfig = [new VariantAttributeConfig({ attributeKey: 'key', label: 'label', position: undefined })];

			(attributeService.getVariantAttributes as jasmine.Spy).and.returnValue(of(malformedAttributeConfig));

			service.getAppData().subscribe(appData => (actual = appData));

			actual.variantAttributeConfigs.subscribe(configs => {
				expect(configs[0].position).toEqual(Number.MAX_SAFE_INTEGER);
				done();
			});
		});

		it('should get the fulfillment location when ID is provided', done => {
			experience.fulfillmentLocationId = 'mock-fulfillment-location-id';

			service.getAppData().subscribe(appData => {
				appData.location.subscribe(response => {
					expect(inventoryService.getInventoryLocationsPaged).toHaveBeenCalledWith(1, 1, {
						fulfillmentLocationIds: ['mock-fulfillment-location-id'],
					});
					expect(response).toBe(location.value[0]);

					done();
				});
			});
		});

		it('should only fetch the fulfillment location once', done => {
			experience.fulfillmentLocationId = 'mock-fulfillment-location-id';

			service.getAppData().subscribe(appData => {
				appData.location.subscribe();
				appData.location.subscribe();
				appData.location.subscribe();

				expect(inventoryService.getInventoryLocationsPaged).toHaveBeenCalledTimes(1);

				done();
			});
		});

		describe('when tax settingns fail', () => {
			beforeEach(() => {
				spyOn(taxService, 'getTaxMerchantConfiguration').and.returnValue(
					throwError(new ErrorSchema({ status: 401, message: 'FORBIDDEN', type: '' }))
				);
			});

			it('should still produce appData', done => {
				service.getAppData().subscribe(
					actual => expect(actual instanceof AppData).toBe(true),
					error => fail('should not fail'),
					done
				);
			});

			it('should default tax visibility to true', done => {
				service.getAppData().subscribe(
					actual => {
						expect(actual.showIncludeTax).toBe(true);
						expect(actual.showTaxSummary).toBe(true);
					},
					error => fail('should not fail'),
					done
				);
			});
		});

		// TODO: Move to AppHelperService.
		xit('should replace strings', done => {
			service.getAppData().subscribe(appData => {
				const { languagePack } = appData;

				expect(languagePack.replace('${1} ${2}', 'foo', 'bar')).toEqual('foo bar');

				expect(languagePack.replace('${1} sells ${2} by the ${3}.', 'She', 'sea shells', 'sea shore')).toEqual(
					'She sells sea shells by the sea shore.'
				);

				done();
			});
		});
	});
});

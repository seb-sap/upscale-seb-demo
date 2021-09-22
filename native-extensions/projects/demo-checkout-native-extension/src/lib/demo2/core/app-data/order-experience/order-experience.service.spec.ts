/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
import { AliasType, ComponentType, TemplateType, createMockExperience, createMockTemplate } from '@caas/service-client-angular';
import { Templates } from '@upscale/web-storefront-sdk';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AppData, toHelpfulLanguagePack } from 'app/core/app-data.model';
import { MockSessionCartService } from 'app/core/session-cart/session-cart.service.mock';
import { MockStyleConfigurationService } from 'app/style-configuration/style-configuration.service.mock';
import { NULL } from 'app/core/util';
import { SessionCartService } from 'app/core/session-cart/session-cart.service';
import { StyleConfigurationService } from 'app/style-configuration/style-configuration.service';

import { OrderExperienceService } from './order-experience.service';

describe('OrderExperienceService', () => {
	let service: OrderExperienceService;

	let sessionCartService: SessionCartService;
	let styleConfigurationService: StyleConfigurationService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{ provide: SessionCartService, useClass: MockSessionCartService },
				{ provide: StyleConfigurationService, useClass: MockStyleConfigurationService },
			],
		});

		sessionCartService = TestBed.inject(SessionCartService);
		styleConfigurationService = TestBed.inject(StyleConfigurationService);

		service = TestBed.inject(OrderExperienceService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('when getting an experience ID', () => {
		it('should get it from the cart', done => {
			spyOn(sessionCartService, 'get').and.returnValue(of(<any>{ experienceId: 'experience001' }));
			spyOn(styleConfigurationService, 'createGlobalStyleSheet').and.stub();

			sessionCartService.get().subscribe(cart => {
				expect(cart.experienceId).toBe('experience001');
				done();
			});
		});

		it('should get nothing', done => {
			spyOn(sessionCartService, 'get').and.returnValue(NULL);
			spyOn(styleConfigurationService, 'createGlobalStyleSheet').and.stub();

			sessionCartService.get().subscribe(experienceId => {
				expect(experienceId).toBeNull();
				done();
			});
		});
	});

	describe('when getting app data', () => {
		it('should modify the given app data', () => {
			spyOn(styleConfigurationService, 'create').and.returnValue(null);
			spyOn(styleConfigurationService, 'createGlobalStyleSheet').and.stub();

			const appData = new AppData();
			appData.templates = new Templates([]);
			appData.experience = createMockExperience('experience001', {
				globalSettings: {
					addAllCollectionItemsButtonText: 'foo',
					addButtonText: 'foo',
					quickBuyButtonText: 'foo',
					dynamicFilterButtonText: 'foo',
					shopCollectionButtonText: 'foo',
					shopCollectionItemsButtonText: 'foo',
					addCollectionItemButtonText: 'foo',
					addPromotionCodeText: 'foo',
					shipmentDeliveryMethodText: 'foo',
					pickupDeliveryMethodText: 'foo',
					buildKitBelowButtonText: 'foo',
					buildKitButtonText: 'foo',
					addKitButtonText: 'foo',
				},
			});
			appData.languagePack = { replace: <any>((str: string) => str) };

			const checkout = createMockTemplate('template001', { type: TemplateType.CHECKOUT, aliases: [AliasType.CHECKOUT] });
			const cart = createMockTemplate('template002', { type: TemplateType.CART, aliases: [AliasType.CART] });

			const experience = createMockExperience('experience002', {
				stylingAttributes: {
					brandStyles: null,
					notificationStyles: null,
					components: {
						[ComponentType.CHECKOUT]: {},
						[ComponentType.CART]: {},
					},
					discountStyles: null,
				},
				globalSettings: {
					addAllCollectionItemsButtonText: 'bar',
					addButtonText: 'bar',
					quickBuyButtonText: 'bar',
					dynamicFilterButtonText: 'bar',
					shopCollectionButtonText: 'bar',
					shopCollectionItemsButtonText: 'bar',
					addCollectionItemButtonText: 'bar',
					addPromotionCodeText: 'bar',
					shipmentDeliveryMethodText: 'bar',
					pickupDeliveryMethodText: 'bar',
					buildKitBelowButtonText: 'bar',
					buildKitButtonText: 'bar',
					addKitButtonText: 'bar',
				},
			});
			const templates = new Templates([checkout, cart]);
			const languagePack = toHelpfulLanguagePack({});

			const newData = service.getAppData(appData, { experience, templates, languagePack });

			expect(newData.templates.byAlias(AliasType.CHECKOUT)).toBe(checkout);
			expect(newData.templates.byAlias(AliasType.CART)).toBe(cart);
		});

		it('should clean up afterwards', () => {
			spyOn(styleConfigurationService, 'create').and.returnValue(<any>'foo');
			spyOn(styleConfigurationService, 'createGlobalStyleSheet').and.stub();
			spyOn(styleConfigurationService, 'remove').and.stub();

			const appData = new AppData();
			appData.templates = new Templates([]);
			appData.experience = createMockExperience('experience001', {
				globalSettings: {
					addAllCollectionItemsButtonText: 'foo',
					addButtonText: 'foo',
					quickBuyButtonText: 'foo',
					dynamicFilterButtonText: 'foo',
					shopCollectionButtonText: 'foo',
					shopCollectionItemsButtonText: 'foo',
					addCollectionItemButtonText: 'foo',
					addPromotionCodeText: 'foo',
					shipmentDeliveryMethodText: 'foo',
					pickupDeliveryMethodText: 'foo',
					buildKitBelowButtonText: 'foo',
					buildKitButtonText: 'foo',
					addKitButtonText: 'foo',
				},
			});
			appData.languagePack = { replace: <any>((str: string) => str) };

			const checkout = createMockTemplate('template001', { type: TemplateType.CHECKOUT, aliases: [AliasType.CHECKOUT] });
			const cart = createMockTemplate('template002', { type: TemplateType.CART, aliases: [AliasType.CART] });

			const experience = createMockExperience('experience002', {
				stylingAttributes: {
					brandStyles: null,
					notificationStyles: null,
					components: {
						[ComponentType.CHECKOUT]: {},
						[ComponentType.CART]: {},
					},
					discountStyles: null,
				},
				globalSettings: {
					addAllCollectionItemsButtonText: 'bar',
					addButtonText: 'bar',
					quickBuyButtonText: 'bar',
					dynamicFilterButtonText: 'bar',
					shopCollectionButtonText: 'bar',
					shopCollectionItemsButtonText: 'bar',
					addCollectionItemButtonText: 'bar',
					addPromotionCodeText: 'bar',
					shipmentDeliveryMethodText: 'bar',
					pickupDeliveryMethodText: 'bar',
					buildKitBelowButtonText: 'bar',
					buildKitButtonText: 'bar',
					addKitButtonText: 'bar',
				},
			});
			const templates = new Templates([checkout, cart]);
			const languagePack = toHelpfulLanguagePack({});

			service.getAppData(appData, { experience, templates, languagePack });

			service.cleanup();

			expect(styleConfigurationService.remove).toHaveBeenCalledTimes(1);
		});
	});
});

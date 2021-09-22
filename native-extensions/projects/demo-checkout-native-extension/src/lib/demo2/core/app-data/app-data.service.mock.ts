import { EMPTY, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { createMockExperience } from '@caas/service-client-angular';

import { Templates } from '@upscale/web-storefront-sdk';

import { AppData } from '../app-data.model';
@Injectable()
export class MockAppDataService {
	getAppData(): Observable<AppData> {
		return of(
			createMockAppData({
				editionId: 'edition001',
				experience: createMockExperience('experience001', {
					divisionId: 'mock-division-id',
					globalSettings: {
						addButtonText: 'Add',
						quickBuyButtonText: 'Quick Buy',
						dynamicFilterButtonText: 'Customize browse',
						shopCollectionButtonText: 'Shop collection',
						shopCollectionItemsButtonText: 'Shop collection items below',
						addAllCollectionItemsButtonText: 'Add collection',
						addCollectionItemButtonText: 'Add item',
						addPromotionCodeText: 'Add promotion code',
						shipmentDeliveryMethodText: 'Ship to me',
						pickupDeliveryMethodText: 'Free in-store pickup',
						buildKitBelowButtonText: 'Build your kit below',
						buildKitButtonText: 'Build your kit',
						addKitButtonText: 'Add Kit',
					},
				}),
			})
		);
	}
}

export function createMockAppData(extension: Partial<AppData> = {}): AppData {
	const proto: Partial<AppData> = {
		applePayEnabled: false,
		applePayMerchantId: 'mock-apple-pay-merchant-id',
		applePayMerchantName: 'mock-apple-pay-merchant-name',
		currencyCode: 'USD',
		currencyLocaleId: 'en-US',
		languageLocaleId: 'en-US',
		deviceDiscovery: false,
		useAsync: false,
		editionId: 'mock-edition-id',
		experience: createMockExperience('mock-experience-id'),
		experienceId: 'mock-experience-id',
		applicationGroupId: 'mock-application-group-id',
		fulfillmentLocationId: null,
		googlePayEnabled: false,
		googlePayMerchantId: '123456789012',
		googlePayMerchantName: 'mock-google-pay-merchant-name',
		kiosk: false,
		stylingAttributes: null,
		templates: new Templates([]),
		customAttributeConfig: EMPTY,
		variantAttributeConfigs: EMPTY,
		validShippingRegions: EMPTY,
		languagePack: { abc: 'df', replace: <any>(value => value) },
		sharedCartGroupId: null,
		supportedLocales: [],
		...extension,
	};

	return Object.assign(new AppData(), proto);
}

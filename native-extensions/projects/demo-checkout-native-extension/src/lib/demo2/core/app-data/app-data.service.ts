import {
	AttributeService,
	CustomAttributeConfig,
	// AttributeService,
	// CustomAttributeConfig,
	Edition,
	EditionService,
	ErrorSchema,
	GlobalSettingsService,
	InventoryService,
	IPwaBundleConfiguration,
	LanguagePack,
	OperationPreference,
	PagedInventoryLocationRequest,
	PaymentProviderService,
	PriceCurrencyService,
	QuotaType,
	ShippingService,
	TaxService,
	Template,
	UpscaleGlobalSettings,
	VariantAttributeConfig,
	// ErrorSchema,
	// GlobalSettingsService,
	// IPwaBundleConfiguration,
	// InventoryService,
	// LanguagePack,
	// OperationPreference,
	// PagedInventoryLocationRequest,
	// PaymentProviderService,
	// PriceCurrencyService,
	// QuotaType,
	// ShippingService,
	// TaxService,
	// Template,
	// UpscaleGlobalSettings,
	// VariantAttributeConfig,
} from '@caas/service-client-angular';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';

import { Templates } from '@upscale/web-storefront-sdk';

import { AppData } from '../app-data.model';
import { CookieStorageService } from '../cookie-storage/cookie-storage.service';

import { AppHelperService } from './app-helper.service';
import { AuthStorageService } from '../auth/auth-storage.service';
import { emitValueOrError, tuple } from '../util';
import { catchError, concatMap, map, mergeMap, shareReplay, tap } from 'rxjs/operators';

/**
 * Retrieves AppData required for application to function.
 *
 * Redirects from root to the home-aliased template
 */
@Injectable({ providedIn: 'root' })
export class AppDataService {
	private request: Observable<AppData>;

	constructor(
		protected editionService: EditionService,
		protected attributeService: AttributeService,
		protected inventoryService: InventoryService,
		protected shippingService: ShippingService,
		protected globalSettingsService: GlobalSettingsService,
		protected appHelperService: AppHelperService,
		protected cookieStorageService: CookieStorageService,
		protected authStorageService: AuthStorageService,
		protected paymentProviderService: PaymentProviderService,
		protected taxService: TaxService,
		protected priceCurrencyService: PriceCurrencyService,
	) {}

	getAppData(): Observable<AppData> {
		if (this.request) {
			return this.request;
		}

		this.request = forkJoin([
			this.getEdition(),
			this.getAppConfiguration(),
			this.appHelperService.getLocale(),
			this.getMaxQuantityConfig(),
		]).pipe(
			mergeMap(([edition, appConfig, localeData, maxQuantityConfig]) => {
				const appData = new AppData();

				// handle edition
				appData.editionId = edition?.id;

				// handle appConfig
				// If BundleConfiguration "editionId" exists, then using edition preview. Otherwise keep using active edition id
				if (appConfig.editionId) {
					appData.editionId = appConfig.editionId;
				}
				appData.experienceId = appConfig?.experienceId ?? null;

				appData.applicationGroupId = appConfig.applicationGroupId;

				appData.supportedLocales = appConfig.supportedLocales ?? [];

				appData.googleTagManagerContainerId = appConfig.googleTagManagerContainerId;

				appData.useAsync = appConfig.cartCheckoutOperations === OperationPreference.ASYNC;

				appData.maxQuantityConfig = maxQuantityConfig;

				appData.sharedCartGroupId = appConfig.sharedCartGroupId;

				appData.seoSiteTitle = appConfig.seoSiteTitle;

				this.handleSharedCart(appData.sharedCartGroupId);

				// set app properties from bundle configuration
				appConfig.payMerchants?.forEach(payMerchant => { // FIXME: can be removed?
					switch (payMerchant.provider) {
						case 'APPLE': {
							appData.applePayEnabled = payMerchant.oneTapBuyEnabled;
							appData.applePayMerchantId = payMerchant.payMerchantId;
							appData.applePayMerchantName = payMerchant.payMerchantName;
							break;
						}
						case 'GOOGLE': {
							appData.googlePayEnabled = payMerchant.oneTapBuyEnabled;
							appData.googlePayMerchantId = payMerchant.payMerchantId;
							appData.googlePayMerchantName = payMerchant.payMerchantName;
							break;
						}
					}
				});

				appData.variantAttributeConfigs = this.getAttributeConfig().pipe(
					tap(variantAttributeConfigs => {
						// set safe value to variant attribute positions
						variantAttributeConfigs.forEach(variantAttributeConfig => {
							if (typeof variantAttributeConfig.position !== 'number') {
								variantAttributeConfig.position = Number.MAX_SAFE_INTEGER;
							}
							variantAttributeConfig.values = variantAttributeConfig.values || [];
						});
					}),
					shareReplay(1)
				);
				appData.customAttributeConfig = this.getCustomAttributes().pipe(shareReplay(1));
				appData.validShippingRegions = this.shippingService.getValidRegions().pipe(shareReplay(1));

				// handle localeData
				appData.currencyCode = localeData.currencyCode;
				appData.currencyLocaleId = localeData.currencyLocaleId;
				appData.languageLocaleId = localeData.languageLocaleId;

				// set DeviceDiscovery
				appData.deviceDiscovery = appConfig.deviceDiscovery;

				// get templates
				return forkJoin([
					this.getTemplates(appData.experienceId).pipe(emitValueOrError<ErrorSchema>()),
					this.appHelperService.getExperience(appData.experienceId).pipe(emitValueOrError<ErrorSchema>()),
					this.appHelperService
						.getLanguagePack(appData.languageLocaleId, appData.experienceId)
						.pipe(emitValueOrError<ErrorSchema>()),
					this.globalSettingsService.getDefaults().pipe(emitValueOrError<ErrorSchema>()),
					this.taxService.getTaxMerchantConfiguration().pipe(emitValueOrError<ErrorSchema>()),
				]).pipe(
					map(([configuredTemplates, experience, languagePack, defaultGlobalSettings, taxsettings]) =>
						tuple(
							configuredTemplates.value,
							experience.value,
							languagePack.value,
							defaultGlobalSettings.value,
							taxsettings.value
						)
					),
					map(([configuredTemplates, experience, languagePack, defaultGlobalSettings, taxsettings]) => {
						// handle templates
						appData.templates = new Templates(configuredTemplates);

						// handle experience
						appData.experience = experience;
						appData.stylingAttributes = experience.stylingAttributes;

						// handle globalSettings
						appData.experience.globalSettings = this.getLocalizedGlobalSettings(languagePack, defaultGlobalSettings);

						// handle tax
						appData.showIncludeTax = taxsettings?.showIncludeTax ?? true;

						appData.showTaxSummary = taxsettings?.showTaxSummary ?? true;

						appData.fulfillmentLocationId = experience.fulfillmentLocationId;
						if (appData.fulfillmentLocationId) {
							const request: PagedInventoryLocationRequest = {
								fulfillmentLocationIds: [appData.fulfillmentLocationId],
							};

							appData.location = this.inventoryService.getInventoryLocationsPaged(1, 1, request).pipe(
								map(page => page.value[0]),
								shareReplay(1)
							);
						}

						appData.languagePack = languagePack;

						// set default strings from langauge pack
						appData.applePayMerchantId =
							appData.applePayMerchantId || appData.languagePack['general.labels.checkout.applePay.merchant'];

						return appData;
					}),
					concatMap(nextAppData =>
						this.priceCurrencyService.getPriceCurrency(nextAppData.experience.divisionId).pipe(
							map(locale => {
								if (locale?.code) {
									nextAppData.currencyCode = locale.code;
								}
								return nextAppData;
							}),
							catchError(() => of(nextAppData))
						)
					)
				);
			}),
			shareReplay(1)
		);

		return this.request;
	}

	/** Trigger side-effects of share cart enablement */
	protected handleSharedCart(sharedCartGroupId: string | undefined): void {
		if (sharedCartGroupId) {
			this.cookieStorageService.raiseDomain();
			this.authStorageService.setSharedCartMode(true);
		}
	}

	protected getEdition(): Observable<Edition> {
		return this.editionService.getActive();
	}

	protected getAppConfiguration(): Observable<IPwaBundleConfiguration> {
		// gets the configured experience from the app configuration
		return this.appHelperService.getAppConfiguration(true);
	}

	protected getTemplates(experienceId: string): Observable<Array<Template>> {
		return this.appHelperService.getTemplates(experienceId);
	}

	private getCustomAttributes(): Observable<Array<CustomAttributeConfig<string>>> {
		return this.attributeService.getCustomAttributes();
	}

	private getAttributeConfig(): Observable<Array<VariantAttributeConfig<string>>> {
		return this.attributeService.getVariantAttributes();
	}

	private getMaxQuantityConfig(): Observable<number | undefined> {
		return this.inventoryService
			.getLimitsConfiguration(QuotaType.PER_PRODUCT_PER_ORDER)
			.pipe(map(limitConfig => (limitConfig.enabled ? limitConfig.quota : undefined)));
	}

	private getLocalizedGlobalSettings(languagePack: LanguagePack, defaultGlobalSettings: UpscaleGlobalSettings): UpscaleGlobalSettings {
		const globalSettings: UpscaleGlobalSettings = {
			addButtonText: languagePack['general.buttons.globalSettings.addToCart'] || defaultGlobalSettings.addButtonText,
			quickBuyButtonText: languagePack['general.buttons.globalSettings.quickBuy'] || defaultGlobalSettings.quickBuyButtonText,
			dynamicFilterButtonText:
				languagePack['general.buttons.globalSettings.openDynamicFilter'] || defaultGlobalSettings.dynamicFilterButtonText,
			shopCollectionButtonText:
				languagePack['general.buttons.globalSettings.shopCollection'] || defaultGlobalSettings.shopCollectionButtonText,
			shopCollectionItemsButtonText:
				languagePack['general.buttons.globalSettings.shopCollectionItems'] || defaultGlobalSettings.shopCollectionItemsButtonText,
			addCollectionItemButtonText:
				languagePack['general.buttons.globalSettings.addCollectionItem'] || defaultGlobalSettings.addCollectionItemButtonText,
			addAllCollectionItemsButtonText:
				languagePack['general.buttons.globalSettings.addAllCollectionItems'] ||
				defaultGlobalSettings.addAllCollectionItemsButtonText,
			addPromotionCodeText: languagePack['general.headers.couponCode'] || defaultGlobalSettings.addPromotionCodeText,
			shipmentDeliveryMethodText:
				languagePack['general.buttons.globalSettings.deliveryMethods.shipment'] || defaultGlobalSettings.shipmentDeliveryMethodText,
			pickupDeliveryMethodText:
				languagePack['general.buttons.globalSettings.deliveryMethods.pickup'] || defaultGlobalSettings.pickupDeliveryMethodText,
			addKitButtonText: languagePack['general.buttons.globalSettings.addKit'] || defaultGlobalSettings.addKitButtonText,
			buildKitButtonText: languagePack['general.buttons.globalSettings.buildKit'] || defaultGlobalSettings.buildKitButtonText,
			buildKitBelowButtonText:
				languagePack['general.buttons.globalSettings.buildKitBelow'] || defaultGlobalSettings.buildKitBelowButtonText,
		};
		return globalSettings;
	}

}

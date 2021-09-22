import {
	CustomAttributeConfig,
	Experience,
	IValidRegion,
	InventoryFulfillmentLocation,
	LanguagePack,
	LocalizedField,
	PaymentAccountGroup,
	SupportedApplicationLocale,
	UpscaleStylingAttributes,
	VariantAttributeConfig,
} from '@caas/service-client-angular';
import { Observable } from 'rxjs';

import { Templates } from '@upscale/web-storefront-sdk';

export type HelpfulLanguagePack = LanguagePack & {
	/**
	 * @param value string whose content contains placeholders such as ${1}, ${2}
	 * @param tokens which will replace ${1}, ${2} etc
	 * @returns the modified string
	 */
	replace(value: string, ...tokens: Array<string>): string;
};

export interface AltExperienceData {
	templates: Templates;
	experience: Experience;
	languagePack: HelpfulLanguagePack;
}

/**
 * Dynamic application data/configuration
 */
export class AppData implements AltExperienceData {
	templates: Templates;

	editionId: string;

	kiosk: boolean;

	experienceId: string;

	applicationGroupId?: string;

	fulfillmentLocationId: string;

	deviceDiscovery = false;

	applePayEnabled = false;
	applePayMerchantId: string;
	applePayMerchantName: string;

	googlePayEnabled = false;
	googlePayMerchantId: string;
	googlePayMerchantName: string;

	experience: Experience;

	showIncludeTax = false;
	showTaxSummary = false;

	currencyCode: string;
	currencyLocaleId: string;
	languageLocaleId: string;

	sharedCartGroupId?: string;

	paymentAccountGroups?: Array<PaymentAccountGroup>;

	useAsync: boolean;

	/**
	 * Asynchronous fetch for the store information associated to the experience.
	 * Undefined if no fulfillment id.
	 */
	location?: Observable<InventoryFulfillmentLocation>;

	customAttributeConfig: Observable<Array<CustomAttributeConfig<string>>>;

	validShippingRegions: Observable<Array<IValidRegion>>;

	stylingAttributes: UpscaleStylingAttributes;

	variantAttributeConfigs: Observable<Array<VariantAttributeConfig<string>>>;

	languagePack: HelpfulLanguagePack;

	supportedLocales: Array<SupportedApplicationLocale>;

	googleTagManagerContainerId: string | undefined;

	maxQuantityConfig: number | undefined;

	seoSiteTitle?: LocalizedField;

	clone(): AppData {
		const clone = new AppData();

		clone.templates = this.templates;
		clone.editionId = this.editionId;
		clone.kiosk = this.kiosk;
		clone.experienceId = this.experienceId;
		clone.applicationGroupId = this.applicationGroupId;
		clone.fulfillmentLocationId = this.fulfillmentLocationId;
		clone.deviceDiscovery = this.deviceDiscovery;
		clone.applePayEnabled = this.applePayEnabled;
		clone.applePayMerchantId = this.applePayMerchantId;
		clone.applePayMerchantName = this.applePayMerchantName;
		clone.googlePayEnabled = this.googlePayEnabled;
		clone.googlePayMerchantId = this.googlePayMerchantId;
		clone.experience = this.experience;
		clone.showIncludeTax = this.showIncludeTax;
		clone.showTaxSummary = this.showTaxSummary;
		clone.currencyCode = this.currencyCode;
		clone.currencyLocaleId = this.currencyLocaleId;
		clone.languageLocaleId = this.languageLocaleId;
		clone.location = this.location;
		clone.customAttributeConfig = this.customAttributeConfig;
		clone.validShippingRegions = this.validShippingRegions;
		clone.stylingAttributes = this.stylingAttributes;
		clone.variantAttributeConfigs = this.variantAttributeConfigs;
		clone.languagePack = this.languagePack;
		clone.useAsync = this.useAsync;
		clone.googleTagManagerContainerId = this.googleTagManagerContainerId;
		clone.maxQuantityConfig = this.maxQuantityConfig;
		clone.seoSiteTitle = this.seoSiteTitle;

		return clone;
	}
}

export function toHelpfulLanguagePack(languagePack: LanguagePack): HelpfulLanguagePack {
	(languagePack as HelpfulLanguagePack).replace = function replace(value: string, ...tokens: Array<string>): string {
		tokens.forEach((token, i) => {
			value = value.replace(new RegExp(`\\$\\{${i + 1}\\}`), token);
		});
		return value;
	};
	return languagePack as HelpfulLanguagePack;
}

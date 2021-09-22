/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
import { Locale, SupportedLocale } from '@caas/service-client-angular';

import { getLocaleAsString } from './get-locale-as-string.function';

describe('getLocaleAsString', () => {
	it('should convert SupportedLocale', () => {
		const locale: SupportedLocale = {
			language: 'nb',
			label: '',
			countryInfo: {
				countryCode: 'NO',
				nationalFlagImage: '',
				region: '',
			},
			defaultFlag: false,
			script: '',
			nativeLanguageLabel: '',
		};

		expect(getLocaleAsString(locale)).toEqual('nb-NO');
	});

	it('should convert SupportedLocale with script', () => {
		const locale: SupportedLocale = {
			language: 'nb',
			label: '',
			countryInfo: {
				countryCode: 'NO',
				nationalFlagImage: '',
				region: '',
			},
			defaultFlag: false,
			script: 'latn',
			nativeLanguageLabel: '',
		};

		expect(getLocaleAsString(locale)).toEqual('nb-latn-NO');
	});

	it('should convert Locale', () => {
		const locale: Locale = {
			language: 'fr',
			country: 'FR',
		};

		expect(getLocaleAsString(locale)).toEqual('fr-FR');
	});

	it('should convert Locale with script', () => {
		const locale: Locale = {
			language: 'fr',
			country: 'FR',
			script: 'foo',
		};

		expect(getLocaleAsString(locale)).toEqual('fr-foo-FR');
	});
});

/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SupportedLocale } from '@caas/service-client-angular';

import { AppLocaleData } from './locale.service';

@Injectable()
export class MockLocaleService {
	getCurrencyCode(): Observable<string> {
		return of('USD');
	}

	getCurrencyLocaleId(): Observable<string> {
		return of('en-US');
	}

	getLanguageLocaleId(): Observable<string> {
		return of('en-US');
	}

	getAppLanguages(): Observable<Array<SupportedLocale>> {
		return of([
			{
				language: 'en',
				label: '',
				defaultFlag: true,
				script: '',
				nativeLanguageLabel: '',
				countryInfo: {
					countryCode: 'US',
					region: '',
					nationalFlagImage: '',
				},
			},
		]);
	}

	getDefaultLocale(): Observable<SupportedLocale> {
		return of({
			language: 'en',
			label: '',
			defaultFlag: true,
			script: '',
			nativeLanguageLabel: '',
			countryInfo: {
				countryCode: 'US',
				region: '',
				nationalFlagImage: '',
			},
		});
	}

	getAppLocale(): Observable<AppLocaleData> {
		return of({
			locales: [
				{
					language: 'en',
					label: '',
					defaultFlag: true,
					script: '',
					nativeLanguageLabel: '',
					countryInfo: {
						countryCode: 'US',
						region: '',
						nationalFlagImage: '',
					},
				},
			],
			defaultLocale: {
				language: 'en',
				label: '',
				defaultFlag: true,
				script: '',
				nativeLanguageLabel: '',
				countryInfo: {
					countryCode: 'US',
					region: '',
					nationalFlagImage: '',
				},
			},
		});
	}
}

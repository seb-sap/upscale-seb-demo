import { ConfigurationService, ExtendedLocale, Locale, LocaleType, SupportedLocale } from '@caas/service-client-angular';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, concatMap, map, mapTo, shareReplay, take } from 'rxjs/operators';

import { AppBundleService } from '../app-data/app-bundle/app-bundle.service';
import { tuple } from '../util/tuple.function';

import { LocaleImporterService } from './locale-importer.service';
import { getLocaleAsString } from './get-locale-as-string.function';

interface LocaleData {
	currencyCode: string;
	currencyLocaleId: string;
	languageLocaleId: string;
}

export interface AppLocaleData {
	locales: Array<SupportedLocale>;
	defaultLocale: SupportedLocale | undefined;
}

@Injectable({ providedIn: 'root' })
export class LocaleService {
	languageLocale: Locale;

	private request: Observable<LocaleData>;

	private appLocaleRequest: Observable<AppLocaleData>;

	constructor(
		private location: Location,
		private configurationService: ConfigurationService,
		private localeImporterService: LocaleImporterService,
		private appBundle: AppBundleService
	) {
		const defaultLocale = {
			country: 'US',
			language: 'en',
			script: '',
		};

		this.request = this.configurationService.getLocale().pipe(
			map(({ locales }) => {
				const savedLanguageFromStorage = this.getLocaleFromStorage();
				const savedLanguageFound = <Locale | null>(
					(savedLanguageFromStorage
						? locales.find(
								locale =>
									savedLanguageFromStorage.toLowerCase() === getLocaleAsString(locale).toLowerCase() &&
									locale.type === LocaleType.Language
						  )
						: null)
				);

				const languageLocale =
					savedLanguageFound || <Locale>locales.find(locale => locale.type === LocaleType.Language && locale.defaultFlag);

				this.languageLocale = languageLocale;

				return tuple(
					<ExtendedLocale>locales.find(locale => locale.type === LocaleType.Currency && 'currency' in locale),
					languageLocale
				);
			}),
			catchError(() => of(tuple(<ExtendedLocale>{ ...defaultLocale, currency: 'USD' }, <Locale>defaultLocale))),
			concatMap(locales => {
				const languageLocale = locales[1] || defaultLocale;
				const currencyLocale = locales[0] || { ...defaultLocale, currency: 'USD' };
				const languageLocaleId = getLocaleAsString(languageLocale);

				const currencyLocaleId = `${currencyLocale.language}-${currencyLocale.country}`;
				const defaultLocaleId = `${defaultLocale.language}-${defaultLocale.country}`;

				const currencyLocaleObvs = this.localeImporterService.loadLocale(languageLocaleId).pipe(
					mapTo(languageLocaleId),
					catchError(() =>
						this.localeImporterService.loadLocale(currencyLocaleId).pipe(
							mapTo(currencyLocaleId),
							catchError(() => of(defaultLocaleId))
						)
					)
				);

				return forkJoin([of(currencyLocale.currency), currencyLocaleObvs, of(languageLocaleId)]);
			}),
			map(([currencyCode, currencyLocaleId, languageLocaleId]) => ({
				currencyCode,
				currencyLocaleId,
				languageLocaleId,
			})),
			shareReplay(1)
		);

		this.appLocaleRequest = forkJoin([this.configurationService.getSupportedLanguages(), this.appBundle.get(true)]).pipe(
			map(([supportedLocales, bundle]) => {
				const tenantLanguages = supportedLocales.locales;
				const bundleLocales = bundle.supportedLocales ?? [];

				const locales: Array<SupportedLocale> = [];
				let locale: SupportedLocale | undefined;

				tenantLanguages.forEach(tenantLanguage => {
					const bundleLocale = bundleLocales.find(
						appLanguage => getLocaleAsString(tenantLanguage).toLowerCase() === appLanguage.locale.toLowerCase()
					);

					if (bundleLocale) {
						locales.push(tenantLanguage);

						if (bundleLocale.isDefault) {
							locale = tenantLanguage;
						}
					}
				});

				return {
					locales,
					defaultLocale: locale,
				};
			}),
			shareReplay(1)
		);
	}

	getCurrencyCode(): Observable<string> {
		return this.request.pipe(map(({ currencyCode }) => currencyCode));
	}

	getCurrencyLocaleId(): Observable<string> {
		return this.request.pipe(map(({ currencyLocaleId }) => currencyLocaleId));
	}

	getLanguageLocaleId(): Observable<string> {
		return this.request.pipe(map(({ languageLocaleId }) => languageLocaleId));
	}

	getAppLanguages(): Observable<Array<SupportedLocale>> {
		return this.appLocaleRequest.pipe(
			map(({ locales }) => locales),
			take(1)
		);
	}

	getAppLocale(): Observable<AppLocaleData> {
		return this.appLocaleRequest.pipe(take(1));
	}

	/**
	 * Convert selected date value to localized string
	 * @param date Date string to localized
	 */
	getLocalizedDateTime(selectedDate: Date): { date: string; time: string } {
		const localeString = this.getLocaleFromStorage() ?? 'en-US';
		const date = selectedDate.toLocaleString(localeString, {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});

		const time = selectedDate.toLocaleString(localeString, {
			hour: 'numeric',
			minute: 'numeric',
			timeZoneName: 'short',
		});

		return { date, time };
	}

	getLocaleOrDefault(): string {
		return this.getLocaleFromStorage() ?? 'en-US';
	}

	// get locale value stored in local storage
	private getLocaleFromStorage(): string | null {
		// At this point the router is not initialized so v low-level.
		return this.location.path().split('/')[1];
	}
}

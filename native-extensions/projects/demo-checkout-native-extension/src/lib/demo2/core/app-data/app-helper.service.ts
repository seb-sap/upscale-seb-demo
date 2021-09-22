/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
import {
	Experience,
	ExperienceExpand,
	ExperienceService,
	IPwaBundleConfiguration,
	InternationalizationService,
	Template,
	TemplateExpandEnum,
	TemplateService,
} from '@caas/service-client-angular';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable, defer, forkJoin, of } from 'rxjs';
import { Templates } from '@upscale/web-storefront-sdk';
import { concatMap, finalize, map, mergeMap, shareReplay, switchMap, tap } from 'rxjs/operators';

import { AltExperienceData, AppData, HelpfulLanguagePack, toHelpfulLanguagePack } from '../app-data.model';
import { LocaleService } from '../localization';
import { NULL, tuple } from '../util';

import { AltExperienceHandler } from './alt-experience-handler.interface';
import { AppBundleService } from './app-bundle/app-bundle.service';
import { OrderExperienceService } from './order-experience/order-experience.service';
import { TEMPLATES_TOKEN } from './tokens.const';

@Injectable({ providedIn: 'root' })
export class AppHelperService {
	private readonly altExperienceOrder: Array<AltExperienceHandler>;
	private readonly localeRequest: Observable<{ currencyCode: string; currencyLocaleId: string; languageLocaleId: string }>;

	/**
	 * 0th record is the experience ID.
	 * 1st record is the associated request for the experience.
	 */
	private altExperienceRequest: [string, Observable<AltExperienceData>];

	constructor(
		private appBundle: AppBundleService,
		private experienceService: ExperienceService,
		private internationalizationService: InternationalizationService,
		private localeService: LocaleService,
		private templateService: TemplateService,
		@Optional() @Inject(TEMPLATES_TOKEN) private templates: Array<Template>,
		orderExperienceService: OrderExperienceService
	) {
		this.localeRequest = forkJoin({
			currencyCode: this.localeService.getCurrencyCode(),
			currencyLocaleId: this.localeService.getCurrencyLocaleId(),
			languageLocaleId: this.localeService.getLanguageLocaleId(),
		}).pipe(
			map(({ currencyCode, currencyLocaleId, languageLocaleId }) => ({
				currencyCode,
				currencyLocaleId,
				languageLocaleId,
			})),
			// Making the assumption locales should be fetched only once per app lifetime.
			shareReplay(1)
		);

		this.altExperienceOrder = [orderExperienceService];
	}

	/**
	 * Consider moving functionality to its own separate file.
	 * @param appData that may or may not be transformed.
	 * @returns null if no transformation is needed.
	 */
	getAlternativeAppData(appData: AppData): Observable<AppData | null> {
		const assignedExperience = appData.experienceId;
		return defer(() => {
			let altExperienceOrder: Observable<[string, AltExperienceHandler] | null> = NULL;

			// Go through each handler.
			this.altExperienceOrder.forEach(handler => {
				altExperienceOrder = altExperienceOrder.pipe(
					switchMap(result => {
						if (!result) {
							return handler.getExperienceId().pipe(
								map(experienceId => {
									if (experienceId && assignedExperience !== experienceId) {
										// Otherwise, calculate a desirable result.
										return tuple(experienceId, handler);
									}
									// If the result is not desired, then forward a lack of result so the next handler will pick up slack.
									return null;
								})
							);
						}
						// If a result has already been determined, then do nothing (except cleanup) and forward the result.
						return of(result);
					}),
					finalize(() => {
						/*
						 * Not the best way to call 'cleanup'...the assumption now is that 'getAlternativeAppData'
						 * will always be called when the relevant route is hit. So this is highly coupled with
						 * the routing.
						 */
						handler.cleanup();
					})
				);
			});

			return altExperienceOrder;
		}).pipe(
			concatMap(result => {
				if (!result) {
					return NULL;
				}

				const [experienceId, handler] = result;

				const toAppData = map((altExperience: AltExperienceData) => handler.getAppData(appData, altExperience));

				if (this.altExperienceRequest) {
					const [cachedId, request] = this.altExperienceRequest;

					if (experienceId === cachedId) {
						return request.pipe(toAppData);
					}
				}

				const experienceRequest = forkJoin([this.getExperience(experienceId), this.getLocale()]).pipe(
					mergeMap(([experience, { languageLocaleId }]) =>
						forkJoin([this.getTemplates(experienceId), this.getLanguagePack(languageLocaleId, experienceId)]).pipe(
							map(([templates, languagePack]) => ({
								templates: new Templates(templates),
								experience,
								languagePack,
							}))
						)
					),
					shareReplay(1)
				);

				this.altExperienceRequest = [experienceId, experienceRequest];

				return experienceRequest.pipe(toAppData);
			})
		);
	}

	/**
	 * @param cached - get the cached bundle.
	 */
	getAppConfiguration(cached?: boolean): Observable<IPwaBundleConfiguration> {
		// gets the configured experience from the app configuration
		return this.appBundle.get(cached);
	}

	getExperience(experienceId: string): Observable<Experience> {
		return this.experienceService.get(experienceId, [ExperienceExpand.COMPONENTS]);
	}

	getLocale(): Observable<{ currencyCode: string; currencyLocaleId: string; languageLocaleId: string }> {
		return this.localeRequest;
	}

	getTemplates(experienceId: string): Observable<Array<Template>> {
		if (this.templates) {
			return of(this.templates);
		} else {
			const expand = [TemplateExpandEnum.ALIASES, TemplateExpandEnum.COMPONENTS, TemplateExpandEnum.SEO_URL_SLUG_TRANSLATIONS];
			return this.templateService.getAll(experienceId, { expand });
		}
	}

	getLanguagePack(locale: string, experienceId: string): Observable<HelpfulLanguagePack> {
		return this.internationalizationService
			.getLanguagePack(locale, [{ tagType: 'experience', tagValue: experienceId }])
			.pipe(map(toHelpfulLanguagePack));
	}
}

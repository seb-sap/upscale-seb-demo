/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
import { Experience, IPwaBundleConfiguration, Template, createMockExperience, createMockTemplate } from '@caas/service-client-angular';
import { Observable, of } from 'rxjs';

import { AppData, HelpfulLanguagePack, toHelpfulLanguagePack } from '../app-data.model';
import { NULL } from '../util';

import { IAppHelperService } from './app-helper.service.interface';

export class MockAppHelperService implements IAppHelperService {
	getAppConfiguration(): Observable<IPwaBundleConfiguration> {
		return of({
			payMerchants: [],
			editionId: '',
			experienceId: 'mock-experience-id',
			deviceDiscovery: true,
		});
	}

	getAlternativeAppData(appData: AppData): Observable<AppData | null> {
		return NULL;
	}

	getExperience(experienceId: string): Observable<Experience> {
		return of(createMockExperience('experience001'));
	}

	getLocale(): Observable<{ currencyCode: string; currencyLocaleId: string; languageLocaleId: string }> {
		return of({ currencyCode: 'USD', currencyLocaleId: 'en-US', languageLocaleId: 'en-US' });
	}

	getTemplates(locale: string, experienceId: string): Observable<Array<Template>> {
		return of([createMockTemplate('template001'), createMockTemplate('template002')]);
	}

	getLanguagePack(locale: string, experienceId: string): Observable<HelpfulLanguagePack> {
		return of(toHelpfulLanguagePack({}));
	}
}

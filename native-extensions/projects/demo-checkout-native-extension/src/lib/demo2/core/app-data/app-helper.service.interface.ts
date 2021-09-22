/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
import { Experience, Template } from '@caas/service-client-angular';
import { Observable } from 'rxjs';

import { AppData, HelpfulLanguagePack } from '../app-data.model';

export interface IAppHelperService {
	getAlternativeAppData(appData: AppData): Observable<AppData | null>;

	getExperience(experienceId: string): Observable<Experience>;

	getLocale(): Observable<{ currencyCode: string; currencyLocaleId: string; languageLocaleId: string }>;

	getTemplates(locale: string, experienceId: string): Observable<Array<Template>>;

	getLanguagePack(locale: string, experienceId: string): Observable<HelpfulLanguagePack>;
}

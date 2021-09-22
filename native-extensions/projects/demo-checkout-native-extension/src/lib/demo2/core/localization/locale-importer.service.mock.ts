/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class MockLocaleImporterService {
	loadLocale(localeId: string): Observable<string> {
		return of(localeId);
	}
}

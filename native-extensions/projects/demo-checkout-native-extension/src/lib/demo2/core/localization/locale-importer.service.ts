import { EMPTY, Observable, defer, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, concatMap, take, throwIfEmpty } from 'rxjs/operators';
import { registerLocaleData } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LocaleImporterService {
	loadLocale(localeId: string): Observable<string> {
		const locales = [localeId, this.reduceLocale(localeId)];

		return of(...locales).pipe(
			concatMap(locale => this.localeInitializer(locale).pipe(catchError(err => EMPTY))),
			take(1),
			throwIfEmpty()
		);
	}

	private reduceLocale(locale: string): string | null {
		const index = locale.indexOf('-');
		if (index > -1) {
			return locale.substring(0, index);
		}
		return null;
	}

	private localeInitializer(locale: string): Observable<string> {
		return defer(() =>
			import(
				/* webpackInclude: /locales[\/\\](\w\w)(-\w\w)?\.js$/ */
				/* webpackChunkName: "loc/[request]"  */
				`@angular/common/locales/${locale}.js`
			).then(module => {
				registerLocaleData(module.default);
				return locale;
			})
		);
	}
}

import { ApplicationService, IPwaBundleConfiguration } from '@caas/service-client-angular';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { BUNDLE_TOKEN } from '../tokens.const';
import { ApplicationConfig } from '..';

/**
 * Fetches and stores the application bundle.
 */
@Injectable({ providedIn: 'root' })
export class AppBundleService {
	private bundle: IPwaBundleConfiguration;

	constructor(
		private applicationConfig: ApplicationConfig,
		private appService: ApplicationService,
		@Optional() @Inject(BUNDLE_TOKEN) bundle: IPwaBundleConfiguration
	) {
		if (bundle) {
			this.bundle = bundle;
		}
	}

	/**
	 * @param cached - get the cached bundle.
	 */
	get(cached?: boolean): Observable<IPwaBundleConfiguration> {
		// gets the configured experience from the app configuration
		if (cached && this.bundle) {
			return of(this.bundle);
		}
		return this.appService.getPlatformBundle('PWA', this.applicationConfig.BUNDLE_ID).pipe(tap(bundle => (this.bundle = bundle)));
	}
}
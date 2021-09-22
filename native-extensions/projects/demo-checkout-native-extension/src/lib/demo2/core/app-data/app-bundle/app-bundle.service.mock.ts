/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
import { ValueProvider } from '@angular/core';
import { of } from 'rxjs';

import { AppBundleService } from './app-bundle.service';

export function createMockAppBundleService(): AppBundleService {
	return jasmine.createSpyObj('AppBundleService', {
		get: of({}),
	});
}

export function createMockAppBundleServiceProvider(): ValueProvider {
	return { provide: AppBundleService, useValue: createMockAppBundleService() };
}

/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
import { Provider } from '@angular/core';

import { PlatformContextService } from './platform-context.service';

export function createMockPlatformContext(): PlatformContextService {
	return jasmine.createSpyObj('PlatformContextService', [], {
		onBrowser: true,
		onServer: false,
		browserOnly: null,
		serverOnly: null,
	});
}

export function createMockPlatformContextProvider(): Provider {
	return { provide: PlatformContextService, useValue: createMockPlatformContext() };
}

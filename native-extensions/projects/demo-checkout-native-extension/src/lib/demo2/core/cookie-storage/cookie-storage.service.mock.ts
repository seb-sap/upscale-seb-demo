/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
import { Injectable } from '@angular/core';

import { ICookieStorageServcie } from './cookie-storage.service.interface';

@Injectable()
export class MockCookieStorageService implements ICookieStorageServcie {
	raiseDomain(): void {}

	get(key: string): Array<string> {
		return ['mock-value'];
	}

	set(key: string, value: string, opts: { maxAge?: number } = {}): void {}

	remove(key: string): void {}
}

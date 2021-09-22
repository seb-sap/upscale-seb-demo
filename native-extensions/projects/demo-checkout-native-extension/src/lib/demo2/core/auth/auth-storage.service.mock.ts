/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

import { AuthValues } from '@upscale/web-storefront-sdk';
import { OAuthToken } from '@caas/service-client-angular';
import { Observable, of } from 'rxjs';

import { IAuthStorageService } from './auth-storage.service.interface';

export class MockAuthStorageService implements IAuthStorageService {
	customerSessionId = '';
	loggedInStatus: Observable<boolean> = of(true);
	authValues: Observable<AuthValues> = of({ authToken: 'authToken-123', customerSessionId: 'customer-123' });
	setSharedCartMode(mode: boolean): void {}
	storeOAuthToken(oAuthToken: OAuthToken): void {}
	getOAuthToken(): string {
		return '';
	}
	generateCustomerSessionId(): void {}
	getCustomerSession(): string {
		return 'test_id';
	}
}

import { AuthValues } from '@upscale/web-storefront-sdk';
import { OAuthToken } from '@caas/service-client-angular';
import { Observable } from 'rxjs';

export interface IAuthStorageService {
	customerSessionId: string | null;

	loggedInStatus: Observable<boolean>;

	authValues: Observable<AuthValues>;

	setSharedCartMode(share: boolean): void;

	storeOAuthToken(oAuthToken: OAuthToken): void;

	getOAuthToken(): string | null;

	generateCustomerSessionId(): void;
}

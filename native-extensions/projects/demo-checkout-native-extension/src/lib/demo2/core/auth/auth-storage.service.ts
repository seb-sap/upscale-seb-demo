import * as uuid from 'uuid';
import { Injectable } from '@angular/core';
import { OAuthToken } from '@caas/service-client-angular';

import { AuthValues } from '@upscale/web-storefront-sdk';
import { Observable, ReplaySubject } from 'rxjs';

import { ApplicationLoggerService } from '../application-logger/application-logger.service';
import { CookieStorageService } from '../cookie-storage';
import { LocalStorageService } from '../local-storage';

import { IAuthStorageService } from './auth-storage.service.interface';

@Injectable({ providedIn: 'root' })
export class AuthStorageService implements IAuthStorageService {
	static CUSTOMER_SESSION_ID = 'guest-customer-session-id';

	private _customerSessionId: string | null;
	private _oAuthToken: string | null;
	private _oAuthTokenExpiration: number | null;
	private _loggedInStatus: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
	private _authValues: ReplaySubject<AuthValues> = new ReplaySubject<AuthValues>(1);
	private _loginStatus: boolean;

	/**
	 * Sets this._customerSessionId and localStorage item to sessionId param
	 */
	set customerSessionId(sessionId: string | null) {
		this._customerSessionId = sessionId;
		this.saveCustomerSession(sessionId);
	}

	get customerSessionId(): string | null {
		return this._customerSessionId;
	}

	get loggedInStatus(): Observable<boolean> {
		return this._loggedInStatus.asObservable();
	}

	get authValues(): Observable<AuthValues> {
		return this._authValues.asObservable();
	}

	private shareMode = false;

	constructor(
		private localStorageService: LocalStorageService,
		private cookieStorage: CookieStorageService,
		private applicationLogger: ApplicationLoggerService
	) {
		this.setSharedCartMode(false);

		this._oAuthToken = this.localStorageService.getItem('o-auth-token');

		const authValues: AuthValues = {
			authToken: this._oAuthToken,
			customerSessionId: this.customerSessionId,
		};
		this._authValues.next(authValues);

		this._loginStatus = !!this._oAuthToken;
		this._loggedInStatus.next(this._loginStatus);
		const expirationString = this.localStorageService.getItem('o-auth-token-expiration');
		if (expirationString) {
			this._oAuthTokenExpiration = Number.parseInt(expirationString, 10);
		} else {
			this._oAuthTokenExpiration = null;
		}
	}

	/** Switch between shared cart mode and non-shared cart */
	setSharedCartMode(share: boolean): void {
		this.shareMode = share;
		this._customerSessionId = this.getCustomerSession();
		if (!this.customerSessionId) {
			this.customerSessionId = this.generateSessionId();
		}
	}

	/**
	 * Takes in OAuthToken object and sets localStorage items and service variables.
	 * If either is null-ish, all values are cleared.
	 */
	storeOAuthToken({ accessToken, expirationDate }: Partial<OAuthToken>): void {
		if (accessToken && expirationDate) {
			if (this._oAuthToken !== accessToken) {
				const authValues: AuthValues = {
					authToken: accessToken,
					customerSessionId: this.customerSessionId,
				};
				this._authValues.next(authValues);
			}

			this._oAuthToken = accessToken;

			if (this._loginStatus !== !!accessToken) {
				this._loginStatus = !!accessToken;
				this._loggedInStatus.next(this._loginStatus);
			}

			this._oAuthTokenExpiration = expirationDate.valueOf();
			this.localStorageService.setItem('o-auth-token', accessToken);
			this.localStorageService.setItem('o-auth-token-expiration', expirationDate.toString());
		} else {
			if (this._oAuthToken !== null) {
				const authValues: AuthValues = {
					authToken: null,
					customerSessionId: this.customerSessionId,
				};
				this._authValues.next(authValues);
			}

			this._oAuthToken = null;

			if (this._loginStatus !== !!accessToken) {
				this._loginStatus = !!accessToken;
				this._loggedInStatus.next(this._loginStatus);
			}

			this._oAuthTokenExpiration = null;
			this.localStorageService.removeItem('o-auth-token');
			this.localStorageService.removeItem('o-auth-token-expiration');
		}
	}

	/**
	 * Returns saved oAuthToken if it exists and is not expired
	 * Otherwise, returns null
	 */
	getOAuthToken(): string | null {
		const currentDate = Date.now();
		if (this._oAuthToken && this._oAuthTokenExpiration && this._oAuthTokenExpiration > currentDate) {
			if (this._loginStatus !== !!this._oAuthToken) {
				this._loginStatus = !!this._oAuthToken;
				this._loggedInStatus.next(this._loginStatus);
			}

			const authValues: AuthValues = {
				authToken: this._oAuthToken,
				customerSessionId: this.customerSessionId,
			};
			this._authValues.next(authValues);

			return this._oAuthToken;
		} else if (this._oAuthToken && this._oAuthTokenExpiration && this._oAuthTokenExpiration < currentDate) {
			this.applicationLogger.log('oAuthToken expired, logging out');
			this.storeOAuthToken({});
		}
		return null;
	}

	/**
	 * Get new session id and sets this._customerSessionId and localStorage item
	 */
	generateCustomerSessionId(): void {
		const sessionId = this.generateSessionId();
		this._customerSessionId = sessionId;
		this.saveCustomerSession(sessionId);
	}

	saveCustomerSession(newValue: string | null): void {
		newValue = newValue || '';
		if (this.shareMode) {
			this.cookieStorage.set(AuthStorageService.CUSTOMER_SESSION_ID, newValue, { maxAge: 63072000 });
		} else {
			this.localStorageService.setItem(AuthStorageService.CUSTOMER_SESSION_ID, newValue);
		}
	}

	getCustomerSession(): string | null {
		if (this.shareMode) {
			return this.cookieStorage.get(AuthStorageService.CUSTOMER_SESSION_ID)[0];
		} else {
			return this.localStorageService.getItem(AuthStorageService.CUSTOMER_SESSION_ID);
		}
	}

	private generateSessionId(): string {
		return uuid();
	}
}

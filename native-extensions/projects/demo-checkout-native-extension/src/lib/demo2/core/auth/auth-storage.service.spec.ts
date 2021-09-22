import { TestBed } from '@angular/core/testing';

import { ApplicationLoggerService } from '../application-logger/application-logger.service';
import { ConsentDecisionService } from '../consent-decision/consent-decision.service';
import { MockApplicationLoggerService } from '../application-logger/application-logger.service.mock';

import { CookieStorageService } from '../cookie-storage';
import { LocalStorageService } from '../local-storage';
import { MockCookieStorageService } from '../cookie-storage/cookie-storage.service.mock';
import { MockLocalStorageService } from '../local-storage/mock';

import { AuthStorageService } from './auth-storage.service';

describe('AuthStorageService', () => {
	let service: AuthStorageService;

	let localStorageService: LocalStorageService;
	let applicationLogger: ApplicationLoggerService;

	let sessionIdAvailable: boolean;
	let oAuthTokenExpired: boolean;
	let oAuthDataAvailable: boolean;

	let mockCustomerSessionId: string;
	let oAuthTokenKey: string;
	let oAuthTokenExpKey: string;
	let mockOAuthToken: string;

	let currentDate: Date;

	let getLocalStorageItems: (key: string) => string;

	beforeEach(() => {
		mockCustomerSessionId = 'mock-customer-session-id';
		oAuthTokenKey = 'o-auth-token';
		oAuthTokenExpKey = 'o-auth-token-expiration';
		mockOAuthToken = 'mockOAuthToken';

		getLocalStorageItems = (key: string) => {
			const expiresIn = oAuthTokenExpired ? -1 : 1;
			if (key === AuthStorageService.CUSTOMER_SESSION_ID && sessionIdAvailable) {
				return mockCustomerSessionId;
			} else if (key === oAuthTokenExpKey && oAuthDataAvailable) {
				return (currentDate.valueOf() + expiresIn * 1000).toString();
			} else if (key === oAuthTokenKey && oAuthDataAvailable) {
				return mockOAuthToken;
			} else {
				return null;
			}
		};

		TestBed.configureTestingModule({
			providers: [
				AuthStorageService,
				{ provide: LocalStorageService, useClass: MockLocalStorageService },
				{ provide: CookieStorageService, useClass: MockCookieStorageService },
				{ provide: ConsentDecisionService, useClass: ConsentDecisionService },
				{ provide: ApplicationLoggerService, useClass: MockApplicationLoggerService },
			],
		});

		localStorageService = TestBed.inject(LocalStorageService);
		applicationLogger = TestBed.inject(ApplicationLoggerService);

		spyOn(applicationLogger, 'log').and.stub();
	});

	beforeEach(() => {
		currentDate = new Date(2018, 7, 13);
		jasmine.clock().mockDate(currentDate);

		spyOn(localStorageService, 'getItem').and.callFake(getLocalStorageItems);
		spyOn(localStorageService, 'setItem').and.stub();
		spyOn(localStorageService, 'removeItem').and.stub();

		// getLocalStorageItems should return valid oAuthToken by default. Override these to get alternative results.
		sessionIdAvailable = true;
		oAuthTokenExpired = false;
		oAuthDataAvailable = true;
	});

	it('should be created', () => {
		service = TestBed.inject(AuthStorageService);

		expect(service).toBeTruthy();
	});

	it('should get the customerSessionId, oAuthToken, and oAuthTokenExpiration from the localStorage', () => {
		service = TestBed.inject(AuthStorageService);

		expect(localStorageService.getItem).toHaveBeenCalledTimes(3);
		expect(localStorageService.getItem).toHaveBeenCalledWith(AuthStorageService.CUSTOMER_SESSION_ID);
		expect(localStorageService.getItem).toHaveBeenCalledWith(oAuthTokenExpKey);
		expect(localStorageService.getItem).toHaveBeenCalledWith(oAuthTokenKey);
	});

	describe('customerSessionId', () => {
		it('should get customerSessionId from localStorage', () => {
			service = TestBed.inject(AuthStorageService);

			expect(service.customerSessionId).toEqual(mockCustomerSessionId);
			expect(localStorageService.setItem).not.toHaveBeenCalledWith(AuthStorageService.CUSTOMER_SESSION_ID, mockCustomerSessionId);
		});

		it('should create and save new customer session ID if not available from localStorage', () => {
			sessionIdAvailable = false;

			service = TestBed.inject(AuthStorageService);

			expect(service.customerSessionId).toEqual(jasmine.any(String));
			expect(service.customerSessionId).not.toEqual(mockCustomerSessionId);
			expect(localStorageService.setItem).toHaveBeenCalledWith(AuthStorageService.CUSTOMER_SESSION_ID, jasmine.any(String));
			expect(localStorageService.setItem).not.toHaveBeenCalledWith(AuthStorageService.CUSTOMER_SESSION_ID, mockCustomerSessionId);
			expect(localStorageService.setItem).toHaveBeenCalledTimes(1);
		});
	});

	describe('loggedInStatus', () => {
		it('should return true for logged in status', () => {
			service = TestBed.inject(AuthStorageService);
			service.getOAuthToken();
			service.loggedInStatus.subscribe(response => {
				expect(response).toBeTruthy();
			});

			service.authValues.subscribe(response => {
				expect(response.authToken).toEqual(mockOAuthToken);
				expect(response.customerSessionId).toEqual(mockCustomerSessionId);
			});
		});

		it('should return false for logged out status', () => {
			oAuthTokenExpired = true;

			service = TestBed.inject(AuthStorageService);

			service.getOAuthToken();
			service.loggedInStatus.subscribe(response => {
				expect(response).toBeFalsy();
			});

			service.authValues.subscribe(response => {
				expect(response.authToken).toEqual(null);
				expect(response.customerSessionId).toEqual(mockCustomerSessionId);
			});
		});
	});

	describe('getOAuthToken', () => {
		it('should get valid o-auth-token and o-auth-token-expiration from localStorage', () => {
			service = TestBed.inject(AuthStorageService);

			expect(service.getOAuthToken()).toEqual(mockOAuthToken);
			expect(localStorageService.removeItem).not.toHaveBeenCalled();
		});

		it(
			'should get expired o-auth-token and o-auth-token-expiration from localStorage. ' +
				'when user tries to use token, it should be removed from localStorage.',
			() => {
				oAuthTokenExpired = true;

				service = TestBed.inject(AuthStorageService);

				expect(service.getOAuthToken()).toEqual(null);
				expect(localStorageService.removeItem).toHaveBeenCalledTimes(2);
				expect(localStorageService.removeItem).toHaveBeenCalledWith(oAuthTokenKey);
				expect(localStorageService.removeItem).toHaveBeenCalledWith(oAuthTokenExpKey);
			}
		);

		it('should fail to get o-auth-token and o-auth-token-expiration from localStorage', () => {
			oAuthDataAvailable = false;

			service = TestBed.inject(AuthStorageService);

			expect(service.getOAuthToken()).toEqual(null);
			expect(localStorageService.removeItem).not.toHaveBeenCalled();
		});
	});

	describe('storeOAuthToken', () => {
		it('should remove oAuthToken and its expiration from localStorage and set variables to null', () => {
			service = TestBed.inject(AuthStorageService);

			service.storeOAuthToken({ accessToken: null, expirationDate: null });

			expect(service.getOAuthToken()).toEqual(null);
			expect(localStorageService.removeItem).toHaveBeenCalledTimes(2);
			expect(localStorageService.removeItem).toHaveBeenCalledWith(oAuthTokenKey);
			expect(localStorageService.removeItem).toHaveBeenCalledWith(oAuthTokenExpKey);
		});
	});

	describe('generateCustomerSessionId', () => {
		it('should create new customer session ID and save in localStorage', () => {
			sessionIdAvailable = false;

			service = TestBed.inject(AuthStorageService);

			expect(service.customerSessionId).toEqual(jasmine.any(String));
			expect(service.customerSessionId).not.toEqual(mockCustomerSessionId);
			expect(localStorageService.setItem).toHaveBeenCalledWith(AuthStorageService.CUSTOMER_SESSION_ID, jasmine.any(String));
			expect(localStorageService.setItem).not.toHaveBeenCalledWith(AuthStorageService.CUSTOMER_SESSION_ID, mockCustomerSessionId);
			expect(localStorageService.setItem).toHaveBeenCalledTimes(1);
		});
	});
});

/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { CookieStorageService } from './cookie-storage.service';

describe('CookieStorageService', () => {
	class MockDocument {
		domain = 'mock.domain.com';

		cookie = '';
	}

	let service: CookieStorageService;
	let document: Document;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [CookieStorageService, { provide: DOCUMENT, useClass: MockDocument }],
		});

		document = TestBed.inject(DOCUMENT);

		service = TestBed.inject(CookieStorageService);
	});

	it('should create', () => {
		expect(service).toBeDefined();
	});

	describe('raiseDomain()', () => {
		it('should move a subdomain to the root domain', () => {
			document.domain = 'sub.domain.com';

			service.raiseDomain();

			expect(document.domain).toEqual('domain.com');
		});

		it('should not affect a root domain', () => {
			document.domain = 'domain.com';

			service.raiseDomain();

			expect(document.domain).toEqual('domain.com');
		});
	});

	describe('get()', () => {
		beforeEach(() => {
			document.cookie = ['cookieName=cookieValue1;', 'cookieName=cookieValue2;', 'altCookieName=altCookieValue;'].join(' ');
		});

		it('should retrieve all cookie values for a given cookie name', () => {
			const actual = service.get('cookieName');

			expect(actual).toEqual(['cookieValue1', 'cookieValue2']);
		});

		it('should return an empty array if no cookies for the given name', () => {
			const actual = service.get('notCookieName');

			expect(actual).toEqual([]);
		});

		it('should return an empty array if no cookies', () => {
			document.cookie = '';

			const actual = service.get('cookieName');

			expect(actual).toEqual([]);
		});
	});

	describe('set()', () => {
		it('should write the cookie name and value and secure flag', () => {
			service.set('cookieName', 'mock-value');

			expect(document.cookie).toEqual('cookieName=mock-value; domain=mock.domain.com; path=/; Secure;');
		});
	});

	describe('remove()', () => {
		it('should write the cookie name with no value, and a max age of -1', () => {
			service.remove('cookieName');

			expect(document.cookie).toEqual('cookieName=; domain=mock.domain.com; path=/; max-age=-1; Secure;');
		});
	});
});

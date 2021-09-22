import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { PlatformContextService } from '../platform-context/platform-context.service';

import { CookieOptions, ICookieStorageServcie } from './cookie-storage.service.interface';

/**
 * Allows setting and retrieving of cookies
 */
@Injectable({ providedIn: 'root' })
export class CookieStorageService implements ICookieStorageServcie {
	constructor(@Inject(DOCUMENT) private document: Document, private platformContext: PlatformContextService) {}

	/** Set document domain to the root domain */
	raiseDomain(): void {
		this.platformContext.browserOnly = (): void => {
			const fullDomain = this.document.domain;
			try {
				this.document.domain = fullDomain.split('.').slice(-2).join('.');
			} catch (err) {
				// security error - shared mode not allowed
			}
		};
	}

	get(key: string): Array<string> {
		if (this.platformContext.onBrowser) {
			const cookieTuples = this.document.cookie
				.split(';')
				.map(cookieString => cookieString.split('='))
				.filter((cookieTuple: [string, string]) => cookieTuple[0]?.trim() === key);

			return cookieTuples.map(([name, value]) => decodeURIComponent(value));
		} else {
			return [];
		}
	}

	set(key: string, value: string, opts: CookieOptions = {}): void {
		this.platformContext.browserOnly = (): void => {
			const cookieParts = [`${key}=${encodeURIComponent(value)}`, `domain=${this.document.domain}`, 'path=/'];

			if (typeof opts?.maxAge === 'number') {
				cookieParts.push(`max-age=${opts.maxAge.toFixed()}`);
			}

			cookieParts.push('Secure;');

			this.document.cookie = cookieParts.join('; ');
		};
	}

	remove(key: string): void {
		this.set(key, '', { maxAge: -1 });
	}
}

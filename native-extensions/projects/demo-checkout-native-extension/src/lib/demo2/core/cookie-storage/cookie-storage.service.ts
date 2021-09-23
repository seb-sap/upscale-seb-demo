import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { PlatformContextService } from "../platform-context/platform-context.service";
import { CookieOptions, ICookieStorageServcie } from "./cookie-storage.service.interface";

@Injectable({ providedIn: 'root' })
export class CookieStorageService  implements ICookieStorageServcie {
    constructor(private platformContext: PlatformContextService, @Inject(DOCUMENT) document?: any) {
		this._document = document as Document;
	}

    private _document?: Document;

    /** Set document domain to the root domain */
	raiseDomain(): void {
		this.platformContext.browserOnly = (): void => {
			const fullDomain = this._document.domain;
			try {
				this._document.domain = fullDomain.split('.').slice(-2).join('.');
			} catch (err) {
				// security error - shared mode not allowed
			}
		};
	}

	get(key: string): Array<string> {
		if (this.platformContext.onBrowser) {
			const cookieTuples = this._document.cookie
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
			const cookieParts = [`${key}=${encodeURIComponent(value)}`, `domain=${this._document.domain}`, 'path=/'];

			if (typeof opts?.maxAge === 'number') {
				cookieParts.push(`max-age=${opts.maxAge.toFixed()}`);
			}

			cookieParts.push('Secure;');

			this._document.cookie = cookieParts.join('; ');
		};
	}

	remove(key: string): void {
		this.set(key, '', { maxAge: -1 });
	}
}
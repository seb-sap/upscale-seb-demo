import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class PlatformContextService {
	readonly onBrowser: boolean;
	readonly onServer: boolean;

	constructor(@Inject(PLATFORM_ID) private platformId: Object) {
		this.onBrowser = isPlatformBrowser(this.platformId);
		this.onServer = isPlatformServer(this.platformId);
	}

	/**
	 * Setter to have less parentheses.
	 */
	set browserOnly(callback: () => void) {
		if (this.onBrowser) {
			callback();
		}
	}

	/**
	 * Setter to have less parentheses.
	 */
	set serverOnly(callback: () => void) {
		if (this.onServer) {
			callback();
		}
	}
}

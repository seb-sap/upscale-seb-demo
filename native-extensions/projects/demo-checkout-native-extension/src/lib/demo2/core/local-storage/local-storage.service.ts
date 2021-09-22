import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * A service that will store data in the browser.
 */
@Injectable({ providedIn: 'root' })
export class LocalStorageService implements Partial<Storage> {
	/**
	 * The number of keys currently stored in LocalStorage.
	 */
	get length(): number {
		if (this.localStorage) {
			return this.localStorage.length;
		}
		return 0;
	}

	private localStorage: Storage;

	constructor(@Inject(PLATFORM_ID) private platformId) {
		if (isPlatformBrowser(platformId)) {
			this.localStorage = localStorage;
		} else {
			this.localStorage = new (class MockStorage {
				store = {};

				clear(): void {
					this.store = {};
				}

				getItem(keyName: string): string | null {
					return this.store[keyName];
				}

				key(index: number): string | null {
					return Object.keys(this.store)[index];
				}

				removeItem(keyName: string): void {
					delete this.store[keyName];
				}

				setItem(keyName: string, value: string): void {
					this.store[keyName] = value;
				}

				get length(): number {
					return Object.keys(this.store).length;
				}
			})();
		}
	}

	/**
	 * Clears the LocalStorage of all its keys.
	 */
	clear(): void {
		this.localStorage?.clear();
	}

	/**
	 * @param keyName of the data to get.
	 * @returns the value mapped to the key name.
	 */
	getItem(keyName: string): string | null {
		if (this.localStorage) {
			return this.localStorage.getItem(keyName);
		}
		return null;
	}

	/**
	 * @param index of the value to get.
	 * @returns the value at the index.
	 */
	key(index: number): string | null {
		if (this.localStorage) {
			return this.localStorage.key(index);
		}
		return null;
	}

	/**
	 * @param keyName of the value to remove.
	 */
	removeItem(keyName: string): void {
		this.localStorage?.removeItem(keyName);
	}

	/**
	 * @param keyName to access/modify the value to be stored.
	 * @param keyValue to be stored.
	 */
	setItem(keyName: string, keyValue: string): void {
		this.localStorage?.setItem(keyName, keyValue);
	}
}

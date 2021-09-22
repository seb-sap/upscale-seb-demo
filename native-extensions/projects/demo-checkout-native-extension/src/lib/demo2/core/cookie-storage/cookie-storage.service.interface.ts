/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

export interface CookieOptions {
	/** seconds */
	maxAge?: number;
}

export interface ICookieStorageServcie {
	raiseDomain(): void;

	get(key: string): Array<string>;

	set(key: string, value: string, opts?: { maxAge?: number }): void;

	remove(key: string): void;
}

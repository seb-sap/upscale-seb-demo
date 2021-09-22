/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

export class MockLocalStorageService implements Partial<Storage> {
	length = 0;

	private localStorage: Storage;

	clear(): void {
		throw new Error('Need to stub.');
	}

	getItem(keyName: string): string {
		throw new Error('Need to stub.');
	}

	key(index: number): string {
		throw new Error('Need to stub.');
	}

	removeItem(keyName: string): void {
		throw new Error('Need to stub.');
	}

	setItem(keyName: string, keyValue: string): void {
		throw new Error('Need to stub.');
	}
}

/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

/**
 * Explicitly produces a tuple array from the provided arguments
 */
export function tuple<T extends Array<any>>(...data: T): T {
	return data;
}

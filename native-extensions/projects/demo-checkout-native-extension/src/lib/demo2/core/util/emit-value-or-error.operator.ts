/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Either<T, E> {
	value: T;
	error?: E;
}

/**
 * Converts an observable emit/error to a wrapped emit value.  This allows you to process results
 * in a unified manner.
 *
 * This is most useful with forkJoin, when you want to complete all the requests even if there are errors.
 */
export function emitValueOrError<E = any>(): <T>(source: Observable<T>) => Observable<Either<T, E>> {
	return <T>(source: Observable<T>): Observable<Either<T, E>> =>
		source.pipe(
			map(value => <Either<T, E>>{ value: value }),
			catchError(error => of<Either<T, E>>({ value: undefined, error: error }))
		);
}

/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

import { Observable, Subject } from 'rxjs';

import { Either, emitValueOrError } from './emit-value-or-error.operator';

describe('emitValueOrError()', () => {
	let source: Subject<number>;
	let stream: Observable<Either<number, any>>;

	beforeEach(() => {
		source = new Subject();

		stream = source.pipe(emitValueOrError());
	});

	it('should transfrom source emit value to wrapped value object and emit', () => {
		let actual: Either<number, any>;
		const expected: Either<number, any> = { value: 1 };

		stream.subscribe(
			emit => (actual = emit),
			error => fail()
		);

		source.next(1);
		expect(actual).toEqual(expected);
	});

	it('should transfrom source error value to wrapped value object and emit', () => {
		let actual: Either<number, any>;
		const expected: Either<number, any> = { value: undefined, error: true };

		stream.subscribe(
			emit => (actual = emit),
			error => fail()
		);

		source.error(true);
		expect(actual).toEqual(expected);
	});

	it('should complete', done => {
		stream.subscribe(
			emit => fail(),
			error => fail(),
			() => {
				// Karma complains without expectation.
				expect(true).toBe(true);
				done();
			}
		);

		source.complete();
	});
});

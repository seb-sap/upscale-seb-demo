import { ConnectableObservable, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Order } from '@caas/service-client-angular';
import { publishReplay, take } from 'rxjs/operators';

import { ISessionCartService } from './session-cart.service.interface';

/**
 * Singleton who provides dependents the current cart.
 */
@Injectable({ providedIn: 'root' })
export class SessionCartService implements ISessionCartService {
	private readonly cart: Observable<Order | null>;
	private readonly cartStream: Subject<Order | null>;

	private currentCart: Order | null;

	constructor() {
		this.cartStream = new Subject<Order | null>();

		const cart: ConnectableObservable<Order | null> = this.cartStream
			.asObservable()
			.pipe(publishReplay(1)) as ConnectableObservable<Order | null>;

		this.cart = cart.pipe(take(1));

		cart.connect();
	}

	get(): Observable<Order | null> {
		return this.cart;
	}

	getImmediately(): Order | null {
		return this.currentCart;
	}

	set(cart: Order | null): void {
		this.cartStream.next(cart);
		this.currentCart = cart;
	}
}

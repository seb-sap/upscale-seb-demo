/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
import { Observable } from 'rxjs';
import { Order } from '@caas/service-client-angular';

export interface ISessionCartService {
	get(): Observable<Order | null>;

	getImmediately(): Order | null;

	set(cart: Order): void;
}

/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
import { Observable } from 'rxjs';
import { Order } from '@caas/service-client-angular';

import { NULL } from '../util';

export class MockSessionCartService {
	get(): Observable<Order | null> {
		return NULL;
	}

	getImmediately(): Order | null {
		return null;
	}

	set(cart: Order): void {}
}

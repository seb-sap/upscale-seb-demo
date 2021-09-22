/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
import { IApplicationLoggerService } from './application-logger.service.interface';

export class MockApplicationLoggerService implements IApplicationLoggerService {
	log(content: Object | string): void {
		throw new Error('Please stub');
	}
}

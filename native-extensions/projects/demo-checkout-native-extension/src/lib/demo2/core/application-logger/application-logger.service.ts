import { AppLoggerService } from '@caas/service-client-angular/application';
import { Injectable } from '@angular/core';

import { IApplicationLoggerService } from './application-logger.service.interface';

@Injectable({
	providedIn: 'root',
})
export class ApplicationLoggerService implements IApplicationLoggerService {
	private static LOG_ENABLED = true;
	constructor(private appLoggerService: AppLoggerService) {}

	log(content: Object | string): void {
		if (ApplicationLoggerService.LOG_ENABLED) {
			let contentString: string;
			if (typeof content === 'object') {
				contentString = JSON.stringify(content, this.getCircularReplacer());
			} else {
				contentString = content;
			}
			this.appLoggerService.debugLog(contentString).subscribe({ error: () => {} });
		}
	}

	private getCircularReplacer(): ((this: any, key: string, value: any) => any) | undefined {
		const seen = new WeakSet();
		return (key, value): string | undefined => {
			if (typeof value === 'object' && value !== null) {
				if (seen.has(value)) {
					return;
				}
				seen.add(value);
			}
			return value;
		};
	}
}

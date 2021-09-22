/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
import { AppLoggerService, MockAppLoggerService } from '@caas/service-client-angular/application';
import { TestBed } from '@angular/core/testing';
import { debugOptions } from 'environments/environment';

import { VOID } from '../util';

import { ApplicationLoggerService } from './application-logger.service';

describe('ApplicationLoggerService', () => {
	let service: ApplicationLoggerService;

	let appLoggerService: AppLoggerService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [{ provide: AppLoggerService, useClass: MockAppLoggerService }],
		});
		service = TestBed.inject(ApplicationLoggerService);
		appLoggerService = TestBed.inject(AppLoggerService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should truncate cyclical objects before converting to string', () => {
		spyOn(appLoggerService, 'debugLog').and.returnValue(VOID);

		debugOptions.logEnabled = true;

		const cyclicObject = {
			initProp: 'initPropStr',
			initObject: {},
		};

		const interObject = {
			interObjectProp: 'interObjectPropStr',
			cyclicObject,
		};

		cyclicObject['initObject'] = { interProp: 'interPropStr', interObject };

		service.log(cyclicObject);

		expect(appLoggerService.debugLog).toHaveBeenCalledOnceWith(
			'{"initProp":"initPropStr","initObject":{"interProp":"interPropStr","interObject":{"interObjectProp":"interObjectPropStr"}}}'
		);
	});
});

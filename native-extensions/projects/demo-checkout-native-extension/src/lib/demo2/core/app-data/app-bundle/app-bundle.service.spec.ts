/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
import { ApplicationConfig } from 'bootstrap/application-configuration.model';
import { ApplicationService, IPwaBundleConfiguration, MockApplicationService } from '@caas/service-client-angular';
import { TestBed } from '@angular/core/testing';
import { concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { AppBundleService } from './app-bundle.service';

describe('AppBundleService', () => {
	let service: AppBundleService;

	let applicationService: ApplicationService;

	let sampleBundle: IPwaBundleConfiguration;

	beforeEach(() => {
		sampleBundle = {
			editionId: 'edition001',
			experienceId: 'experience001',
			deviceDiscovery: false,
			payMerchants: [],
		};

		TestBed.configureTestingModule({
			providers: [
				{ provide: ApplicationConfig, useValue: { BUNDLE_ID: 'foo' } },
				{ provide: ApplicationService, useClass: MockApplicationService },
			],
		});
		service = TestBed.inject(AppBundleService);

		applicationService = TestBed.inject(ApplicationService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should retrieve the first time', done => {
		spyOn(applicationService, 'getPlatformBundle').and.returnValue(of(sampleBundle));

		service.get(true).subscribe(bundle => {
			expect(bundle).toBe(sampleBundle);
			expect(applicationService.getPlatformBundle).toHaveBeenCalledTimes(1);

			done();
		});
	});

	it('should cache the second time', done => {
		spyOn(applicationService, 'getPlatformBundle').and.returnValue(of(sampleBundle));

		service
			.get()
			.pipe(concatMap(() => service.get(true)))
			.subscribe(bundle => {
				expect(bundle).toBe(sampleBundle);
				expect(applicationService.getPlatformBundle).toHaveBeenCalledTimes(1);

				done();
			});
	});
});

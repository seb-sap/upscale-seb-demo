/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
import {
	ExperienceService,
	InternationalizationService,
	MockExperienceService,
	MockInternationalizationService,
	MockTemplateService,
	TemplateService,
	createMockExperience,
	createMockTemplate,
} from '@caas/service-client-angular';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AppData } from '../app-data.model';
import { LocaleService } from '../localization';
import { MockLocaleService } from '../localization/locale.service.mock';
import { NULL } from '../util';

import { AppHelperService } from './app-helper.service';
import { OrderExperienceService } from './order-experience/order-experience.service';
import { createMockAppBundleServiceProvider } from './app-bundle/app-bundle.service.mock';

describe(AppHelperService.name, () => {
	let service: AppHelperService;

	let orderExperienceService: OrderExperienceService;
	let experienceService: ExperienceService;
	let templateService: TemplateService;
	let localeService: LocaleService;

	beforeEach(() => {
		orderExperienceService = jasmine.createSpyObj('OrderExperienceService', ['cleanup', 'getExperienceId', 'getAppData']);

		TestBed.configureTestingModule({
			providers: [
				createMockAppBundleServiceProvider(),
				{ provide: OrderExperienceService, useValue: orderExperienceService },
				{ provide: ExperienceService, useClass: MockExperienceService },
				{ provide: InternationalizationService, useClass: MockInternationalizationService },
				{ provide: TemplateService, useClass: MockTemplateService },
				{ provide: LocaleService, useClass: MockLocaleService },
			],
		});

		orderExperienceService = TestBed.inject(OrderExperienceService);
		experienceService = TestBed.inject(ExperienceService);
		templateService = TestBed.inject(TemplateService);
		localeService = TestBed.inject(LocaleService);

		service = TestBed.inject(AppHelperService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('when getting an alternative experience', () => {
		let appData: AppData;

		beforeEach(() => {
			appData = new AppData();
			appData.experienceId = 'experience001';
		});

		afterEach(() => {
			expect(orderExperienceService.cleanup).toHaveBeenCalled();
		});

		it('should resolve nothing from the order', done => {
			(<jasmine.Spy>orderExperienceService.getExperienceId).and.returnValue(NULL);

			service.getAlternativeAppData(appData).subscribe(result => {
				expect(result).toBeNull();

				done();
			});
		});

		it('should not resolve with the same experience ID passed in', done => {
			(<jasmine.Spy>orderExperienceService.getExperienceId).and.returnValue(of('experience001'));

			service.getAlternativeAppData(appData).subscribe(result => {
				expect(result).toBeNull();

				done();
			});
		});

		it('should resolve from the order', done => {
			(<jasmine.Spy>orderExperienceService.getExperienceId).and.returnValue(of('experience002'));
			(<jasmine.Spy>orderExperienceService.getAppData).and.callFake((original, { experience }) => {
				const newData = original.clone();
				newData.experience = experience;

				return newData;
			});

			const ex = createMockExperience('experience002');
			const tmpls = [createMockTemplate('template001'), createMockTemplate('template002')];

			spyOn(experienceService, 'get').and.returnValue(of(ex));
			spyOn(localeService, 'getCurrencyCode').and.returnValue(of('USD'));
			spyOn(localeService, 'getCurrencyLocaleId').and.returnValue(of('en-US'));
			spyOn(localeService, 'getLanguageLocaleId').and.returnValue(of('en-US'));
			spyOn(templateService, 'getAll').and.returnValue(of(tmpls));

			service.getAlternativeAppData(appData).subscribe(result => {
				expect(result).not.toBe(appData);
				expect(result).not.toBeFalsy();

				expect(result.experience).toBe(ex);

				done();
			});
		});

		it('should resolve once and only once', done => {
			(<jasmine.Spy>orderExperienceService.getExperienceId).and.returnValue(of('experience002'));
			(<jasmine.Spy>orderExperienceService.getAppData).and.callFake((original, { experience }) => {
				const newData = original.clone();
				newData.experience = experience;

				return newData;
			});

			const ex = createMockExperience('experience002');
			const templates = [createMockTemplate('template001'), createMockTemplate('template002')];

			spyOn(experienceService, 'get').and.returnValue(of(ex));
			spyOn(templateService, 'getAll').and.returnValue(of(templates));

			service.getAlternativeAppData(appData).subscribe(firstResult => {
				service.getAlternativeAppData(appData).subscribe(secondResult => {
					expect(firstResult).toEqual(secondResult);
					expect(experienceService.get).toHaveBeenCalledTimes(1);
					expect(templateService.getAll).toHaveBeenCalledTimes(1);

					done();
				});
			});
		});
	});
});

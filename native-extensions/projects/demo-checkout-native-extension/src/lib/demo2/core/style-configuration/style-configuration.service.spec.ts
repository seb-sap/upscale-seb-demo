/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */

import { MockStyleOptionsService, StyleOptionsService, UpscaleStylingAttributes, createMockExperience } from '@caas/service-client-angular';
import { Subject, of } from 'rxjs';
import { TestBed } from '@angular/core/testing';

import { AppData } from 'app/core/app-data.model';
import { AppDataResolver } from 'app/app-routing/app-data-resolver.service';
import { MockAppDataResolver } from 'app/app-routing/app-data-resolver.service.mock';
import { createMockAppData } from 'app/core/app-data/app-data.service.mock';

import { StyleConfigurationService } from './style-configuration.service';

describe('StyleConfigurationService', () => {
	let service: StyleConfigurationService;

	let styleOptionService: StyleOptionsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [StyleConfigurationService, { provide: StyleOptionsService, useClass: MockStyleOptionsService }],
		});

		styleOptionService = TestBed.inject(StyleOptionsService);
	});

	it('should be created', () => {
		service = TestBed.inject(StyleConfigurationService);
		expect(service).toBeTruthy();
	});

	it('should adapt server values to CSS-valid properties', () => {
		const configuration = {
			alpha: '0F',
			iOSFontName: undefined,
			androidFontName: undefined,
			color: '#FEFEFE',
			fontFamilyKey: undefined,
			fontSize: 14,
			lineHeight: 16,
		};

		service = TestBed.inject(StyleConfigurationService);

		expect(service.adapt(configuration)).toEqual('font-size: 14px;line-height: 16px;color: #FEFEFE0F;');

		delete configuration.alpha;

		expect(service.adapt(configuration)).toEqual('font-size: 14px;line-height: 16px;color: #FEFEFE;');

		delete configuration.color;
		configuration.alpha = 'AF';

		expect(service.adapt(configuration)).toEqual(`font-size: 14px;line-height: 16px;opacity: ${175 / 255};`);
	});

	it('should convert CSS style string to css style object', () => {
		service = TestBed.inject(StyleConfigurationService);

		const style1 = 'background-color: #F5F5F5FF';
		const style2 = 'color: #000000FF;font-family:Roboto; font-weight: 700;';
		expect(service.convertStyleStringToObject(style1)).toEqual({ 'background-color': '#F5F5F5FF' });
		expect(service.convertStyleStringToObject(style2)).toEqual({ color: '#000000FF', 'font-family': 'Roboto', 'font-weight': '700' });
	});

	it("should interpret the 'color' and 'alpha' properties as background color", () => {
		const configuration = {
			alpha: '0F',
			iOSFontName: undefined,
			androidFontName: undefined,
			color: '#EFEFEF',
			fontFamilyKey: undefined,
			fontSize: 14,
			lineHeight: 16,
		};

		service = TestBed.inject(StyleConfigurationService);

		expect(service.adapt(configuration, { color: 'background-color' })).toEqual(
			'font-size: 14px;line-height: 16px;background-color: #EFEFEF0F;'
		);
	});

	describe('when creating a style element', () => {
		let appDataStream: Subject<AppData>;
		let stylingAttributes: UpscaleStylingAttributes;
		let defaults: UpscaleStylingAttributes;
		let appData: AppData;

		beforeEach(() => {
			appDataStream = new Subject<AppData>();
			stylingAttributes = {
				brandStyles: {
					backgroundColor: {
						color: '#FFFFFF',
						alpha: 'FF',
					},
					desktopLogoUrl: 'https://example.com',
				},
				components: {
					IMAGE: {
						contentHeadline: {
							alpha: 'FF',
							color: '#FFFFFF',
							fontFamilyKey: 'ROBOTO_LIGHT',
							fontSize: 10,
							lineHeight: 10,
						},
						contentSubHeadline: {
							alpha: '00',
							color: '#AAAAAA',
							fontFamilyKey: 'ROBOTO_REGULAR',
							fontSize: 14,
							lineHeight: 14,
						},
					},
				},
				notificationStyles: {
					bannerBorder: {
						alpha: 'FF',
						color: '#FFFFFF',
						radius: 3,
						width: 2,
					},
				},
				discountStyles: {
					recurrenceFont: {
						alpha: 'FF',
						color: '#000',
						fontFamilyKey: 'ROBOTO_MEDIUM',
					},
				},
			};

			defaults = {
				brandStyles: {
					backgroundColor: {
						color: '#000',
						alpha: '00',
					},
					desktopLogoUrl: 'https://example.com/2',
				},
				components: {
					IMAGE: {
						contentHeadline: {
							alpha: '00',
							color: '#000',
							fontFamilyKey: 'ROBOTO_MEDIUM',
							fontSize: 14,
							lineHeight: 14,
						},
						contentSubHeadline: {
							alpha: 'FF',
							color: '#000',
							fontFamilyKey: 'ROBOTO_MEDIUM',
							fontSize: 12,
							lineHeight: 12,
						},
					},
				},
				notificationStyles: {
					bannerBorder: {
						alpha: '00',
						color: '#000',
						radius: 3,
						width: 2,
					},
				},
				discountStyles: {
					recurrenceFont: {
						alpha: 'FF',
						color: '#000',
						fontFamilyKey: 'ROBOTO_MEDIUM',
					},
				},
			};

			appData = createMockAppData({
				stylingAttributes: stylingAttributes,
			});

			spyOn(styleOptionService, 'getDefaults').and.returnValue(of(defaults));

			service = TestBed.inject(StyleConfigurationService);
		});

		it('should create it on root level', () => {
			service.createGlobalStyleSheet(appData);

			appDataStream.next(appData);

			const styleSheets = document.head.querySelectorAll('style');
			const styleElement = styleSheets.item(styleSheets.length - 1);
			const sheet = <CSSStyleSheet>styleElement.sheet;

			expect(sheet.cssRules.length).toBe(5);

			expect(sheet.cssRules.item(0).cssText).toBe('#upscale .application-background-color { color: rgb(255, 255, 255); }');
			expect(sheet.cssRules.item(1).cssText).toBe(
				'#upscale .banner-border { border-radius: 3px; border: 2px solid rgb(255, 255, 255); }'
			);
			expect(sheet.cssRules.item(2).cssText).toBe('#upscale .discount-recurrence-font { font-family: Roboto; font-weight: 500; }');
			expect(sheet.cssRules.item(3).cssText).toBe(
				'#upscale .image-component-content-headline { font-size: 10px; line-height: 10px; color: rgb(255, 255, 255); ' +
					'font-family: Roboto; font-weight: 300; }'
			);
			expect(sheet.cssRules.item(4).cssText).toBe(
				'#upscale .image-component-content-subheadline { font-size: 14px; line-height: 14px; color: rgba(170, 170, 170, 0); ' +
					'font-family: Roboto; font-weight: 400; }'
			);
		});

		it('should create even if one of the styling configurations is missing', () => {
			delete stylingAttributes?.components;

			service.createGlobalStyleSheet(appData);

			appDataStream.next(appData);

			const styleSheets = document.head.querySelectorAll('style');
			const styleElement = styleSheets.item(styleSheets.length - 1);
			const sheet = <CSSStyleSheet>styleElement.sheet;

			expect(sheet.cssRules.length).toBe(5);

			expect(sheet.cssRules.item(0).cssText).toBe('#upscale .application-background-color { color: rgb(255, 255, 255); }');
		});
	});
	describe('when setting the favicon', () => {
		let appData: AppData;

		beforeEach(() => {
			appData = createMockAppData({
				experience: createMockExperience('experience001'),
			});
		});

		afterEach(() => {
			const defaultFaviconElement = document.querySelectorAll("link[ rel ~= 'icon' i]");
			defaultFaviconElement.forEach(elem => {
				elem.parentNode.removeChild(elem);
			});
		});

		it('should replace the default favicon with the configured version', () => {
			// set default icon
			const linkElement = document.createElement('link');
			linkElement.setAttribute('rel', 'icon');
			linkElement.setAttribute('href', 'favicon.ico');
			document.head.appendChild(linkElement);

			appData.stylingAttributes = <any>{
				brandStyles: {
					pwaFaviconUrl: 'https://example.com/mockFavicon',
				},
			};

			service = TestBed.inject(StyleConfigurationService);

			service.setFavicon(appData);

			const faviconElement = document.querySelectorAll("link[ rel ~= 'icon' i]");
			expect(faviconElement[0]['href']).toBe('https://example.com/mockFavicon');
			expect(faviconElement[1]).toBe(undefined);
		});

		it('should not replace the default favicon if there is no configured version', () => {
			// set default icon
			const linkElement = document.createElement('link');
			linkElement.setAttribute('rel', 'icon');
			linkElement.setAttribute('href', 'favicon.ico');
			document.head.appendChild(linkElement);

			appData.stylingAttributes = <any>{
				brandStyles: {
					pwaFaviconUrl: null,
				},
			};

			service = TestBed.inject(StyleConfigurationService);

			service.setFavicon(appData);

			const faviconElement = document.querySelectorAll("link[ rel ~= 'icon' i]");
			expect(faviconElement[0]['href'].split('/')[3]).toBe('favicon.ico');
			expect(faviconElement[1]).toBe(undefined);
		});
	});
});

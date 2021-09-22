import { Color, ComponentStyleType, UIElementTextStyle } from '@caas/service-client-angular';

import { IStyleConfigurationService } from './style-configuration.service.interface';

export class MockStyleConfigurationService implements IStyleConfigurationService {
	/**
	 * @see ./style-configuration.service.interface.ts
	 */
	adapt(styleConfiguration: Color | UIElementTextStyle): string {
		return 'font-size: 14px; line-height: 14px; color: #FFFFFFFFF;';
	}

	convertStyleStringToObject(styleString: string): { [key: string]: string } {
		return { 'background-color': '#F5F5F5FF' };
	}

	create(): HTMLStyleElement {
		throw new Error('Please stub. MockStyleConfigurationService create');
	}

	/**
	 * @see ./style-configuration.service.interface.ts
	 */
	createGlobalStyleSheet(): void {}

	remove(): void {}

	/**
	 * @see ./style-configuration.service.interface.ts
	 */
	sanitizeStyleValue(value: string): string {
		return value;
	}

	/**
	 * @see ./style-configuration.service.interface.ts
	 */
	setFavicon(): void {}

	get componentStyles(): ComponentStyleType {
		return {
			IMAGE: {
				contentHeadline: {
					alpha: 'FF',
					color: '#FFFFFF',
					fontFamilyKey: 'ROBOTO_MEDIUM',
					androidFontName: 'Roboto-Medium',
					iOSFontName: 'Roboto-Medium',
					pwaFontName: 'ROBOTO_MEDIUM',
					lineHeight: 56,
					fontSize: 46,
				},
				contentSubHeadline: {
					alpha: 'FF',
					color: '#FFFFFF',
					fontFamilyKey: 'ROBOTO_MEDIUM',
					androidFontName: 'Roboto-Medium',
					iOSFontName: 'Roboto-Medium',
					pwaFontName: 'ROBOTO_MEDIUM',
					lineHeight: 24,
					fontSize: 16,
				},
			},
		};
	}
}

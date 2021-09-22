import { Color, ComponentStyle, ComponentType, UIElementTextStyle } from '@caas/service-client-angular';

import { AppData } from '../app-data.model';
import { StyleInterpreter } from './global-class-selectors.const';

/**
 * A service-layer helper to create a style sheet that will contain the rules for our component configuration.
 */
export interface IStyleConfigurationService {
	/**
	 * @param styleConfiguration of the UI element.
	 * @param interpreter object to handle ambiguities on how to translate certain configurations.
	 * @returns a string list of style properties.
	 */
	adapt(styleConfiguration: Color | UIElementTextStyle, interpreter?: StyleInterpreter): string;

	/**
	 * Creates a global style sheet that will configure the styles of the app.
	 * Is a nonce, meaning it should be called only once ideally at app startup.
	 */
	createGlobalStyleSheet(appData: AppData): void;

	/**
	 * Creates a new style element.
	 * @param componentType
	 * @param componentStyle
	 * @param styleElement that already exists.
	 */
	create(componentType: ComponentType, componentStyle: ComponentStyle, styleElement?: HTMLStyleElement): HTMLStyleElement;

	/**
	 * Removes the given style element from the document head.
	 */
	remove(styleElement: HTMLStyleElement): void;

	/**
	 * @param value of a CSS property.
	 * @returns the sanitized value in the case it is an executable piece of code or a url.
	 */
	sanitizeStyleValue(value: string): string;

	/**
	 * Get the configured favicon and set it
	 */
	setFavicon(appData: AppData): void;

	/**
	 * @param styleString of a CSS style string.
	 * @returns the CSS style object.
	 */
	convertStyleStringToObject(styleString: string): { [key: string]: string };
}

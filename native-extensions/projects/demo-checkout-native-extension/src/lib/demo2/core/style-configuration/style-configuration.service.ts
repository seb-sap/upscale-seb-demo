// FIXME...
import {
	Color,
	ComponentStyle,
	ComponentStyleType,
	ComponentType,
	FontFamily,
	LocalizedField,
	StyleOptionsService,
	UIElementBorderStyle,
	UIElementButtonStyleGroup,
	UIElementTextStyle,
	UpscaleStylingAttributes,
} from '@caas/service-client-angular';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { Inject, Injectable, SecurityContext } from '@angular/core';

import {
	ComponentClassSelectorsType,
	ExperienceStylingConfigurationMapType,
	// GlobalClassSelectors, // FIXME
	StyleInterpreter,
} from './global-class-selectors.const';
import { IStyleConfigurationService } from './style-configuration.service.interface';
import { AppData } from '../app-data.model';

@Injectable({
	providedIn: 'root',
})
export class StyleConfigurationService implements IStyleConfigurationService {
	private upscaleStylingAttributes: UpscaleStylingAttributes;
	private _componentStyles: ComponentStyleType;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private domSanitizer: DomSanitizer,
		private stylesOptionsService: StyleOptionsService
	) {
		this.stylesOptionsService.getDefaults().subscribe(defaultStyles => {
			this.upscaleStylingAttributes = defaultStyles;
		});
	}

	get componentStyles(): ComponentStyleType {
		return this._componentStyles;
	}

	/**
	 * @see ./style-configuration.service.interface.ts
	 */
	adapt(
		styleConfiguration: UIElementTextStyle | Color | UIElementBorderStyle | UIElementButtonStyleGroup | FontFamily,
		interpreter?: StyleInterpreter
	): string {
		let style = '';

		// We handle all properties as if they are optional. The typing is for the method's sake.
		const { alpha, color, fontSize, lineHeight, radius, width, fontFamilyKey, pwaFontName } = (styleConfiguration || {}) as any;

		if (fontSize) {
			style += this.createCSSDeclaration('font-size', `${fontSize}px`);
		}
		if (lineHeight) {
			style += this.createCSSDeclaration('line-height', `${lineHeight}px`);
		}
		if (radius) {
			style += this.createCSSDeclaration('border-radius', `${radius}px`);
		}
		if (color && typeof width === 'number') {
			// if all ingredients of border are present
			style += this.createBorderDeclaration(alpha, color, width);
		} else {
			// else see if color/background-color are present
			style += this.createColorDeclaration(alpha, color, interpreter);
		}
		if (fontFamilyKey) {
			style += this.createFontFamilyDeclaration(fontFamilyKey, pwaFontName);
		}
		return style;
	}

	/**
	 * @see ./style-configuration.service.interface.ts
	 */
	createGlobalStyleSheet(appData: AppData): void {
		// FIXME ?
	}

	/**
	 * @param componentStyle. To extend for other style types, overload this method.
	 * @returns the style element created with the specific style.
	 */
	create(componentType: ComponentType, componentStyle: ComponentStyle, styleElement?: HTMLStyleElement): HTMLStyleElement {
		if (!styleElement) {
			styleElement = this.document.createElement('style');
		}

		this.document.head.appendChild(styleElement);

		// FIXME ?
		// this.interpretComponentStyle(styleElement.sheet as CSSStyleSheet, componentType, componentStyle, GlobalClassSelectors.components);

		return styleElement;
	}

	remove(styleElement: HTMLStyleElement): void {
		this.document.head.removeChild(styleElement);
	}

	isButtonStyleGroup(
		styleConfig: UIElementTextStyle | Color | UIElementBorderStyle | UIElementButtonStyleGroup
	): styleConfig is UIElementButtonStyleGroup {
		return (styleConfig as UIElementButtonStyleGroup).text !== undefined;
	}

	setButtonStyleGroup(styleSheet: CSSStyleSheet, type: string, key: string, styleConfig: UIElementButtonStyleGroup): void {
		// FIXME?
	}

	/**
	 * @see ./style-configuration.service.interface.ts
	 */
	convertStyleStringToObject(styleString: string): { [key: string]: string } {
		const containerStyle = {};
		if (styleString) {
			const styles = styleString.split(';');
			styles.forEach(style => {
				const items = style.split(':');
				if (items.length === 2) {
					containerStyle[items[0].trim()] = items[1].trim();
				}
			});
		}
		return containerStyle;
	}

	/**
	 * @see ./style-configuration.service.interface.ts
	 */
	sanitizeStyleValue(value: string): string {
		return this.domSanitizer.sanitize(SecurityContext.STYLE, value);
	}

	/**
	 * @see ./style-configuration.service.interface.ts
	 */
	setFavicon(data: AppData): void {
		const iconUrl = data.stylingAttributes?.brandStyles?.pwaFaviconUrl;

		if (iconUrl) {
			// if there is a configured icon, remove any favicon in document head
			const defaultFaviconElement = this.document.querySelectorAll('link[rel=icon]');
			Array.from(defaultFaviconElement).forEach(elem => {
				elem.parentNode.removeChild(elem);
			});

			// insert the configured favicon
			const linkElement = this.document.createElement('link');
			linkElement.setAttribute('rel', 'icon');
			linkElement.setAttribute('href', iconUrl.toString());
			this.document.head.appendChild(linkElement);
		}
	}

	/**
	 * @param selector of the rule.
	 * @param style of the rule.
	 * @returns a string converying the rule.
	 */
	private createRule(selector: string, style: string): string {
		return `#upscale ${selector} { ${style} } `;
	}

	private insertToStyleSheet(styleSheet: CSSStyleSheet, classSelector: string, style: string): void {
		const ruleSelector = `.${classSelector}`;
		const { length } = styleSheet.cssRules;
		const rule = `#upscale ${ruleSelector} { ${style} } `;
		styleSheet.insertRule(rule, length);
	}

	private interpretConfiguration(
		map: { [key: string]: string },
		key: string,
		configuration: UIElementTextStyle | Color | UIElementBorderStyle | UIElementButtonStyleGroup
	): string {
		const classSelector = map[key];
		const ruleSelector = `.${classSelector}`;
		// const styleInterpreter = ClassSelectorInterpreters[classSelector]; // FIXME
		// const style = this.adapt(configuration, styleInterpreter); // FIXME

		// return this.createRule(ruleSelector, style); // FIXME
		return 'background-color'; // FIXME
	}

	private interpretDiscountStyle(
		styleSheet: CSSStyleSheet,
		map: { [key: string]: string | { [key: string]: string } },
		key: string,
		configuration: ExperienceStylingConfigurationMapType
	): void {
		// if not nested
		if (this.isConfiguration(configuration)) {
			const { length } = styleSheet.cssRules;
			const flatMap = map as { [key: string]: string };
			const rule = this.interpretConfiguration(flatMap, key, configuration);
			styleSheet.insertRule(rule, length);
		} else {
			// if nested
			const nestedStyleKeys = Object.keys(configuration);
			let selectedConfig: ExperienceStylingConfigurationMapType | string;

			for (const configKey of nestedStyleKeys) {
				selectedConfig = configuration[configKey];

				if (typeof selectedConfig !== 'string' && this.isConfiguration(selectedConfig)) {
					const { length } = styleSheet.cssRules;
					const flatMap = map[key] as { [key: string]: string };
					const rule = this.interpretConfiguration(flatMap, configKey, selectedConfig);
					styleSheet.insertRule(rule, length);
				}
			}
		}
	}

	private interpretComponentStyle(
		styleSheet: CSSStyleSheet,
		type: ComponentType,
		componentStyle: ComponentStyle,
		ComponentClassSelectors: ComponentClassSelectorsType
	): void {
		// FIXME ?
	}

	private createFontFamilyDeclaration(fontFamilyKey: FontFamily, pwaFontName: string): string {
		let font = '';
		if (fontFamilyKey === FontFamily.ROBOTO_BOLD) {
			font = 'font-family:Roboto; font-weight: 700;';
		} else if (fontFamilyKey === FontFamily.ROBOTO_LIGHT) {
			font = 'font-family:Roboto; font-weight: 300;';
		} else if (fontFamilyKey === FontFamily.ROBOTO_MEDIUM) {
			font = 'font-family:Roboto; font-weight: 500;';
		} else if (fontFamilyKey === FontFamily.ROBOTO_REGULAR) {
			font = 'font-family:Roboto; font-weight: 400;';
		} else if (fontFamilyKey === FontFamily.ROBOTO_ITALIC) {
			font = 'font-family:Roboto; font-weight: 400; font-style: italic;';
		} else if (fontFamilyKey === FontFamily.ROBOTO_BOLD_ITALIC) {
			font = 'font-family:Roboto; font-weight: 700; font-style: italic;';
		} else if (fontFamilyKey === FontFamily.ROBOTO_LIGHT_ITALIC) {
			font = 'font-family:Roboto; font-weight: 300; font-style: italic;';
		} else if (fontFamilyKey === FontFamily.ROBOTO_THIN) {
			font = 'font-family:Roboto; font-weight: 100;';
		} else if (fontFamilyKey === FontFamily.ROBOTO_THIN_ITALIC) {
			font = 'font-family:Roboto; font-weight: 100; font-style: italic;';
		} else if (fontFamilyKey === FontFamily.ROBOTO_CONDENSED) {
			font = 'font-family:Roboto Condensed; font-weight: 400;';
		} else if (fontFamilyKey === FontFamily.ROBOTO_CONDENSED_ITALIC) {
			font = 'font-family:Roboto Condensed; font-weight: 400; font-style: italic;';
		} else if (fontFamilyKey === FontFamily.ROBOTO_CONDENSED_BOLD) {
			font = 'font-family:Roboto Condensed; font-weight: 700;';
		} else if (fontFamilyKey === FontFamily.ROBOTO_CONDENSED_BOLD_ITALIC) {
			font = 'font-family:Roboto Condensed; font-weight: 700; font-style: italic;';
		} else if (fontFamilyKey === FontFamily.ROBOTO_BLACK) {
			font = 'font-family:Roboto; font-weight: 900;';
		} else if (fontFamilyKey === FontFamily.ROBOTO_BLACK_ITALIC) {
			font = 'font-family:Roboto; font-weight: 900; font-style: italic;';
		} else if (fontFamilyKey === FontFamily.ROBOTO_MEDIUM_ITALIC) {
			font = 'font-family:Roboto; font-weight: 500; font-style: italic;';
		} else if (fontFamilyKey === FontFamily.CUSTOM) {
			if (pwaFontName) {
				font = `font-family:${pwaFontName};`;
			} else {
				font = 'font-family:Roboto;';
			}
		} else {
			font = 'font-family:Roboto; font-weight: 400;';
		}
		return font;
	}

	/**
	 * @param propertyKey of the CSS declaration.
	 * @param propertyValue to set the property to, which we will sanitize.
	 * @returns the full CSS declaration. If "properyValue" is an unsafe value, then return an empty string;
	 */
	private createCSSDeclaration(propertyKey: string, properyValue: string): string {
		const sanitizedValue = this.sanitizeStyleValue(properyValue);
		if (sanitizedValue === 'unsafe') {
			return '';
		}
		return `${propertyKey}: ${sanitizedValue};`;
	}

	/**
	 * @param alpha of the color.
	 * @param color
	 * @param interpreter; we are only interested in the 'color' configuration.
	 *   The default 'color' shall be the CSS 'color'.
	 * @returns the CSS declaration to be made from the alpha and color.
	 *   Returns an empty string if neither value is safe or existing.
	 */
	private createColorDeclaration(
		alpha: string | undefined,
		color: string | undefined,
		interpreter: StyleInterpreter | undefined
	): string {
		const alphaUsable = !!alpha && this.isCSSValueSafe(alpha);
		const colorUsable = !!color && this.isCSSValueSafe(color);

		let colorPropertyKey = 'color';
		if (interpreter?.color) {
			colorPropertyKey = interpreter.color;
		}

		if (alphaUsable && colorUsable) {
			return this.createCSSDeclaration(colorPropertyKey, `${color}${alpha}`);
		} else if (colorUsable) {
			return this.createCSSDeclaration(colorPropertyKey, color.toString());
		} else if (alphaUsable) {
			const decimalOpacity = parseInt(alpha, 16);
			return this.createCSSDeclaration('opacity', `${decimalOpacity / 255}`);
		}

		return '';
	}

	private createBorderDeclaration(alpha: string | undefined, color: string | undefined, width: number | undefined): string {
		const colorUsable = !!color && this.isCSSValueSafe(color);

		if (colorUsable && typeof width === 'number') {
			/**
			 * Cannot use createCSSDeclaration because ->{width}px solid rgba({rgba value})<- is falsely declared as 'unsafe' by .sanitize()
			 * Instead we sanitize {width} and the {rgba} individually and return the raw string.
			 */
			const sanitizedWidth = this.sanitizeStyleValue(width.toString());
			return `border:${sanitizedWidth}px solid ${this.hexToRgba(color, alpha)};`;
		}
		return '';
	}

	/**
	 * @param value which the client wants to set as a property value.
	 * @returns whether the value is safe to put in a stylesheet.
	 */
	private isCSSValueSafe(value: string): boolean {
		return this.sanitizeStyleValue(value) !== 'unsafe';
	}

	private isConfiguration(
		configuration: UIElementTextStyle | Color | UIElementBorderStyle | UIElementButtonStyleGroup | LocalizedField | ComponentStyle
	): configuration is UIElementTextStyle | Color | UIElementBorderStyle | UIElementButtonStyleGroup {
		return 'fontFamilyKey' in configuration || 'color' in configuration || 'text' in configuration;
	}

	/**
	 * In order to include the opacity in the border color and alpha need to be parsed to rgba format.
	 * @param hexColor color hex value
	 * @param alpha alpha hex value
	 * @returns a sanitized string representing the rgba value
	 */
	private hexToRgba(hexColor: string, alpha?: string): string {
		const alphaUsable = !!alpha && this.isCSSValueSafe(alpha);
		const colorUsable = !!hexColor && this.isCSSValueSafe(hexColor);

		const hexArr = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);

		const rgbArr = hexArr
			? [parseInt(hexArr[1], 16).toFixed(), parseInt(hexArr[2], 16).toFixed(), parseInt(hexArr[3], 16).toFixed()]
			: null;

		if (alphaUsable && colorUsable && rgbArr) {
			const decimalOpacity = parseInt(alpha, 16);
			rgbArr.push((decimalOpacity / 255).toFixed(3));
			return this.sanitizeStyleValue(`rgba(${rgbArr.join(', ')})`);
		} else {
			return this.sanitizeStyleValue(hexColor);
		}
	}
}

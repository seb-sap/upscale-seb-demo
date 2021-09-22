import {
	Color,
	ComponentStyle,
	ComponentType,
	ExperienceComponentType,
	LocalizedField,
	UIElementBorderStyle,
	UIElementButtonStyleGroup,
	UIElementTextStyle,
} from '@caas/service-client-angular';

// FIXME?
// import { Announcement } from './announcement-selectors.const';
// import { Application } from './application-selectors.const';
// import { AttributeSets } from './attribute-sets-selectors.const';
// import { Banner } from './banner-selectors.const';
// import { Browse } from './browse-selectors.const';
// import { Cart } from './cart-selectors.const';
// import { ContentSlot } from './content-slot-selectors.const';
// import { Discount } from './discount-selectors.const';
// import { Image } from './image-selectors.const';
// import { IncentiveMessage } from './incentive-messages-selectors.const';
// import { ProductDetail } from './product-detail-selectors.const';
// import { StoryBook } from './story-book-selectors.const';
// import { TailoredSets } from './tailored-sets-selectors.const';

/**
 * A configuration object that determines how to interpret configurations to their appropriate CSS properties.
 * If a property is not filled in, it is up to the service implementing the interpreter to decide how to resolve the ambiguity.
 */
export interface StyleInterpreter {
	color?: 'color' | 'background-color' | 'border-color' | 'fill';
}

export type ComponentClassSelectorsType = {
	[type in ComponentType | ExperienceComponentType]?: {
		[key: string]: string;
	};
};

export interface DiscountSelectorsType {
	[key: string]: string | { [key: string]: string };
}

export interface ProducAttributeSelectorsType {
	productAttribute: { [key: string]: string };
}

export type ExperienceStylingConfigurationMapType =
	| UIElementTextStyle
	| Color
	| UIElementBorderStyle
	| UIElementButtonStyleGroup
	| LocalizedField
	| ComponentStyle;


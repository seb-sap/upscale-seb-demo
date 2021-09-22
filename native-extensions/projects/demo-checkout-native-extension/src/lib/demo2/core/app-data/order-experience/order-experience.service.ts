import { AliasType, ComponentType } from '@caas/service-client-angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AltExperienceData, AppData } from '../../app-data.model';
import { AltExperienceHandler } from '../alt-experience-handler.interface';
import { SessionCartService } from '../../session-cart/session-cart.service';
import { StyleConfigurationService } from '../../style-configuration/style-configuration.service';

/**
 * Handles modifying the AppData for the "first experience" in order.
 */
@Injectable({ providedIn: 'root' })
export class OrderExperienceService implements AltExperienceHandler {
	private styleElement: HTMLStyleElement;

	constructor(private sessionCartService: SessionCartService, private styleConfigurationService: StyleConfigurationService) {}

	cleanup(): void {
		const { styleElement } = this;
		if (styleElement) {
			this.styleConfigurationService.remove(styleElement);
		}
	}

	getExperienceId(): Observable<string | null> {
		return this.sessionCartService.get().pipe(
			map(cart => {
				if (cart) {
					return cart.experienceId;
				}
				return null;
			})
		);
	}

	getAppData(appData: AppData, altExperience: AltExperienceData): AppData {
		const { experience, templates } = altExperience;
		const { stylingAttributes } = experience;
		const cart = templates.byAlias(AliasType.CART);
		const checkout = templates.byAlias(AliasType.CHECKOUT);

		let newTemplates = appData.templates;

		if (cart) {
			newTemplates = newTemplates.replaceTemplateWithAlias(cart);
		}

		if (checkout) {
			newTemplates = newTemplates.replaceTemplateWithAlias(checkout);
		}

		const clone = appData.clone();
		clone.templates = newTemplates;

		const cartStyles = stylingAttributes?.components[ComponentType.CART];
		const checkoutStyles = stylingAttributes?.components[ComponentType.CHECKOUT];

		if (cartStyles) {
			this.styleElement = this.styleConfigurationService.create(ComponentType.CART, cartStyles);
		}
		if (checkoutStyles) {
			this.styleElement = this.styleConfigurationService.create(ComponentType.CHECKOUT, checkoutStyles, this.styleElement);
		}

		clone.languagePack['general.buttons.globalSettings.quickBuy'] =
			altExperience.languagePack['general.buttons.globalSettings.quickBuy'];

		return clone;
	}
}

/**
 * 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
import { IPwaBundleConfiguration, Template } from '@caas/service-client-angular';
import { InjectionToken } from '@angular/core';

export const BUNDLE_TOKEN = new InjectionToken<IPwaBundleConfiguration>('App configuration.');

export const TEMPLATES_TOKEN = new InjectionToken<Array<Template>>('Templates.');

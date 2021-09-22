import { Locale, SupportedLocale } from '@caas/service-client-angular';

export function getLocaleAsString(l: SupportedLocale | Locale): string {
	if ('countryInfo' in l) {
		if (l.script) {
			return `${l.language}-${l.script}-${l.countryInfo.countryCode}`;
		} else {
			return `${l.language}-${l.countryInfo.countryCode}`;
		}
	} else {
		if (l.script) {
			return `${l.language}-${l.script}-${l.country}`;
		} else {
			return `${l.language}-${l.country}`;
		}
	}
}

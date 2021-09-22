import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

/**
 * A service that will listen to consent change and emit it's change.
 */
@Injectable({ providedIn: 'root' })
export class ConsentDecisionService {
	/**
	 * ready for read consents state
	 * getting consent should wait until OAuthTokenResolver
	 */
	resolvedChange: Observable<void>;

	/**
	 * ppandtos change
	 */
	private consentDecisionValue = new BehaviorSubject<boolean>(false);
	/**
	 * for Required advanced consent
	 */
	private consentRequiredValue = new BehaviorSubject<boolean>(false);
	/**
	 * for Personalization advanced consent
	 * BOPIS, Apple pay, Google pay
	 */
	private consentPersonalizationValue = new BehaviorSubject<boolean>(false);
	/**
	 * for Analytics advanced consent
	 * Google Tag Manager Integratio
	 */
	private consentAnalyticsValue = new BehaviorSubject<boolean>(false);
	/**
	 * for Marketing advanced consent
	 * Facebook integration
	 */
	private consentMarketingValue = new BehaviorSubject<boolean>(false);

	private resolvedChangeSubject = new ReplaySubject<void>(1);

	/**
	 * consent observables
	 */
	get consentDecisionChange(): Observable<boolean> {
		return this.consentDecisionValue.asObservable();
	}
	get consentRequiredChange(): Observable<boolean> {
		return this.consentRequiredValue.asObservable();
	}
	get consentPersonalizationChange(): Observable<boolean> {
		return this.consentPersonalizationValue.asObservable();
	}
	get consentAnalyticsChange(): Observable<boolean> {
		return this.consentAnalyticsValue.asObservable();
	}
	get consentMarketingChange(): Observable<boolean> {
		return this.consentMarketingValue.asObservable();
	}
	constructor() {
		this.resolvedChange = this.resolvedChangeSubject.asObservable().pipe(take(1));
	}
	/**
	 * for set consent state ready
	 */
	setResolved(): void {
		this.resolvedChangeSubject.next();
	}
	/**
	 * for set new ppandtos state
	 * @param value
	 */
	setDecision(value: boolean): void {
		this.consentDecisionValue.next(value);
	}
	/**
	 * for set new required state
	 * Privacy consent, NextSell
	 * @param value
	 */
	setRequiredDecision(value: boolean): void {
		this.consentRequiredValue.next(value);
	}
	/**
	 * for set new Personalization state
	 * BOPIS, Apple pay, Google pay
	 * @param value
	 */
	setPersonalizationDecision(value: boolean): void {
		this.consentPersonalizationValue.next(value);
	}
	/**
	 * for set new Analytics state
	 * GTM Integration, Google Analytics Integration
	 * @param value
	 */
	setAnalyticsDecision(value: boolean): void {
		this.consentAnalyticsValue.next(value);
	}
	/**
	 * for set new Marketing state
	 * Facebook integration
	 * @param value
	 */
	setMarketingDecision(value: boolean): void {
		this.consentMarketingValue.next(value);
	}
}

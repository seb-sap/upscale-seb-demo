import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ActiveConfiguration } from "@caas/service-client-angular";

@Component({
	selector: 'upscale-open-payment-checkout',
	templateUrl: './open-payment-checkout.component.html',
	styleUrls: ['./open-payment-checkout.component.scss'],
})
export class OpenPaymentCheckoutComponent /*extends BaseCheckoutDirective*/ implements OnInit, OnDestroy {

    @Input() paymentConfigs: Array<ActiveConfiguration> = [];

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

}
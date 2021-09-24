import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RegistrationService } from '@upscale/web-storefront-sdk';
import { DemoCheckoutNativeExtensionComponent2 } from './demo2/demo-checkout-native-extension.component';
import { CheckoutComponent } from './demo2/components/checkout/checkout.component';
import { OpenPaymentCheckoutComponent } from './demo2/components/checkout/open-payment-checkout/open-payment-checkout.component';

@NgModule({
  declarations: [ DemoCheckoutNativeExtensionComponent2, CheckoutComponent, OpenPaymentCheckoutComponent ],
  imports: [ CommonModule ],
  exports: [ DemoCheckoutNativeExtensionComponent2 ],
  providers: []
})
export class UpscaleExtensionModule {
  constructor(
    private registrationService: RegistrationService,
  ) {
    this.registrationService.register(
      "demo-checkout-component-2",
      DemoCheckoutNativeExtensionComponent2,
    );
  }
}

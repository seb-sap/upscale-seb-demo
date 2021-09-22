import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RegistrationService } from '@upscale/web-storefront-sdk';
import { DemoCheckoutNativeExtensionComponent2 } from '../public-api';
import { DemoCheckoutNativeExtensionComponent } from './demo1/demo-checkout-native-extension.component';

@NgModule({
  declarations: [DemoCheckoutNativeExtensionComponent],
  imports: [ CommonModule ],
  exports: [DemoCheckoutNativeExtensionComponent]
})
export class UpscaleExtensionModule {
  constructor(
    private registrationService: RegistrationService,
  ) {
    this.registrationService.register(
      "demo-checkout-component-1",
      DemoCheckoutNativeExtensionComponent
    );
    this.registrationService.register(
      "demo-checkout-component-2",
      DemoCheckoutNativeExtensionComponent2
    );
  }
}

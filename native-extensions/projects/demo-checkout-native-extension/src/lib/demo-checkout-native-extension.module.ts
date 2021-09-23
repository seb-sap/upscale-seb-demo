import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RegistrationService } from '@upscale/web-storefront-sdk';
// import { AppDataService } from './demo2/core/app-data/app-data.service';
import { DemoCheckoutNativeExtensionComponent2 } from './demo2/demo-checkout-native-extension.component';
import { DemoCheckoutNativeExtensionComponent } from './demo1/demo-checkout-native-extension.component';
// import { AuthStorageService } from './demo2/core/auth/auth-storage.service';
// import { CookieStorageService } from './demo2/core/cookie-storage';
// import { AuthStorageService } from './demo2/core/auth/auth-storage.service';

@NgModule({
  declarations: [ DemoCheckoutNativeExtensionComponent ],
  imports: [ CommonModule ],
  exports: [DemoCheckoutNativeExtensionComponent],
  providers: [
    // { provide: ApplicationConfig, useValue: ApplicationConfig }
    // { provide: BUNDLE_ID, useValue: BUNDLE_ID }
    // { provide: AuthStorageService, useExisting: AuthStorageService }
  ]
})
export class UpscaleExtensionModule {
  constructor(
    private registrationService: RegistrationService,
  ) {
    this.registrationService.register(
      "demo-checkout-component-1",
      DemoCheckoutNativeExtensionComponent,
    );
    this.registrationService.register(
      "demo-checkout-component-2",
      DemoCheckoutNativeExtensionComponent2,
    );
  }
}

import { Component, ComponentFactoryResolver, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActiveConfiguration, PaymentProvider } from '@caas/service-client-angular';
// import { PaymentConfigurationService } from '@upscale/web-storefront-sdk';
import { concatMap, finalize, map, take, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'demo-checkout-component',
  templateUrl: "./demo-checkout-native-extension.html",
  styles: [
  ]
})
export class DemoCheckoutNativeExtensionComponent2 implements OnInit, OnDestroy {
  paymentConfigs: Array<ActiveConfiguration> = [];
  loading = true;
  constructor(/*private paymentConfigurationService: PaymentConfigurationService,*/) {
    console.log('DemoCheckoutNativeExtensionComponent2');
    
    
  }

  ngOnInit(): void {
    console.log('DemoCheckoutNativeExtensionComponent2::ngOnInit');

  }

  ngOnDestroy(): void {
    console.log('DemoCheckoutNativeExtensionComponent2::ngOnDestroy');
    
  }

}

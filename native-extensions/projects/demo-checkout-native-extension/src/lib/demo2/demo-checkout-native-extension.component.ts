import { Component, OnDestroy, OnInit } from '@angular/core';
@Component({
  selector: 'demo-checkout-component',
  templateUrl: "./demo-checkout-native-extension.html",
  styles: []
})
export class DemoCheckoutNativeExtensionComponent2 implements OnInit, OnDestroy {

  constructor() {
	  console.log('DemoCheckoutNativeExtensionComponent2::ctor');
  }

  ngOnInit(): void {
    console.log('DemoCheckoutNativeExtensionComponent2::ngOnInit');
  }

  ngOnDestroy(): void {
    console.log('DemoCheckoutNativeExtensionComponent2::ngOnDestroy');
  }

}

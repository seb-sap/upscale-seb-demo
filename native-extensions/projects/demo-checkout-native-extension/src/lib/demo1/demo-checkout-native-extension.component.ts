import { Component, ComponentFactoryResolver, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'demo-checkout-component',
  templateUrl: "./demo-checkout-native-extension.html",
  styles: [
  ]
})
export class DemoCheckoutNativeExtensionComponent implements OnInit, OnDestroy {

  timeout: any;

  domObserver: MutationObserver;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    console.log('DemoCheckoutNativeExtensionComponent::ngOnInit');
    this.startObserve();
  }

  ngOnDestroy(): void {
    console.log('DemoCheckoutNativeExtensionComponent::ngOnDestroy');
    this.domObserver.disconnect();
  }

  startObserve(): void {
    this.domObserver = new MutationObserver((mutationsList) => {
      console.log(mutationsList);

      mutationsList.forEach(mutation => {
        console.log(mutation.type);

        if (mutation.type === 'childList') {
          console.log('A child node has been added or removed.');
        }

        if (mutation.addedNodes) {
          console.log(mutation.addedNodes);

          for (let node of mutation.addedNodes) {
            if (!(node instanceof HTMLElement)) continue;

            if (node.matches('upscale-formgroup-input-container[class*="delivery-form"]')) {
              console.log('delivery form found.');
              console.log(node);
              const deliveryForm: HTMLElement = node;
              deliveryForm.append('testing append text here...');
            }
          }
          
        }
      })
    });
    const container = document.documentElement || document.body;
    console.log(container);
    const config = { attributes: false, childList: true, characterData: false, subtree: true };
    this.domObserver.observe(container, config);
  }

}

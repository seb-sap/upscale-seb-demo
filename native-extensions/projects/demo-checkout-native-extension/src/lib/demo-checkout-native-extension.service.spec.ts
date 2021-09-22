import { TestBed } from '@angular/core/testing';

import { DemoCheckoutNativeExtensionService } from './demo-checkout-native-extension.service';

describe('DemoCheckoutNativeExtensionService', () => {
  let service: DemoCheckoutNativeExtensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemoCheckoutNativeExtensionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

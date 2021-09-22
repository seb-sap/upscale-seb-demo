import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoCheckoutNativeExtensionComponent } from './demo-checkout-native-extension.component';

describe('DemoCheckoutNativeExtensionComponent', () => {
  let component: DemoCheckoutNativeExtensionComponent;
  let fixture: ComponentFixture<DemoCheckoutNativeExtensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoCheckoutNativeExtensionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoCheckoutNativeExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

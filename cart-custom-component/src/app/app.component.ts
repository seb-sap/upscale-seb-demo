import {
  keyframes
} from '@angular/animations';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  CustomComponentEvent,
  CustomComponentEventType,
  CustomComponentFormStatusEventStatus
} from '@caas/service-client-angular';
import {
  log
} from './common/logutil';
import {
  UpscaleEvent as UpscaleInputEvent,
  UpscaleInputEventType
} from './events/input-events.interface';
import {
  InitializedEvent,
  SizeEvent
} from './events/output-events.interface';
import {
  sendMessage
} from './events/send-message.function';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cart-custom-component';

  canDisplay = false;
  eventType: string;
  componentContext: any;
  componentInitData: any;
  cartOrderLineEdit: any;
  cartReset: any;
  cartOrderLineRemove: any;
  appAddedToCart: any;
  checkoutComponentInitData: any;
  checkoutReview: any;

  constructor() {
    window.addEventListener(
      'message',
      event => {
        this.handleEvent(event);
      },
      false
    );
  }

  ngOnInit(): void {
    this.setInitialized();
  }

  setInitialized(): void {
    const event: InitializedEvent = {
      type: 'initialized',
      data: null,
    };

    sendMessage(event);
  }

  setHeight(height: number): void {
    const event: SizeEvent = {
      type: 'sizeChange',
      data: {
        height
      }
    };

    sendMessage(event);
  }

  sendFormEvent(status: CustomComponentFormStatusEventStatus): void {
    const event: CustomComponentEvent = {
      type: CustomComponentEventType.FORM_STATUS,
      data: {
        status,
      }
    };

    sendMessage(event);
  }

  handleEvent(messageEvent: MessageEvent): void {

    const event = messageEvent.data as UpscaleInputEvent;
    log(messageEvent);

    this.eventType = event.eventType;

    switch (event.eventType) {
      case UpscaleInputEventType.component_context:
        this.canDisplay = true;
        this.componentContext = event.keys;
        this.validateMinimumQuantity(event.keys.draftOrderId);
        break;
      
      case UpscaleInputEventType.cart_component_init:
        this.componentInitData = event.keys;
        break;

      case UpscaleInputEventType.cart_orderline_edit_click:
        this.cartOrderLineEdit = event.keys;
        break;

      case UpscaleInputEventType.cart_reset:
        this.cartReset = event.keys;
        break;

      case UpscaleInputEventType.cart_orderline_remove_click:
        this.cartOrderLineRemove = event.keys;
        break;

      case UpscaleInputEventType.app_added_to_cart:
        this.appAddedToCart = event.keys;
        break;

        // for checkout page only
      case UpscaleInputEventType.checkout_component_init:
        this.checkoutComponentInitData = event.keys;
        break;

      case UpscaleInputEventType.checkout_review_click:
        this.checkoutReview = event.keys;
        break;
    }
  }

  validateMinimumQuantity(draftOrderId: string): void {
    // TODO: fetch https://knight-bears-stage-approuter-caas2-sap-stage.cfapps.us10.hana.ondemand.com/consumer/order-broker/orders/${draftOrderId}?orderLineResponseViewType=AGGREGATED&custom=true
  }
}

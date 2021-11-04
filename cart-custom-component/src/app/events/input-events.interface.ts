export enum UpscaleInputEventType {
	component_context = 'component_context',
	cart_component_init = 'cart_component_init',
	cart_orderline_edit_click = 'cart_orderline_edit_click',
	cart_reset = 'cart_reset',
	cart_orderline_remove_click = 'cart_orderline_remove_click',
	app_added_to_cart = 'app_added_to_cart',
	checkout_component_init = 'checkout_component_init',
	checkout_review_click = 'checkout_review_click',
}
/** Event passed from application to custom component */
export interface UpscaleEvent {
	eventType: UpscaleInputEventType;
	keys: {[k: string]: any};
}

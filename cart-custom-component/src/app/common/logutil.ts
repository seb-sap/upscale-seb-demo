export function log(...params: any[]): void {
  if (console) {
    console.log('cart-custom-component');
    console.log(params);
  }
}

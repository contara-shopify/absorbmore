export type Translations = {
  main_account: {
    /*  Product */
    product: string;
    /*  SKU */
    sku: string;
    /*  Quantity */
    quantity: string;
    /*  Total */
    total: string;
    /*  Subtotal */
    subtotal: string;
    /*  Discount */
    discount: string;
    /*  Shipping */
    shipping: string;
    /*  Tax included */
    tax_included: string;
    /*  Tax excluded */
    tax_excluded: string;
    /*  Refunded amount */
    refunded_amount: string;
    /*  Billing Address */
    billing_address: string;
    /*  No Billing Address */
    no_billing: string;
    /*  Shipping Address */
    shipping_address: string;
    /*  No shipping address was required for this order. */
    no_shipping: string;
  };
};
declare global {
  interface Window {
    translations?: Translations;
  }
}

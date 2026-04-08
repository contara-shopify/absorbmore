const initialStore = {
  product: null,
  selected_variant: null,
  email: "",
  phone_number: "",
  subscribe: true,
  loading: false,
};

const initBackInStock = ($el, klaviyo_company_id, klaviyo_list_id) => {
  window.Alpine.store("backInStockNotification", initialStore);

  const state = window.Alpine.store("backInStockNotification");

  window.Alpine.magic("backInStockNotification", () => state);
  window._stores["backInStockNotification"] = state;

  const submitBackInStockForm = async (e) => {
    state.loading = true;

    fetch(`https://a.klaviyo.com/client/back-in-stock-subscriptions/?company_id=${klaviyo_company_id}`, {
      method: `POST`,
      headers: {
        "Content-Type": "application/json",
        revision: "2025-04-15",
      },
      body: JSON.stringify({
        data: {
          type: "back-in-stock-subscription",
          attributes: {
            profile: {
              data: {
                type: "profile",
                attributes: {
                  ...(state.email ? { email: state.email } : {}),
                  ...(state.phone_number ? { phone_number: utils.normalizePhoneInput(state.phone_number ?? "") } : {}),
                },
              },
            },
            channels: [...(state.email ? ["EMAIL"] : []), ...(state.phone_number ? ["SMS"] : [])],
          },
          relationships: {
            variant: {
              data: {
                type: "catalog-variant",
                id: `$shopify:::$default:::${state?.selected_variant?.id}`,
              },
            },
          },
        },
      }),
    })
      .then(async (res) => {
        if (res.headers.get("content-type") === "application/json") {
          await res.json();
          return res;
        }
        await res.text();
        return res;
      })
      .then((res) => {
        state.loading = false;
        if (res?.status >= 200 && res?.status < 300) {
          _stores.toast.addToast({
            type: "success",
            title: "You will receive an email when this item is back in stock.",
            content: "",
            timestamp: Date.now(),
          });
          _stores.modal.setId("");
          return;
        }

        _stores.toast.addToast({
          type: "error",
          title: "Error",
          // @ts-ignore
          content: res?.errors?.[0]?.detail ?? "Please try again later.",
          timestamp: Date.now(),
        });
      });

    if (state.subscribe && klaviyo_list_id && (state.phone_number || state.email)) {
      fetch(`https://a.klaviyo.com/client/subscriptions?company_id=${klaviyo_company_id}`, {
        method: "POST",
        headers: {
          accept: "application/vnd.api+json",
          revision: "2025-07-15",
          "content-type": "application/vnd.api+json",
        },
        body: JSON.stringify({
          data: {
            type: "subscription",
            attributes: {
              profile: {
                data: {
                  type: "profile",
                  attributes: {
                    subscriptions: {
                      ...(state.email
                        ? {
                            email: {
                              marketing: {
                                consent: "SUBSCRIBED",
                              },
                            },
                          }
                        : {}),
                      ...(state.phone_number
                        ? {
                            sms: {
                              marketing: {
                                consent: "SUBSCRIBED",
                              },
                            },
                          }
                        : {}),
                    },
                    ...(state.email ? { email: state.email } : {}),
                    ...(state.phone_number ? { phone_number: state.phone_number } : {}),
                  },
                },
              },
              custom_source: "Back In Stock",
            },
            relationships: {
              list: {
                data: {
                  type: "list",
                  id: klaviyo_list_id,
                },
              },
            },
          },
        }),
      });
    }
  };

  return {
    back_in_stock: state,
    submitBackInStockForm,
  };
};

window._sections["initBackInStock"] = initBackInStock;

/* LAST HASH: 56f7a2c026ce4d89eab900bf09e1b24fb1233f14 */

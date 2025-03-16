import {
  Order,
  Product,
  ShopifyOrder,
  ShopifyProduct,
} from "../src/lib/shopify/types";

export const testProducts: ShopifyProduct[] = [
  {
    id: "gid://shopify/Product/15009427554689",
    title: "The Inventory Not Tracked Snowboard",
    handle: "the-inventory-not-tracked-snowboard",
    updatedAt: "2025-03-12T17:02:24Z",
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/54110211146113",
            title: "Default Title",
            updatedAt: "2025-03-12T17:02:24Z",
            price: "712.46",
            compareAtPrice: "949.95",
            contextualPricing: {
              compareAtPrice: {
                amount: "949.95",
                currencyCode: "GBP",
              },
              price: {
                amount: "712.46",
                currencyCode: "GBP",
              },
            },
          },
        },
      ],
    },
    featuredMedia: {
      preview: {
        image: {
          url: "https://cdn.shopify.com/s/files/1/0903/7443/9297/files/snowboard_purple_hydrogen.png?v=1741465883",
        },
      },
    },
  },
  {
    id: "gid://shopify/Product/15009427587457",
    title: "The Compare at Price Snowboard",
    handle: "the-compare-at-price-snowboard",
    updatedAt: "2025-03-11T15:19:47Z",
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/54110211277185",
            title: "Default Title",
            updatedAt: "2025-03-08T20:31:20Z",
            price: "785.95",
            compareAtPrice: "885.95",
            contextualPricing: {
              compareAtPrice: {
                amount: "885.95",
                currencyCode: "GBP",
              },
              price: {
                amount: "785.95",
                currencyCode: "GBP",
              },
            },
          },
        },
      ],
    },
    featuredMedia: {
      preview: {
        image: {
          url: "https://cdn.shopify.com/s/files/1/0903/7443/9297/files/snowboard_sky.png?v=1741465883",
        },
      },
    },
  },
];

export const reshapedTestProducts: Product[] = [
  {
    id: "gid://shopify/Product/15009427554689",
    title: "The Inventory Not Tracked Snowboard",
    handle: "the-inventory-not-tracked-snowboard",
    updatedAt: "2025-03-12T17:02:24Z",
    variants: [
      {
        id: "gid://shopify/ProductVariant/54110211146113",
        title: "Default Title",
        updatedAt: "2025-03-12T17:02:24Z",
        price: "712.46",
        compareAtPrice: "949.95",
        contextualPricing: {
          compareAtPrice: {
            amount: "949.95",
            currencyCode: "GBP",
          },
          price: {
            amount: "712.46",
            currencyCode: "GBP",
          },
        },
      },
    ],

    featuredMedia: {
      preview: {
        image: {
          url: "https://cdn.shopify.com/s/files/1/0903/7443/9297/files/snowboard_purple_hydrogen.png?v=1741465883",
        },
      },
    },
  },
  {
    id: "gid://shopify/Product/15009427587457",
    title: "The Compare at Price Snowboard",
    handle: "the-compare-at-price-snowboard",
    updatedAt: "2025-03-11T15:19:47Z",
    variants: [
      {
        id: "gid://shopify/ProductVariant/54110211277185",
        title: "Default Title",
        updatedAt: "2025-03-08T20:31:20Z",
        price: "785.95",
        compareAtPrice: "885.95",
        contextualPricing: {
          compareAtPrice: {
            amount: "885.95",
            currencyCode: "GBP",
          },
          price: {
            amount: "785.95",
            currencyCode: "GBP",
          },
        },
      },
    ],

    featuredMedia: {
      preview: {
        image: {
          url: "https://cdn.shopify.com/s/files/1/0903/7443/9297/files/snowboard_sky.png?v=1741465883",
        },
      },
    },
  },
];

export const testOrders: ShopifyOrder[] = [
  {
    id: "gid://shopify/Order/11920532046209",
    name: "#1001",
    totalPriceSet: {
      presentmentMoney: {
        amount: "3329.9",
        currencyCode: "GBP",
      },
    },
    createdAt: "2025-03-11T11:18:41Z",
    shippingAddress: {
      firstName: "Russell",
      lastName: "Winfield",
    },
    lineItems: {
      edges: [
        {
          node: {
            name: "The Complete Snowboard - Sunset",
            quantity: 1,
            variant: {
              id: "gid://shopify/ProductVariant/54110211572097",
            },
            product: {
              id: "gid://shopify/Product/15009427685761",
            },
          },
        },
        {
          node: {
            name: "The 3p Fulfilled Snowboard",
            quantity: 1,
            variant: {
              id: "gid://shopify/ProductVariant/54110211899777",
            },
            product: {
              id: "gid://shopify/Product/15009428046209",
            },
          },
        },
      ],
    },
  },

  {
    id: "gid://shopify/Order/11920532603265",
    name: "#1002",
    totalPriceSet: {
      presentmentMoney: {
        amount: "753.94",
        currencyCode: "GBP",
      },
    },
    createdAt: "2025-03-11T11:19:04Z",
    shippingAddress: {
      firstName: "",
      lastName: "",
    },
    lineItems: {
      edges: [
        {
          node: {
            name: "The Multi-location Snowboard",
            quantity: 1,
            variant: {
              id: "gid://shopify/ProductVariant/54110211834241",
            },
            product: {
              id: "gid://shopify/Product/15009427947905",
            },
          },
        },
      ],
    },
  },
];

export const reshapedTestOrders: Order[] = [
  {
    id: "gid://shopify/Order/11920532046209",
    name: "#1001",
    totalPriceSet: {
      presentmentMoney: {
        amount: "3329.9",
        currencyCode: "GBP",
      },
    },
    createdAt: "2025-03-11T11:18:41Z",
    shippingAddress: {
      firstName: "Russell",
      lastName: "Winfield",
    },
    lineItems: [
      {
        name: "The Complete Snowboard - Sunset",
        quantity: 1,
        variant: {
          id: "gid://shopify/ProductVariant/54110211572097",
        },
        product: {
          id: "gid://shopify/Product/15009427685761",
        },
      },

      {
        name: "The 3p Fulfilled Snowboard",
        quantity: 1,
        variant: {
          id: "gid://shopify/ProductVariant/54110211899777",
        },
        product: {
          id: "gid://shopify/Product/15009428046209",
        },
      },
    ],
  },

  {
    id: "gid://shopify/Order/11920532603265",
    name: "#1002",
    totalPriceSet: {
      presentmentMoney: {
        amount: "753.94",
        currencyCode: "GBP",
      },
    },
    createdAt: "2025-03-11T11:19:04Z",
    shippingAddress: {
      firstName: "",
      lastName: "",
    },
    lineItems: [
      {
        name: "The Multi-location Snowboard",
        quantity: 1,
        variant: {
          id: "gid://shopify/ProductVariant/54110211834241",
        },
        product: {
          id: "gid://shopify/Product/15009427947905",
        },
      },
    ],
  },
];

export const productsConnection = {
  edges: [{ node: testProducts[0] }, { node: testProducts[1] }],
};

export const ordersConnection = {
  edges: [{ node: testOrders[0] }, { node: testOrders[1] }],
};

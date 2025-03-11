export type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type Edge<T> = {
  node: T;
};

export type Extensions = {
  cost: {
    requestedQueryCost: number;
    actualQueryCost: number;
    throttleStatus: {
      maximumAvailable: number;
      currentlyAvailable: number;
      restoreRate: number;
    };
  };
};

export type MoneyV2 = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  variants: Connection<ProductVariant>;
  featuredMedia: {
    preview: {
      image: Image;
    };
  };
};

export type MinimalProduct = {
  id: string;
  title: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  image: Image;
  contextualPricing: {
    compareAtPrice: MoneyV2;
    price: MoneyV2;
  };
};

export type Product = Omit<ShopifyProduct, "variants"> & {
  variants: ProductVariant[];
};

export type OrderItem = {
  name: string;
  quantity: number;
  variant?: { id: string };
  product?: { id: string };
};

export type ShopifyOrder = {
  id: string;
  name: string;
  totalPriceSet: {
    presentmentMoney: MoneyV2;
  };
  createdAt: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
  };
  lineItems: Connection<OrderItem>;
};

export type Order = Omit<ShopifyOrder, "lineItems"> & {
  lineItems: OrderItem[];
};

export type PageInfo = {
  pageInfo: { hasNextPage: boolean; endCursor?: string };
};

export type ShopifyProductsIdOperation = {
  data: {
    products: Connection<MinimalProduct> & PageInfo;
  };
  variables: {
    first: number;
    after?: string;
  };
  extensions: Extensions;
};

export type ShopifyProductOperation = {
  data: {
    product: ShopifyProduct;
  };
  variables: {
    id: string;
  };
};

export type ShopifyOrdersOperation = {
  data: {
    orders: Connection<ShopifyOrder> & PageInfo;
  };
  variables: {
    first: number;
    query?: string;
    after?: string;
  };
  extensions: Extensions;
};

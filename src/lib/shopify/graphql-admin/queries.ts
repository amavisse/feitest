import { productFragment } from "./fragments";

export const getProductsIdQuery = `
query getProducts($first: Int!, $after: String) {
  products(first: $first, after: $after) {
    edges {
      node {
        id
        title
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`;

export const getProductByIdQuery = `
query getProduct($id: ID!) {
  product(id: $id) {
    ...product
  }
}
${productFragment}
`
export const getOrdersQuery = `
query getOrders($first: Int!, $query: String!, $after: String) {
  orders(first: $first, query: $query, after: $after) {
    edges {
      node {
        id
        name
        totalPriceSet {
          presentmentMoney {
            amount
            currencyCode
          }
        }
        createdAt
        shippingAddress {
          firstName
          lastName
        }
        lineItems(first: 250) {
          edges {
            node {
              name
              quantity
              variant {
                id
              }
              product {
                id
              }
            }
          }
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
`
export const productFragment = `
fragment product on Product {
  id
  title
  handle
  updatedAt
  variants(first: 250) {
    edges {
      node {
        id
        title
        updatedAt
        image {
          url
        }
        price
        compareAtPrice
        contextualPricing(context: {country: GB}) {
          compareAtPrice {
            amount
            currencyCode
          }
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }
  featuredMedia {
    preview {
      image {
        url
      }
    }
  }
}
`;

export const productFragment = `
fragment product on Product {
  id
  title
  handle
  variants(first: 250) {
    edges {
      node {
        id
        title
        image {
          url
        }
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

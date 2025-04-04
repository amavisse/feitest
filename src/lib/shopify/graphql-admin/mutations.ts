export const productVariantsBulkUpdateMutation = `
mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
  productVariantsBulkUpdate(productId: $productId, variants: $variants) {
    product {
      id
    }
    productVariants {
      id
    }
    userErrors {
      field
      message
    }
  }
}
`
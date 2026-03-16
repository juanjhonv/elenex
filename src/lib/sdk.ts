import Medusa from "@medusajs/js-sdk"

let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (import.meta.env.PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = import.meta.env.PUBLIC_MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: import.meta.env.NODE_ENV === "development",
  publishableKey: import.meta.env.PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})
// export const sdk = new Medusa({
//   baseUrl: "http://localhost:9000",
//   debug: true,
//   publishableKey: 'pk_d19722ede942a29f761e40d489481517ec9c9939ce11f6256a18f266f3a2122b',
// })
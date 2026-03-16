import type { ProductDTO, StoreProduct } from "@medusajs/types"
import { useState } from "react"

interface Params {
  list: StoreProduct[]
}
// const productList = 
export default function Product(params: Params) {
  const { list } = params
  const [productos, setProductos] = useState(list)
  console.log("La lista de listas es:", productos)
  return (
    <>
      <h2>Mi producto list</h2>
      {/* {
        JSON.stringify(productos)
      } */}
      {
        productos && productos.map(prod => <div>{prod.title}</div>)
      }
    </>
  )
}
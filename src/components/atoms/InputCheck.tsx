import type { StoreProductCategory, StoreProductListParams } from "@medusajs/types"
import { useRef, type ChangeEventHandler } from "react";

type ParamsInputCheck = {
  info: StoreProductCategory;
  filters: StoreProductListParams | undefined;
  setFilters: (value: {}) => void;
}

const InputCheck: React.FC<ParamsInputCheck> = ({ info, filters, setFilters }) => {
  // const { info } = params
  let category_id: Array<string> = []
  const data = useRef(info)
  const onchange: ChangeEventHandler = (e) => {
    const id_categ_input = e.target.id
    if (typeof filters?.category_id === 'string') {

    } else {
      if (filters?.category_id) {
        category_id = (filters?.category_id ?? []).find(idcat => idcat == id_categ_input)
          ? filters.category_id.filter(idcat => idcat !== id_categ_input)
          : [...filters.category_id, id_categ_input]
      }
    }

    // if(filters?.category_id && filters?.category_id.length > 1){
    //   filters.category_id.find()
    // } else {

    // }
    setFilters({
      ...filters,
      category_id: category_id
    })
    console.log("Aplicando uno d elos filtros", e.target.id)
    console.log("Los comandos principales son los siguientes")
  }
  return (
    <>
      <input type="checkbox" id={`rubro_${info.id}`} onChange={onchange} />
      <label htmlFor={`rubro_${info.id}`}>{info.name}</label>
    </>
  )
}

export default InputCheck
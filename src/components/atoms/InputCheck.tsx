import type { StoreProductCategory, StoreProductListParams, StoreProductTag } from "@medusajs/types"
import { useRef, type ChangeEventHandler, type ReactElement } from "react";
import type { GroupInputCheckCallbackProps } from "../molecules/types";

type ParamsInputCheck = {
  info: StoreProductCategory | StoreProductTag;
  filters: StoreProductListParams | undefined;
  callback: ({ }: GroupInputCheckCallbackProps) => void;
}

function isStoreProductCategory(param: any): param is StoreProductCategory {
  return param && typeof param.name === 'string' && 'handle' in param;
}

const InputCheck: React.FC<ParamsInputCheck> = ({ info, filters, callback }): ReactElement => {
  // let name: string
  // if(isStoreProductCategory(info)){
  //   name = info.name
  // }
  // const onchange: ChangeEventHandler 
  if (isStoreProductCategory(info)) {
    const onchange: ChangeEventHandler = (e) => {
      console.log("LLamando al callback")
      callback({ fieldname: info.name, idfield: info.id })
    }
    return (
      <>
        <input type="checkbox" id={`rubro_${info.id}`} onChange={onchange} />
        <label htmlFor={`rubro_${info.id}`}>{info.name}</label>
      </>
    )
  } else {
    return (
      <></>
    )
  }
}

export default InputCheck
import { useState, type Dispatch, type SetStateAction } from "react";
import InputCheck from "../atoms/InputCheck";
import type { StoreProductCategory, StoreProductListParams } from "@medusajs/types";

type GroupInputCheckParams = {
  info: StoreProductCategory[];
  filters: StoreProductListParams | undefined;
  setFilters: (value: object) => void;
}
export default function GroupInputCheck({ info, filters, setFilters }: GroupInputCheckParams) {
  const [active, setActive] = useState(true)
  if (info.length) {
    return (
      <div className="border">
        <div className="flex justify-between">
          <span>Rubros</span>
          <span className="cursor-pointer" onClick={() => setActive(!active)}>
            {
              active
                ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 15l6 -6l6 6" /></svg>
                : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 9l6 6l6 -6" /></svg>
            }
          </span>
        </div>
        <ul className={`${!active ? 'hidden' : ''}`}>
          {
            info.map(data => <li><InputCheck info={data} filters={filters} setFilters={setFilters} /></li>)
          }
        </ul>
      </div>
    )
  }
}



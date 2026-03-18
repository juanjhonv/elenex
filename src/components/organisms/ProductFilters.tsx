import type { Dispatch, FunctionComponent, SetStateAction } from "react";
import { SearchBox } from "../molecules/SearchBox";
import GroupInputCheck from "../molecules/GroupInputCheck";
import type { StoreProductCategory, StoreProductListParams } from "@medusajs/types";

interface ParamsProduct {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  initialDataFilters: StoreProductCategory[];
  filters: StoreProductListParams | undefined;
  setFilters: (value: object) => void;
}

export default function ProductFilters({ searchQuery, setSearchQuery, initialDataFilters, filters, setFilters }: ParamsProduct) {
  return (
    <div className="mb-12 flex-1 bg-white p-4 rounded-xl">
      <SearchBox
        placeholder="Buscar productos..."
        value={searchQuery}
        onChange={setSearchQuery}
      />
      <div>
      </div>
      {/* <GroupInputCheck info={Array(5).fill({ name: 'polo' })} /> */}
      <GroupInputCheck info={initialDataFilters} filters={filters} setFilters={setFilters} />
      <div className="border">
        <div className="flex justify-between active:bg-amber-500">
          <span>Precios</span>
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 9l6 6l6 -6" /></svg>
          </span>
        </div>
      </div>
    </div>
  )
}
import type { ProductCategoryDTO, ProductTagDTO, StoreProductCategory, StoreProductListParams, StoreProductTag } from "@medusajs/types";

export type FilterDataProductListElement = {
  filterfield: string;
  filtervalues: StoreProductCategory[] | StoreProductTag[]
  // filtervalues: ProductCategoryDTO[] | ProductTagDTO[]
}
export type FiltersDataProductList = FilterDataProductListElement[]

export type ProductListContentProps = {
  client?: string,
  initialDataFilters: FilterDataProductListElement[]
}

export type GroupInputCheckParams = {
  info: FilterDataProductListElement;
  filters: StoreProductListParams | undefined;
  setFilters: (value: object) => void;
}
export type GroupInputCheckCallbackProps = {
  fieldname: string;
  idfield: string;
}

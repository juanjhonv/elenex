import React, { useState, useMemo, useEffect } from "react";
import { useQuery, QueryClient, QueryClientProvider, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";
import { ProductCard } from "../molecules/ProductCard";
import type { StoreProduct } from "@medusajs/types";
import ProductFilters from "./ProductFilters";
import type { ProductListContentProps } from "../molecules/types";

interface Product {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  variants?: Array<{
    id: string;
    prices?: Array<{
      amount?: number;
      currency_code?: string;
    }>;
  }>;
  handle?: string;
}

const ProductListContent: React.FC<ProductListContentProps> = ({ initialDataFilters }: ProductListContentProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});

  // Fetch products using React Query

  // let products = [] ,isLoading = false, error = false;

  // let ppp = { data: products = [], isLoading, error } = otro
  // let products:[]
  // let result = undefined
  const { data: products = [], isLoading, error } = useQuery({
    // result = useQuery({
    // UseQueryResult = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { products } = await sdk.store.product.list(filters);
      console.log("La lista de productos es:", products)
      return products;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });


  useEffect(() => {
    // { data: products = [], isLoading, error } = useQuery                                  

    // console.log("Se modifican los filtros de la consulta", filters)
    // useQueryProps = useQuery({
    //   queryKey: ["products"],
    //   queryFn: async () => {
    //     const { products } = await sdk.store.product.list(filters);
    //     console.log("La lista de productos es:", products)
    //     return products;
    //   },
    //   staleTime: 1000 * 60 * 5,
    // });
  }, [filters])

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    // if (!searchQuery.trim()) return result.data;
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return (products ?? []).filter(
      (product: StoreProduct) =>
        product.title.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);
  // }, [result.data, searchQuery]);

  // if (result.isLoading) {
  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        </div>
      </section>
    );
  }

  // if (result.error) {
  if (error) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-600">
            <p className="text-lg font-semibold">Error al cargar productos</p>
            <p className="text-sm mt-2">Intenta refrescar la página</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-[#F1F1F1] h-full">
      <h2 className="text-3xl font-bold mb-6">Nuestros Productos</h2>
      <div className="max-w-7xl mx-auto flex gap-2">
        {/* Search Box */}
        <ProductFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} initialDataFilters={initialDataFilters} filters={filters} setFilters={setFilters} />

        <div className="flex-3">
          {/* Results count */}
          <div className="p-2 bg-white">
            <p className="text-sm text-gray-600 mb-6">
              Mostrando {filteredProducts.length} de {products.length} productos
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product: StoreProduct) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  description={product.description}
                  image={product.thumbnail}
                  price={
                    product.variants?.[0]?.prices?.[0]?.amount
                      ? `$${(product.variants[0].prices[0].amount / 100).toFixed(2)}`
                      : "Precio no disponible"
                  }
                  handle={product.handle}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-gray-500">
                No se encontraron productos que coincidan con tu búsqueda
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

const ProductList: React.FC<ProductListContentProps> = ({ initialDataFilters }) => (
  <QueryClientProvider client={queryClient}>
    <ProductListContent initialDataFilters={initialDataFilters} />
  </QueryClientProvider>
);

export default ProductList;

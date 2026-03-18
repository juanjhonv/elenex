import React, { useState } from "react";
import { useQuery, useMutation, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";

interface ProductProps {
  productId: string;
}

interface LineItem {
  id?: string;
  product_id: string;
  quantity: number;
  variant_id: string;
}

const ProductContent: React.FC<ProductProps> = ({ productId }) => {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartId, setCartId] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("cartId") : null
  );

  // Fetch product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const { product } = await sdk.store.product.retrieve(productId);
      return product;
    },
  });

  // Get or create cart
  const getOrCreateCart = async (): Promise<string> => {
    if (cartId) return cartId;

    const { cart } = await sdk.store.cart.create({});
    const newCartId = cart.id;
    localStorage.setItem("cartId", newCartId);
    setCartId(newCartId);
    return newCartId;
  };

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!selectedVariant || !product) {
        throw new Error("Selecciona una variante");
      }

      const activeCartId = await getOrCreateCart();

      const { cart } = await sdk.store.cart.createLineItems(activeCartId, {
        items: [
          {
            variant_id: selectedVariant,
            quantity: quantity,
          },
        ],
      });

      return cart;
    },
    onSuccess: () => {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
      setQuantity(1);
    },
    onError: (error) => {
      console.error("Error al agregar al carrito:", error);
      alert(
        "No se pudo agregar el producto al carrito. Intenta de nuevo."
      );
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-red-600">Error al cargar el producto</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-500">Producto no encontrado</p>
      </div>
    );
  }

  const firstVariant = product.variants?.[0];
  const basePrice = firstVariant?.prices?.[0]?.amount;

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg h-96">
            {product.thumbnail ? (
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-gray-400 text-lg">Sin imagen</div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4">{product.title}</h1>

            {/* Price */}
            {basePrice && (
              <p className="text-3xl font-semibold mb-4">
                ${(basePrice / 100).toFixed(2)}
              </p>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Variants Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">
                  Selecciona una variante:
                </label>
                <select
                  value={selectedVariant || ""}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                >
                  <option value="">-- Selecciona una variante --</option>
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.title || `Variante ${variant.id.slice(0, 8)}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">
                Cantidad:
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    setQuantity(Math.max(1, quantity - 1))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-16 px-2 py-2 border border-gray-300 rounded-lg text-center"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => addToCartMutation.mutate()}
              disabled={
                addToCartMutation.isPending || !selectedVariant
              }
              className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {addToCartMutation.isPending
                ? "Agregando..."
                : "AGREGAR AL CARRITO"}
            </button>

            {/* Success Message */}
            {addedToCart && (
              <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center">
                ✓ Producto agregado al carrito
              </div>
            )}

            {/* Error Message */}
            {addToCartMutation.isError && (
              <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg text-center">
                Error al agregar al carrito
              </div>
            )}

            {/* Stock Info */}
            {firstVariant?.inventory_quantity !== undefined && (
              <p className="mt-6 text-sm text-gray-500">
                En stock: {firstVariant.inventory_quantity} unidades
              </p>
            )}
          </div>
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

const Product: React.FC<ProductProps> = (props) => (
  <QueryClientProvider client={queryClient}>
    <ProductContent {...props} />
  </QueryClientProvider>
);

export default Product;
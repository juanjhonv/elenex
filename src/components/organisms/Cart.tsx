import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";

interface CartItem {
  id: string;
  title: string;
  variant_id: string;
  quantity: number;
  unit_price?: number;
  thumbnail?: string;
  product?: {
    id: string;
    title: string;
    thumbnail?: string;
  };
}

interface CartData {
  id: string;
  items: CartItem[];
  subtotal?: number;
  tax_total?: number;
  shipping_total?: number;
  total?: number;
}

const CartContent: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [cartId, setCartId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    setMounted(true);
    const storedCartId = localStorage?.getItem("cartId");
    setCartId(storedCartId);
  }, []);

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart", cartId],
    queryFn: async () => {
      if (!cartId) return null;
      const { cart } = await sdk.store.cart.retrieve(cartId);
      return cart;
    },
    enabled: !!cartId && mounted,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      lineItemId,
      quantity,
    }: {
      lineItemId: string;
      quantity: number;
    }) => {
      if (!cartId) throw new Error("No cart ID");

      const { cart } = await sdk.store.cart.updateLineItems(cartId, {
        items: [
          {
            id: lineItemId,
            quantity: quantity,
          },
        ],
      });

      return cart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", cartId] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (lineItemId: string) => {
      if (!cartId) throw new Error("No cart ID");

      const { cart } = await sdk.store.cart.removeLineItems(cartId, {
        line_item_ids: [lineItemId],
      });

      return cart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", cartId] });
    },
  });

  if (!mounted || !cartId) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Carrito de Compras</h2>
          <div className="text-center py-16">
            <p className="text-lg text-gray-500 mb-6">
              Tu carrito está vacío
            </p>
            <a
              href="/store"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800"
            >
              Continuar comprando
            </a>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Carrito de Compras</h2>
          <div className="text-center py-16">
            <p className="text-lg text-gray-500 mb-6">
              Tu carrito está vacío
            </p>
            <a
              href="/store"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800"
            >
              Continuar comprando
            </a>
          </div>
        </div>
      </section>
    );
  }

  const subtotal = cart.items.reduce(
    (sum: number, item: CartItem) => sum + (item.unit_price || 0) * item.quantity,
    0
  );
  const total = subtotal + (cart.tax_total || 0) + (cart.shipping_total || 0);

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Carrito de Compras</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {cart.items.map((item: CartItem) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-6 border-b last:border-b-0 hover:bg-gray-50"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                    {item.product?.thumbnail || item.thumbnail ? (
                      <img
                        src={
                          item.product?.thumbnail || item.thumbnail
                        }
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-gray-600">
                      ${((item.unit_price || 0) / 100).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantityMutation.mutate({
                          lineItemId: item.id,
                          quantity: Math.max(1, item.quantity - 1),
                        })
                      }
                      disabled={updateQuantityMutation.isPending}
                      className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="px-3 py-1">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantityMutation.mutate({
                          lineItemId: item.id,
                          quantity: item.quantity + 1,
                        })
                      }
                      disabled={updateQuantityMutation.isPending}
                      className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-24">
                    <p className="font-semibold">
                      ${(((item.unit_price || 0) * item.quantity) / 100).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() =>
                      removeItemMutation.mutate(item.id)
                    }
                    disabled={removeItemMutation.isPending}
                    className="px-3 py-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Continue Shopping Button */}
            <div className="mt-6">
              <a
                href="/store"
                className="inline-block text-blue-600 hover:text-blue-800 font-semibold"
              >
                ← Continuar comprando
              </a>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-6">Resumen</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    ${(subtotal / 100).toFixed(2)}
                  </span>
                </div>
                {cart.tax_total && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Impuestos</span>
                    <span className="font-semibold">
                      ${(cart.tax_total / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                {cart.shipping_total && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío</span>
                    <span className="font-semibold">
                      ${(cart.shipping_total / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">
                    ${(total / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Proceder al Pago
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Impuestos y envío se calcularán en el checkout
              </p>
            </div>
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

const Cart: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <CartContent />
  </QueryClientProvider>
);

export default Cart;

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/api";
import { CartContextType, CartItemWithProduct } from "@/types";

// ─── Context ─────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextType | null>(null);

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items,  setItems]  = useState<CartItemWithProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const sessionId = useRef(
    localStorage.getItem("cart-session") ?? crypto.randomUUID()
  ).current;

  const loadCart = useCallback(async () => {
    try {
      const cartItems = await api.getCartItems(sessionId);
      const fullItems = await Promise.all(
        cartItems.map(async (item: any) => {
          const product = await api.getProduct(item.productId);
          const artisan = await api.getArtisan(product.artisanId);
          return { ...item, product: { ...product, artisanName: artisan.name } };
        })
      );
      setItems(fullItems);
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  }, [sessionId]);

  useEffect(() => { loadCart(); }, [loadCart]);

  const addToCart = useCallback(async (productId: string) => {
    try {
      await api.addToCart({ sessionId, productId, quantity: 1 });
      await loadCart();
      setIsOpen(true);
    } catch (err) { console.error("Failed to add to cart:", err); }
  }, [sessionId, loadCart]);

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    try {
      await api.updateCartItem(id, quantity);
      await loadCart();
    } catch (err) { console.error("Failed to update quantity:", err); }
  }, [loadCart]);

  const removeFromCart = useCallback(async (id: string) => {
    try {
      await api.removeFromCart(id);
      await loadCart();
    } catch (err) { console.error("Failed to remove item:", err); }
  }, [loadCart]);

  const clearCart = useCallback(async () => {
    try {
      await api.clearCart(sessionId);
      setItems([]);
    } catch (err) { console.error("Failed to clear cart:", err); }
  }, [sessionId]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, total, itemCount, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}
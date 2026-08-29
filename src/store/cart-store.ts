import { create } from "zustand";
import { IProduct } from "@/interfaces";
import { toast } from "sonner";

export interface ICartItem extends IProduct {
  quantity: number;
}

export interface ICartStore {
  cartItems: ICartItem[];
  addCartItem: (product: IProduct, quantity?: number) => void;
  removeCartItem: (productId: string) => void;
  editCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<ICartStore>((set, get) => ({
  cartItems: [],
  cartCount: () => {
    const state = get();
    return state.cartItems.reduce((total, item) => total + item.quantity, 0);
  },
  addCartItem: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.cartItems.find(item => item.id === product.id);
      if (existingItem) {
        return {
          cartItems: state.cartItems.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          )
        };
      }
      return {
        cartItems: [...state.cartItems, { ...product, quantity }]
      };
    });
    toast.success(`${product.name} added to cart`);
  },
  removeCartItem: (productId) => {
    const state = get();
    const item = state.cartItems.find(item => item.id === productId);
    if (item) {
      set({ cartItems: state.cartItems.filter(item => item.id !== productId) });
      toast.info(`${item.name} removed from cart`);
    }
  },
  editCartQuantity: (productId, quantity) => {
    set((state) => ({
      cartItems: state.cartItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    }));
    toast.success(`Cart updated`);
  },
  clearCart: () => {
    set({ cartItems: [] });
    toast.info("Cart cleared");
  }
}));

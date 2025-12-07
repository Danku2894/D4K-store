import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Wishlist Store
 * Quản lý danh sách yêu thích
 */
const useWishlistStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],

      // Actions
      addToWishlist: (product) => {
        const { items } = get();
        const exists = items.find((item) => item.id === product.id);

        if (!exists) {
          set({ items: [...items, product] });
          return true;
        }
        return false;
      },

      removeFromWishlist: (productId) => {
        const { items } = get();
        set({ items: items.filter((item) => item.id !== productId) });
      },

      isInWishlist: (productId) => {
        const { items } = get();
        return items.some((item) => item.id === productId);
      },

      toggleWishlist: (product) => {
        const { items, isInWishlist, addToWishlist, removeFromWishlist } = get();
        
        if (isInWishlist(product.id)) {
          removeFromWishlist(product.id);
          return false;
        } else {
          addToWishlist(product);
          return true;
        }
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'd4k-wishlist-storage', // localStorage key
    }
  )
);

export default useWishlistStore;


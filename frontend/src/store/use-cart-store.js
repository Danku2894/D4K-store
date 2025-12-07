import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import cartService from '@services/cart-service';
import authService from '@services/auth-service';

/**
 * Cart Store
 * Quản lý giỏ hàng với Zustand (persist vào localStorage)
 */
const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      totalItems: 0,
      totalPrice: 0,

      // Actions
      addToCart: async (product, quantity = 1) => {
        // Call API first if logged in
        if (authService.isAuthenticated()) {
          try {
            await cartService.addToCart({
              productId: product.id,
              quantity: quantity,
              size: product.size || 'M',
              color: product.color || null
            });
            
            // Sync cart from backend (source of truth)
            await get().syncCart();
            return;
          } catch (error) {
            console.error('Failed to add to cart:', error);
            throw error;
          }
        }
        
        // If not logged in, update local state only
        const { items } = get();
        
        // Identify items by productId + size
        const existingItem = items.find((item) => 
          item.id === product.id && item.size === product.size
        );

        let newItems;
        if (existingItem) {
          const currentQty = existingItem.quantity;
          const maxStock = product.stock || 99;
          
          if (currentQty + quantity > maxStock) {
            const quantityToAdd = Math.max(0, maxStock - currentQty);
            if (quantityToAdd === 0) {
              return; 
            }
            
            newItems = items.map((item) =>
              item.id === product.id && item.size === product.size
                ? { ...item, quantity: item.quantity + quantityToAdd }
                : item
            );
          } else {
             newItems = items.map((item) =>
              item.id === product.id && item.size === product.size
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
        } else {
          newItems = [...items, { ...product, quantity }];
        }

        set({
          items: newItems,
          totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        });
      },

      removeFromCart: async (productId) => {
        const { items } = get();
        const newItems = items.filter((item) => item.id !== productId);

        set({
          items: newItems,
          totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        });

        if (authService.isAuthenticated()) {
          try {
             const response = await cartService.getCart();
             if (response.success && response.data) {
                 const cartItem = response.data.items.find(item => item.productId === productId);
                 if (cartItem) {
                     await cartService.removeCartItem(cartItem.id);
                 }
             }
          } catch (error) {
            console.error('Failed to sync remove with backend:', error);
          }
        }
      },

      updateQuantity: async (productId, quantity) => {
        const { items } = get();
        const newItems = items.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        );

        set({
          items: newItems,
          totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        });

        if (authService.isAuthenticated()) {
           try {
             const response = await cartService.getCart();
             if (response.success && response.data) {
                 const cartItem = response.data.items.find(item => item.productId === productId);
                 if (cartItem) {
                     await cartService.updateCartItem(cartItem.id, { quantity });
                 }
             }
          } catch (error) {
            console.error('Failed to sync update with backend:', error);
          }
        }
      },

      clearCart: async () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });

        if (authService.isAuthenticated()) {
          try {
            await cartService.clearCart();
          } catch (error) {
            console.error('Failed to clear backend cart:', error);
          }
        }
      },

      getItemQuantity: (productId) => {
        const { items } = get();
        const item = items.find((item) => item.id === productId);
        return item ? item.quantity : 0;
      },

      isSyncing: false,

      syncCart: async () => {
        if (!authService.isAuthenticated()) return;

        set({ isSyncing: true, syncError: null });
        try {
          const response = await cartService.getCart();
          
          if (response.success && response.data) {
            const backendItems = response.data.items || [];
            const { items: localItems } = get();

            // Only add items that DON'T exist in backend
            if (localItems.length > 0) {
              for (const localItem of localItems) {
                const backendItem = backendItems.find(bi => 
                  bi.productId === localItem.id && 
                  (bi.size === localItem.size || (!bi.size && !localItem.size))
                );
                
                // Only add if item doesn't exist in backend
                if (!backendItem) {
                  await cartService.addToCart({
                    productId: localItem.id,
                    quantity: localItem.quantity,
                    size: localItem.size || 'M',
                    color: localItem.color || null
                  });
                }
              }
            }
            
            // Fetch updated backend cart (source of truth)
            const finalResponse = await cartService.getCart();
            if (finalResponse.success && finalResponse.data) {
              const finalItems = finalResponse.data.items.map(item => ({
                id: item.productId,
                name: item.productName,
                price: item.productPrice,
                imageUrl: item.productImageUrl,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                stock: item.stock
              }));
              
              set({
                items: finalItems,
                totalItems: finalItems.reduce((sum, item) => sum + item.quantity, 0),
                totalPrice: finalItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                syncError: null
              });
            }
          }
        } catch (error) {
          console.error('Sync cart failed:', error);
          set({ syncError: 'FAILED TO SYNC CART. PLEASE CHECK YOUR CONNECTION.' });
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: 'd4k-cart-storage',
    }
  )
);

export default useCartStore;

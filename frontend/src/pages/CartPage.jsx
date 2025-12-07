import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Breadcrumb from '@components/common/Breadcrumb';
import CartItem from '@components/cart/CartItem';
import CartSummary from '@components/cart/CartSummary';
import useCartStore from '@store/use-cart-store';

/**
 * CartPage Component - Street Style
 * Trang giỏ hàng
 */
const CartPage = () => {
  const cartItems = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.totalItems);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const [updating, setUpdating] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Update page title
  useEffect(() => {
    document.title = `Cart (${totalItems}) - D4K Store`;
  }, [totalItems]);

  // Handle update quantity
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      setUpdating(true);
      
      // Update in Zustand store
      updateQuantity(itemId, newQuantity);
      
      // TODO: API call để update backend
      // await cartService.updateCartItem(itemId, { quantity: newQuantity });
      
      toast.success('QUANTITY UPDATED!');
    } catch (err) {
      console.error('Error updating quantity:', err);
      toast.error('FAILED TO UPDATE QUANTITY');
    } finally {
      setUpdating(false);
    }
  };

  // Handle remove item
  const handleRemoveItem = async (itemId) => {
    try {
      // Remove from Zustand store
      removeFromCart(itemId);
      
      // TODO: API call để remove từ backend
      // await cartService.removeCartItem(itemId);
      
      toast.success('ITEM REMOVED FROM CART!', {
        icon: '🗑️',
        style: {
          background: '#000000',
          color: '#ffffff',
          border: '2px solid #000000',
          fontWeight: 'bold',
        },
      });
    } catch (err) {
      console.error('Error removing item:', err);
      toast.error('FAILED TO REMOVE ITEM');
    }
  };

  // Handle clear cart
  const handleClearCart = () => {
    if (!window.confirm('CLEAR ALL ITEMS FROM CART?')) {
      return;
    }

    try {
      clearCart();
      
      // TODO: API call để clear backend cart
      // await cartService.clearCart();
      
      toast.success('CART CLEARED!', {
        icon: '🗑️',
      });
    } catch (err) {
      console.error('Error clearing cart:', err);
      toast.error('FAILED TO CLEAR CART');
    }
  };

  // Handle apply coupon
  const handleApplyCoupon = (couponData) => {
    setAppliedCoupon(couponData);
  };

  // Handle remove coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Cart', path: null },
  ];

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-light-50">
        <div className="container-street py-6">
          <Breadcrumb items={breadcrumbItems} />

          <div className="py-20 text-center">
            <div className="inline-block p-12 border-4 border-dark-950 space-y-6">
              <FiShoppingCart size={80} className="mx-auto text-gray-400" />
              
              <h1 className="text-4xl font-display font-black uppercase tracking-tight">
                YOUR CART IS EMPTY
              </h1>
              
              <p className="text-gray-600 font-medium max-w-md">
                Looks like you haven't added any items to your cart yet.
                Start shopping now!
              </p>

              <Link
                to="/products"
                className="inline-block btn-street mt-6"
              >
                START SHOPPING
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-50">
      <div className="container-street py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Header */}
        <div className="py-8 border-b-4 border-dark-950 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight mb-2 glitch-street">
                SHOPPING CART
              </h1>
              <p className="text-gray-600 font-bold uppercase tracking-wider">
                {totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'} IN YOUR CART
              </p>
            </div>

            {/* Clear Cart Button */}
            <button
              onClick={handleClearCart}
              className="flex items-center space-x-2 px-4 py-2 border-2 border-dark-950 
                       bg-transparent text-dark-950 hover:bg-street-red hover:border-street-red 
                       hover:text-light-50 font-bold uppercase text-sm tracking-wide transition-all"
            >
              <FiTrash2 size={18} />
              <span>CLEAR CART</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Side */}
          <div className="lg:col-span-2 space-y-4">
            {/* Table Header (Desktop only) */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-6 pb-4 border-b-2 border-dark-950">
              <div className="col-span-2 text-xs font-black uppercase tracking-wider">
                PRODUCT
              </div>
              <div className="col-span-5 text-xs font-black uppercase tracking-wider">
                DETAILS
              </div>
              <div className="col-span-2 text-xs font-black uppercase tracking-wider">
                QUANTITY
              </div>
              <div className="col-span-2 text-xs font-black uppercase tracking-wider">
                SUBTOTAL
              </div>
              <div className="col-span-1 text-xs font-black uppercase tracking-wider text-center">
                REMOVE
              </div>
            </div>

            {/* Cart Items List */}
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
                updating={updating}
              />
            ))}
          </div>

          {/* Cart Summary - Right Side */}
          <div className="lg:col-span-1">
            <CartSummary
              subtotal={totalPrice}
              totalItems={totalItems}
              appliedCoupon={appliedCoupon}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 pt-8 border-t-4 border-dark-950">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border-2 border-dark-950 text-center">
              <div className="text-3xl mb-3">🚚</div>
              <h3 className="text-sm font-black uppercase tracking-wider mb-2">
                FREE SHIPPING
              </h3>
              <p className="text-xs text-gray-600 font-medium">
                On all orders with no minimum
              </p>
            </div>

            <div className="p-6 border-2 border-dark-950 text-center">
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="text-sm font-black uppercase tracking-wider mb-2">
                EASY RETURNS
              </h3>
              <p className="text-xs text-gray-600 font-medium">
                30-day return policy
              </p>
            </div>

            <div className="p-6 border-2 border-dark-950 text-center">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-sm font-black uppercase tracking-wider mb-2">
                SECURE PAYMENT
              </h3>
              <p className="text-xs text-gray-600 font-medium">
                100% secure transactions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;


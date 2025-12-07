import { Link } from 'react-router-dom';
import { FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import CouponInput from './CouponInput';

/**
 * CartSummary Component - Street Style
 * Tóm tắt giỏ hàng và checkout
 * 
 * @param {Number} subtotal - Tổng tiền trước giảm giá
 * @param {Number} totalItems - Tổng số items
 * @param {Object} appliedCoupon - Coupon đã apply
 * @param {Function} onApplyCoupon - Apply coupon callback
 * @param {Function} onRemoveCoupon - Remove coupon callback
 */
const CartSummary = ({ 
  subtotal = 0, 
  totalItems = 0,
  appliedCoupon = null,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Calculate discount
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    if (appliedCoupon.discountType === 'PERCENTAGE') {
      const discount = (subtotal * appliedCoupon.discountValue) / 100;
      // Apply max discount if exists
      if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
        return appliedCoupon.maxDiscount;
      }
      return discount;
    } else {
      // Fixed amount
      return Math.min(appliedCoupon.discountValue, subtotal);
    }
  };

  const discount = calculateDiscount();
  const shipping = 0; // Free shipping
  const total = Math.max(subtotal - discount + shipping, 0);

  return (
    <div className="space-y-6 sticky top-24">
      {/* Card */}
      <div className="p-6 border-4 border-dark-950 bg-light-50 space-y-6">
        {/* Header */}
        <div className="pb-4 border-b-2 border-dark-950">
          <h2 className="text-2xl font-display font-black uppercase tracking-tight flex items-center space-x-3">
            <FiShoppingBag size={24} />
            <span>ORDER SUMMARY</span>
          </h2>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-4">
          {/* Subtotal */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-gray-600">
              SUBTOTAL ({totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'})
            </span>
            <span className="text-lg font-black">
              {formatPrice(subtotal)}
            </span>
          </div>

          {/* Discount */}
          {discount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-wider text-street-neon">
                DISCOUNT
              </span>
              <span className="text-lg font-black text-street-neon">
                -{formatPrice(discount)}
              </span>
            </div>
          )}

          {/* Shipping */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-gray-600">
              SHIPPING
            </span>
            <span className="text-lg font-black text-street-neon">
              FREE
            </span>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-dark-950"></div>

          {/* Total */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-black uppercase tracking-wider">
              TOTAL
            </span>
            <span className="text-3xl font-black text-dark-950">
              {formatPrice(total)}
            </span>
          </div>
        </div>

        {/* Coupon Input */}
        <div className="pt-4 border-t-2 border-dark-950">
          <CouponInput
            orderAmount={subtotal}
            onApplyCoupon={onApplyCoupon}
            appliedCoupon={appliedCoupon}
            onRemoveCoupon={onRemoveCoupon}
          />
        </div>

        {/* Checkout Button */}
        <Link
          to="/checkout"
          className="w-full flex items-center justify-center space-x-3 py-4 
                   bg-dark-950 border-2 border-dark-950 text-light-50 
                   font-black uppercase text-lg tracking-wider
                   hover:bg-street-red hover:border-street-red hover:scale-[1.02]
                   transition-all duration-300"
        >
          <span>PROCEED TO CHECKOUT</span>
          <FiArrowRight size={24} />
        </Link>

        {/* Continue Shopping */}
        <Link
          to="/products"
          className="w-full block text-center py-3 border-2 border-dark-950 
                   bg-transparent text-dark-950 font-bold uppercase tracking-wider
                   hover:bg-dark-950 hover:text-light-50 transition-all"
        >
          CONTINUE SHOPPING
        </Link>

        {/* Additional Info */}
        <div className="pt-4 border-t-2 border-dark-950 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
            ✓ SECURE CHECKOUT
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
            ✓ FREE SHIPPING ON ALL ORDERS
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
            ✓ 30-DAY RETURN POLICY
          </p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="p-4 border-2 border-dark-950 bg-light-100 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
          WE ACCEPT
        </p>
        <div className="flex items-center justify-center space-x-4">
          <span className="text-2xl">💳</span>
          <span className="text-2xl">💰</span>
          <span className="text-2xl">🏦</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;


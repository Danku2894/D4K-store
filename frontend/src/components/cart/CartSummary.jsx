import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Calculate discount - use discountAmount directly from backend CouponValidationResponse
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    // Backend returns discountAmount directly in CouponValidationResponse
    if (appliedCoupon.discountAmount !== undefined) {
      return parseFloat(appliedCoupon.discountAmount) || 0;
    }

    // Fallback: manual calculation if using CouponResponse
    const discountValue = parseFloat(appliedCoupon.discountValue) || 0;
    const maxDiscount = appliedCoupon.maxDiscount ? parseFloat(appliedCoupon.maxDiscount) : null;

    if (appliedCoupon.discountType === 'PERCENTAGE') {
      const discount = (subtotal * discountValue) / 100;
      if (maxDiscount && discount > maxDiscount) {
        return maxDiscount;
      }
      return discount;
    } else {
      return Math.min(discountValue, subtotal);
    }
  };

  const discount = calculateDiscount();
  const shipping = 30000; // Shipping fee (matches backend DEFAULT_SHIPPING_FEE)
  const total = Math.max(subtotal - discount + shipping, 0);

  // Handle checkout with coupon state
  const handleCheckout = () => {
    navigate('/checkout', { state: { appliedCoupon, discount } });
  };

  return (
    <div className="space-y-6 sticky top-24">
      {/* Card */}
      <div className="p-6 border-2 border-dark-950 bg-light-50 space-y-6">
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
            <span className="text-lg font-black">
              {formatPrice(shipping)}
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
        <button
          onClick={handleCheckout}
          className="w-full flex items-center justify-center space-x-3 py-4 
                   bg-dark-950 border-2 border-dark-950 text-light-50 
                   font-black uppercase text-lg tracking-wider
                   hover:bg-street-red hover:border-street-red hover:scale-[1.02]
                   transition-all duration-300"
        >
          <span>PROCEED TO CHECKOUT</span>
          <FiArrowRight size={24} />
        </button>

        {/* Continue Shopping */}
        <Link
          to="/products"
          className="w-full block text-center py-3 border-2 border-dark-950 
                   bg-transparent text-dark-950 font-bold uppercase tracking-wider
                   hover:bg-dark-950 hover:text-light-50 transition-all"
        >
          CONTINUE SHOPPING
        </Link>

      </div>
    </div>
  );
};

export default CartSummary;


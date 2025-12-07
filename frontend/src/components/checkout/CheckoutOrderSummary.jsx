import { Link } from 'react-router-dom';
import { FiShoppingBag, FiEdit } from 'react-icons/fi';

/**
 * CheckoutOrderSummary Component - Street Style
 * Tóm tắt đơn hàng trong checkout
 * 
 * @param {Array} items - Cart items
 * @param {Number} subtotal - Tổng tiền trước giảm giá
 * @param {Number} discount - Giảm giá (nếu có)
 * @param {Number} shipping - Phí ship
 * @param {Number} total - Tổng tiền
 * @param {Object} appliedCoupon - Coupon đã apply (optional)
 */
const CheckoutOrderSummary = ({ 
  items = [], 
  subtotal = 0,
  discount = 0,
  shipping = 0,
  total = 0,
  appliedCoupon = null
}) => {
  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-dark-950">
        <h2 className="text-2xl font-display font-black uppercase tracking-tight flex items-center space-x-3">
          <FiShoppingBag size={24} />
          <span>ORDER SUMMARY</span>
        </h2>
        <Link
          to="/cart"
          className="text-sm font-bold uppercase tracking-wide text-dark-950 
                   hover:text-street-red transition-colors flex items-center space-x-2"
        >
          <FiEdit size={16} />
          <span>EDIT</span>
        </Link>
      </div>

      {/* Items List */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {items.map((item) => {
          // Support both flat structure (from store/sync) and nested structure
          const product = item.product || item;
          const price = item.price || item.product?.price || 0;
          const name = item.name || item.product?.name || 'Product';
          const imageUrl = item.imageUrl || item.product?.imageUrl || '/placeholder-product.jpg';
          
          return (
            <div 
              key={item.id}
              className="flex items-center space-x-4 p-3 border-2 border-dark-950 bg-light-50"
            >
              {/* Image */}
              <div className="w-16 h-16 border-2 border-dark-950 overflow-hidden flex-shrink-0">
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover filter-grayscale-80"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold uppercase text-sm truncate">
                  {name}
                </h4>
                <p className="text-xs text-gray-600 font-bold uppercase">
                  QTY: {item.quantity}
                </p>
                {/* Variant Info */}
                {(item.size || item.color) && (
                  <div className="flex space-x-2 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                    {item.size && <span>SIZE: {item.size}</span>}
                    {item.color && <span>COLOR: {item.color}</span>}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="font-black">
                  {formatPrice(price * item.quantity)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-4 pt-4 border-t-2 border-dark-950">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-wider text-gray-600">
            SUBTOTAL ({items.length} {items.length === 1 ? 'ITEM' : 'ITEMS'})
          </span>
          <span className="text-lg font-black">
            {formatPrice(subtotal)}
          </span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold uppercase tracking-wider text-street-neon">
                DISCOUNT
              </span>
              {appliedCoupon && (
                <span className="px-2 py-0.5 bg-street-neon text-dark-950 text-xs font-bold uppercase">
                  {appliedCoupon.code}
                </span>
              )}
            </div>
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
            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
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

      {/* Additional Info */}
      <div className="pt-4 border-t-2 border-dark-950 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
          ✓ SECURE CHECKOUT
        </p>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
          ✓ FREE SHIPPING
        </p>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
          ✓ 30-DAY RETURN POLICY
        </p>
      </div>
    </div>
  );
};

export default CheckoutOrderSummary;


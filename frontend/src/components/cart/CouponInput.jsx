import { useState } from 'react';
import { FiTag, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import couponService from '@services/coupon-service';

/**
 * CouponInput Component - Street Style
 * Input field để nhập mã giảm giá
 * 
 * @param {Number} orderAmount - Tổng tiền order
 * @param {Function} onApplyCoupon - Callback khi apply thành công
 * @param {Object} appliedCoupon - Coupon đã apply
 * @param {Function} onRemoveCoupon - Callback khi remove coupon
 */
const CouponInput = ({ orderAmount, onApplyCoupon, appliedCoupon, onRemoveCoupon }) => {
  const [code, setCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error('PLEASE ENTER COUPON CODE!');
      return;
    }

    try {
      setIsApplying(true);

      const response = await couponService.applyCoupon({
        code: code.trim().toUpperCase(),
        orderAmount: orderAmount,
      });

      if (response.success && response.data) {
        toast.success('COUPON APPLIED!', {
          icon: '🎟️',
          style: {
            background: '#00FF00',
            color: '#000000',
            border: '2px solid #000000',
            fontWeight: 'bold',
          },
        });

        // Callback với coupon data
        onApplyCoupon(response.data);
        setCode('');
      }
    } catch (err) {
      console.error('Error applying coupon:', err);
      const errorMessage = err.message || 'INVALID COUPON CODE';
      toast.error(errorMessage.toUpperCase());
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemove = () => {
    onRemoveCoupon();
    setCode('');
    toast.success('COUPON REMOVED!');
  };

  // Format discount
  const formatDiscount = (coupon) => {
    if (coupon.discountType === 'PERCENTAGE') {
      return `-${coupon.discountValue}%`;
    } else {
      return `-${new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(coupon.discountValue)}`;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-black uppercase tracking-wider flex items-center space-x-2">
        <FiTag size={16} />
        <span>COUPON CODE</span>
      </h3>

      {appliedCoupon ? (
        // Applied coupon display
        <div className="p-4 border-2 border-street-neon bg-light-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FiCheck size={20} className="text-street-neon" />
            <div>
              <p className="font-black uppercase tracking-wide">
                {appliedCoupon.code}
              </p>
              <p className="text-xs font-bold text-gray-600 uppercase">
                DISCOUNT: {formatDiscount(appliedCoupon)}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="p-2 text-gray-600 hover:text-street-red transition-colors"
            aria-label="Remove coupon"
          >
            <FiX size={20} />
          </button>
        </div>
      ) : (
        // Coupon input form
        <form onSubmit={handleApply} className="flex space-x-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ENTER CODE"
            className="flex-1 px-4 py-3 border-2 border-dark-950 
                     text-dark-950 placeholder-gray-400 uppercase font-bold
                     focus:outline-none focus:border-street-red
                     transition-all"
            maxLength={20}
            disabled={isApplying}
          />
          <button
            type="submit"
            disabled={isApplying || !code.trim()}
            className="px-6 py-3 bg-dark-950 border-2 border-dark-950 text-light-50 
                     font-black uppercase tracking-wider
                     hover:bg-street-red hover:border-street-red hover:scale-105
                     transition-all
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isApplying ? 'APPLYING...' : 'APPLY'}
          </button>
        </form>
      )}

      {/* Available coupons hint */}
      {!appliedCoupon && (
        <p className="text-xs text-gray-600 font-medium">
          Have a coupon code? Enter it above to get a discount!
        </p>
      )}
    </div>
  );
};

export default CouponInput;


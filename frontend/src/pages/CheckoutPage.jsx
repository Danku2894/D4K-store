import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Breadcrumb from '@components/common/Breadcrumb';
import AddressSelector from '@components/checkout/AddressSelector';
import PaymentMethodSelector from '@components/checkout/PaymentMethodSelector';
import CheckoutOrderSummary from '@components/checkout/CheckoutOrderSummary';
import useCartStore from '@store/use-cart-store';
import orderService from '@services/order-service';
import addressService from '@services/address-service';

/**
 * CheckoutPage Component - Street Style
 * Trang checkout với step-by-step flow
 */
const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Cart state
  const cartItems = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const syncCart = useCartStore((state) => state.syncCart);
  const isSyncing = useCartStore((state) => state.isSyncing);

  // Checkout state
  const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: Payment, 3: Review
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('COD');
  // Receive coupon from CartPage navigation state
  const [appliedCoupon, setAppliedCoupon] = useState(location.state?.appliedCoupon || null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Sync cart and fetch addresses on mount
  useEffect(() => {
    syncCart();
    fetchAddresses();
  }, []);

  // Check if cart is empty

  // Update page title
  useEffect(() => {
    document.title = 'Checkout - D4K Store';
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const response = await addressService.getMyAddresses();
      
      if (response.success && response.data) {
        setAddresses(response.data);
        
        // Auto-select default address
        const defaultAddress = response.data.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        } else if (response.data.length > 0) {
          setSelectedAddressId(response.data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
      // Continue with empty addresses (user can add new)
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleAddAddress = async (addressData) => {
    try {
      const response = await addressService.addAddress(addressData);
      
      if (response.success && response.data) {
        toast.success('ADDRESS ADDED!');
        await fetchAddresses();
        setSelectedAddressId(response.data.id);
      }
    } catch (err) {
      console.error('Error adding address:', err);
      toast.error('FAILED TO ADD ADDRESS');
    }
  };

  const handleContinueToPayment = () => {
    if (!selectedAddressId) {
      toast.error('PLEASE SELECT AN ADDRESS!');
      return;
    }
    setCurrentStep(2);
  };

  const handleContinueToReview = () => {
    if (!selectedPaymentMethod) {
      toast.error('PLEASE SELECT A PAYMENT METHOD!');
      return;
    }
    setCurrentStep(3);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId || !selectedPaymentMethod) {
      toast.error('PLEASE COMPLETE ALL STEPS!');
      return;
    }

    try {
      setIsSubmitting(true);

      const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
      if (!selectedAddress) {
        toast.error('ADDRESS NOT FOUND!');
        return;
      }

      const orderData = {
        receiverName: selectedAddress.receiverName,
        receiverPhone: selectedAddress.phone,
        shippingAddress: selectedAddress.address,
        shippingCity: selectedAddress.city,
        shippingDistrict: selectedAddress.district,
        paymentMethod: selectedPaymentMethod,
        couponCode: appliedCoupon?.code || null,
        note: note,
      };

      const response = await orderService.createOrder(orderData);

      if (response.success && response.data) {
        // Handle VNPAY Redirect
        if (selectedPaymentMethod === 'VNPAY') {
           try {
              const orderId = response.data.id;
              // Use total from calculation (ensure it's updated or pass the one from order response if available)
              // Here we use 'total' calculated in the component
              
              // Note: paymentService needs to be imported
              const paymentUrlRes = await import('@services/payment-service').then(m => m.default.createVnPayUrl(total, `Thanh toan don hang #${orderId}`, orderId));
              console.log('Payment URL Response:', paymentUrlRes);
              
              if (paymentUrlRes.success && paymentUrlRes.data) {
                  window.location.href = paymentUrlRes.data;
                  return;
              } else {
                  console.error('Payment URL creation failed:', paymentUrlRes);
                  toast.error(`FAILED TO CREATE PAYMENT URL: ${paymentUrlRes?.message || 'Unknown error'}`);
                  navigate(`/order-success/${response.data.id}`);
              }
           } catch (payErr) {
              console.error('VNPAY Error:', payErr);
              toast.error('PAYMENT ERROR, ORDER PLACED AS UNPAID');
              navigate(`/order-success/${response.data.id}`);
           }
           setIsSubmitting(false); // Only if redirect fails or logic ends here
           return;
        }

        // For COD or other methods that don't redirect externally immediately
        clearCart();
        toast.success('ORDER PLACED SUCCESSFULLY!', {
          icon: '🎉',
          duration: 5000,
          style: {
            background: '#00FF00',
            color: '#000000',
            border: '2px solid #000000',
            fontWeight: 'bold',
          },
        });

        // Navigate to success page
        navigate(`/order-success/${response.data.id}`);
      }
    } catch (err) {
      console.error('Error placing order:', err);
      const errorMessage = err.message || 'FAILED TO PLACE ORDER';
      toast.error(errorMessage.toUpperCase());
    } finally {
      if (selectedPaymentMethod !== 'VNPAY') {
          setIsSubmitting(false);
      }
    }
  };

  // Calculate totals - use discountAmount directly from CouponValidationResponse
  const calculateDiscount = (amount, coupon) => {
    if (!coupon) return 0;

    // Backend returns discountAmount directly in CouponValidationResponse
    if (coupon.discountAmount !== undefined) {
      return parseFloat(coupon.discountAmount) || 0;
    }

    // Fallback: manual calculation
    const discountValue = parseFloat(coupon.discountValue) || 0;
    if (coupon.discountType === 'PERCENTAGE') {
      const maxDiscount = coupon.maxDiscount ? parseFloat(coupon.maxDiscount) : null;
      const discount = (amount * discountValue) / 100;
      return maxDiscount ? Math.min(discount, maxDiscount) : discount;
    } else {
      return Math.min(discountValue, amount);
    }
  };

  const discount = appliedCoupon ? calculateDiscount(totalPrice, appliedCoupon) : 0;
  const shipping = 30000; // Shipping fee (matches backend DEFAULT_SHIPPING_FEE)
  const total = Math.max(totalPrice - discount + shipping, 0);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Cart', path: '/cart' },
    { label: 'Checkout', path: null },
  ];

  // Steps
  const steps = [
    { number: 1, title: 'ADDRESS', completed: currentStep > 1 },
    { number: 2, title: 'PAYMENT', completed: currentStep > 2 },
    { number: 3, title: 'REVIEW', completed: false },
  ];

  return (
    <div className="min-h-screen bg-light-50">
      <div className="container-street py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Header */}
        <div className="py-8 border-b-4 border-dark-950 mb-8">
          <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight glitch-street">
            CHECKOUT
          </h1>
        </div>

        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                {/* Step Circle */}
                <div
                  className={`
                    relative flex items-center justify-center w-12 h-12 border-2 
                    transition-all font-black
                    ${currentStep === step.number
                      ? 'border-street-red bg-street-red text-light-50 scale-110'
                      : step.completed
                      ? 'border-street-neon bg-street-neon text-dark-950'
                      : 'border-dark-950 bg-transparent text-dark-950'
                    }
                  `}
                >
                  {step.completed ? (
                    <FiCheckCircle size={24} />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>

                {/* Step Label */}
                <span className={`
                  ml-3 text-sm font-black uppercase tracking-wider hidden sm:inline
                  ${currentStep === step.number ? 'text-dark-950' : 'text-gray-600'}
                `}>
                  {step.title}
                </span>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`
                    w-12 md:w-24 h-0.5 mx-4
                    ${step.completed ? 'bg-street-neon' : 'bg-gray-300'}
                  `}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Steps Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Address */}
            <div className={`
              p-6 border-4 border-dark-950 bg-light-50
              ${currentStep !== 1 && 'opacity-50'}
            `}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-display font-black uppercase tracking-tight">
                  STEP 1: ADDRESS
                </h3>
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-sm font-bold uppercase tracking-wide text-dark-950 
                             hover:text-street-red transition-colors"
                  >
                    CHANGE
                  </button>
                )}
              </div>

              {currentStep === 1 ? (
                <>
                  {loadingAddresses ? (
                    <div className="animate-pulse space-y-3">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="h-24 bg-light-200 border-2 border-gray-300"></div>
                      ))}
                    </div>
                  ) : (
                    <AddressSelector
                      addresses={addresses}
                      selectedAddressId={selectedAddressId}
                      onSelectAddress={setSelectedAddressId}
                      onAddAddress={handleAddAddress}
                    />
                  )}

                  <div className="mt-6">
                    <button
                      onClick={handleContinueToPayment}
                      className="w-full py-4 bg-dark-950 border-2 border-dark-950 text-light-50 
                               font-black uppercase text-lg tracking-wider
                               hover:bg-street-red hover:border-street-red hover:scale-[1.02]
                               transition-all"
                    >
                      CONTINUE TO PAYMENT
                    </button>
                  </div>
                </>
              ) : (
                // Summary view
                addresses.find(addr => addr.id === selectedAddressId) && (
                  <div className="p-4 border-2 border-street-neon bg-street-neon/10">
                    <p className="font-black uppercase mb-2">
                      {addresses.find(addr => addr.id === selectedAddressId).fullName}
                    </p>
                    <p className="text-sm text-gray-700">
                      {addresses.find(addr => addr.id === selectedAddressId).street}, {' '}
                      {addresses.find(addr => addr.id === selectedAddressId).ward}, {' '}
                      {addresses.find(addr => addr.id === selectedAddressId).district}, {' '}
                      {addresses.find(addr => addr.id === selectedAddressId).city}
                    </p>
                  </div>
                )
              )}
            </div>

            {/* Step 2: Payment */}
            <div className={`
              p-6 border-4 border-dark-950 bg-light-50
              ${currentStep < 2 && 'opacity-50 pointer-events-none'}
            `}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-display font-black uppercase tracking-tight">
                  STEP 2: PAYMENT
                </h3>
                {currentStep > 2 && (
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-sm font-bold uppercase tracking-wide text-dark-950 
                             hover:text-street-red transition-colors"
                  >
                    CHANGE
                  </button>
                )}
              </div>

              {currentStep === 2 ? (
                <>
                  <PaymentMethodSelector
                    selectedMethod={selectedPaymentMethod}
                    onSelectMethod={setSelectedPaymentMethod}
                  />

                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 py-4 bg-transparent border-2 border-dark-950 text-dark-950 
                               font-black uppercase tracking-wider
                               hover:bg-dark-950 hover:text-light-50 transition-all"
                    >
                      BACK
                    </button>
                    <button
                      onClick={handleContinueToReview}
                      className="flex-1 py-4 bg-dark-950 border-2 border-dark-950 text-light-50 
                               font-black uppercase tracking-wider
                               hover:bg-street-red hover:border-street-red hover:scale-[1.02]
                               transition-all"
                    >
                      CONTINUE TO REVIEW
                    </button>
                  </div>
                </>
              ) : currentStep > 2 ? (
                // Summary view
                <div className="p-4 border-2 border-street-neon bg-street-neon/10">
                  <p className="font-black uppercase">
                    {selectedPaymentMethod === 'COD' ? 'CASH ON DELIVERY' : selectedPaymentMethod}
                  </p>
                </div>
              ) : null}
            </div>

            {/* Step 3: Review & Place Order */}
            <div className={`
              p-6 border-4 border-dark-950 bg-light-50
              ${currentStep < 3 && 'opacity-50 pointer-events-none'}
            `}>
              <h3 className="text-2xl font-display font-black uppercase tracking-tight mb-6">
                STEP 3: REVIEW & PLACE ORDER
              </h3>

              {currentStep === 3 && (
                <>
                  {/* Terms & Conditions */}
                  <div className="p-4 border-2 border-dark-950 bg-light-100 mb-6">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 border-2 border-dark-950 mt-1"
                      />
                      <span className="text-sm text-gray-700 font-medium">
                        I agree to the{' '}
                        <a href="/terms" className="text-dark-950 font-bold underline hover:text-street-red">
                          Terms & Conditions
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" className="text-dark-950 font-bold underline hover:text-street-red">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>

                  {/* Order Note (Optional) */}
                  <div className="mb-6">
                    <label className="block text-xs font-black uppercase tracking-wider mb-2">
                      ORDER NOTE (OPTIONAL)
                    </label>
                    <textarea
                      placeholder="ADD A NOTE FOR YOUR ORDER..."
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-dark-950 
                               text-dark-950 placeholder-gray-400 uppercase font-bold
                               focus:outline-none focus:border-street-red resize-none"
                      maxLength={200}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 py-4 bg-transparent border-2 border-dark-950 text-dark-950 
                               font-black uppercase tracking-wider
                               hover:bg-dark-950 hover:text-light-50 transition-all"
                    >
                      BACK
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting || isSyncing}
                      className="flex-1 py-4 bg-dark-950 border-2 border-dark-950 text-light-50 
                               font-black uppercase text-lg tracking-wider
                               hover:bg-street-red hover:border-street-red hover:scale-[1.02]
                               transition-all
                               disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isSubmitting ? 'PLACING ORDER...' : isSyncing ? 'SYNCING CART...' : 'PLACE ORDER'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 border-4 border-dark-950 bg-light-50">
              <CheckoutOrderSummary
                items={cartItems}
                subtotal={totalPrice}
                discount={discount}
                shipping={shipping}
                total={total}
                appliedCoupon={appliedCoupon}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;


import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiHome, FiList } from 'react-icons/fi';
import orderService from '@services/order-service';

/**
 * OrderSuccessPage Component - Street Style
 * Trang thông báo đặt hàng thành công
 */
const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Order Success - D4K Store';
    
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(orderId);
      
      if (response.success && response.data) {
        setOrder(response.data);
      }
    } catch (err) {
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚙️</div>
          <p className="text-xl font-black uppercase tracking-wide">
            LOADING ORDER DETAILS...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-50">
      <div className="container-street py-12">
        {/* Success Message */}
        <div className="text-center py-12 mb-8">
          <div className="inline-block mb-6">
            <div className="w-24 h-24 mx-auto bg-street-neon border-4 border-dark-950 
                          flex items-center justify-center">
              <FiCheckCircle size={48} className="text-dark-950" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight mb-4 glitch-street">
            ORDER PLACED!
          </h1>
          
          <p className="text-xl text-gray-700 font-bold uppercase tracking-wide mb-2">
            THANK YOU FOR YOUR ORDER
          </p>

          {order && (
            <p className="text-lg text-gray-600 font-medium">
              Order ID: <span className="font-black text-dark-950">#{order.id}</span>
            </p>
          )}

          {/* Decorative Line */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <div className="w-20 h-1 bg-dark-950"></div>
            <div className="w-2 h-2 bg-street-red"></div>
            <div className="w-20 h-1 bg-dark-950"></div>
          </div>
        </div>

        {/* Order Details */}
        {order && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Order Info */}
            <div className="p-6 border-4 border-dark-950 bg-light-50">
              <h2 className="text-2xl font-display font-black uppercase tracking-tight mb-6">
                ORDER DETAILS
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Number */}
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-gray-600 mb-2">
                    ORDER NUMBER
                  </p>
                  <p className="text-lg font-black">
                    #{order.id}
                  </p>
                </div>

                {/* Order Date */}
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-gray-600 mb-2">
                    ORDER DATE
                  </p>
                  <p className="text-lg font-black">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                {/* Payment Method */}
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-gray-600 mb-2">
                    PAYMENT METHOD
                  </p>
                  <p className="text-lg font-black">
                    {order.paymentMethod === 'COD' ? 'CASH ON DELIVERY' : order.paymentMethod}
                  </p>
                </div>

                {/* Total Amount */}
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-gray-600 mb-2">
                    TOTAL AMOUNT
                  </p>
                  <p className="text-2xl font-black text-street-red">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mt-6 pt-6 border-t-2 border-dark-950">
                <p className="text-xs font-black uppercase tracking-wider text-gray-600 mb-3">
                  DELIVERY ADDRESS
                </p>
                <div className="p-4 border-2 border-dark-950 bg-light-100">
                  <p className="font-black uppercase mb-1">
                    {order.receiverName}
                  </p>
                  <p className="text-sm font-bold text-gray-700 mb-1">
                    {order.receiverPhone}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress}, {order.shippingDistrict}, {order.shippingCity}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-6 pt-6 border-t-2 border-dark-950">
                <p className="text-xs font-black uppercase tracking-wider text-gray-600 mb-3">
                  ORDER ITEMS ({order.items?.length || 0})
                </p>
                <div className="space-y-3">
                  {order.items?.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center space-x-4 p-3 border-2 border-dark-950"
                    >
                      <div className="w-16 h-16 border-2 border-dark-950 overflow-hidden flex-shrink-0">
                        <img
                          src={item.productImageUrl || '/placeholder-product.jpg'}
                          alt={item.productName}
                          className="w-full h-full object-cover filter-grayscale-80"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-bold uppercase text-sm">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-600 font-bold">
                          QTY: {item.quantity}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-black">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="p-6 border-2 border-dark-950 bg-light-100">
              <h3 className="text-lg font-black uppercase tracking-wide mb-4">
                WHAT'S NEXT?
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-3">
                  <span className="text-street-neon text-xl flex-shrink-0">✓</span>
                  <p className="text-sm text-gray-700 font-medium">
                    <span className="font-bold text-dark-950">Order Confirmation:</span> Check your email for order confirmation
                  </p>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-street-neon text-xl flex-shrink-0">✓</span>
                  <p className="text-sm text-gray-700 font-medium">
                    <span className="font-bold text-dark-950">Processing:</span> We'll process your order within 24 hours
                  </p>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-street-neon text-xl flex-shrink-0">✓</span>
                  <p className="text-sm text-gray-700 font-medium">
                    <span className="font-bold text-dark-950">Delivery:</span> Estimated 3-5 business days
                  </p>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/"
                className="flex items-center justify-center space-x-2 py-4 border-2 border-dark-950 
                         bg-transparent text-dark-950 font-black uppercase tracking-wider
                         hover:bg-dark-950 hover:text-light-50 transition-all"
              >
                <FiHome size={20} />
                <span>HOME</span>
              </Link>

              <Link
                to="/products"
                className="flex items-center justify-center space-x-2 py-4 border-2 border-dark-950 
                         bg-transparent text-dark-950 font-black uppercase tracking-wider
                         hover:bg-dark-950 hover:text-light-50 transition-all"
              >
                <FiPackage size={20} />
                <span>SHOP MORE</span>
              </Link>

              <Link
                to="/orders"
                className="flex items-center justify-center space-x-2 py-4 bg-dark-950 
                         border-2 border-dark-950 text-light-50 font-black uppercase tracking-wider
                         hover:bg-street-red hover:border-street-red hover:scale-[1.02]
                         transition-all"
              >
                <FiList size={20} />
                <span>MY ORDERS</span>
              </Link>
            </div>
          </div>
        )}

        {/* No Order Found */}
        {!order && !loading && (
          <div className="text-center py-12">
            <p className="text-xl font-black uppercase tracking-wide text-gray-600">
              ORDER NOT FOUND
            </p>
            <Link to="/" className="btn-street mt-6 inline-block">
              GO HOME
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSuccessPage;


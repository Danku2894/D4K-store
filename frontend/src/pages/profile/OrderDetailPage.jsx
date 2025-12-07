import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiMapPin, FiCreditCard, FiClock } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Breadcrumb from '@components/common/Breadcrumb';
import orderService from '@services/order-service';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    document.title = `Order #${id} - D4K Store`;
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(id);
      if (response.success) {
        setOrder(response.data);
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      toast.error('FAILED TO LOAD ORDER');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      setCancelling(true);
      const response = await orderService.cancelOrder(id, 'User cancelled');
      if (response.success) {
        toast.success('ORDER CANCELLED SUCCESSFULLY');
        fetchOrder();
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      toast.error('FAILED TO CANCEL ORDER');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-street-yellow text-dark-950';
      case 'PAID': return 'bg-street-blue text-white';
      case 'SHIPPING': return 'bg-purple-500 text-white';
      case 'DELIVERED': return 'bg-green-500 text-white';
      case 'CANCELLED': return 'bg-red-500 text-white';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const breadcrumbItems = [
    { label: 'My Account', path: '/profile' },
    { label: 'Orders', path: '/profile/orders' },
    { label: `#${id}`, path: `/profile/orders/${id}` },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-light-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-dark-950 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-light-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-black uppercase mb-4">Order Not Found</h1>
        <Link to="/profile/orders" className="btn-street">Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-50">
      <div className="container-street py-6">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mb-8">
          <Link to="/profile/orders" className="inline-flex items-center gap-2 font-bold uppercase text-gray-600 hover:text-dark-950 mb-4">
            <FiArrowLeft /> Back to Orders
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight">
                ORDER #{order.id}
              </h1>
              <p className="text-gray-600 font-bold uppercase mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>
            <span className={`px-4 py-2 text-lg font-black uppercase border-2 border-dark-950 ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Items */}
          <div className="lg:col-span-2 space-y-8">
            <div className="border-2 border-dark-950 bg-white p-6">
              <h2 className="text-xl font-display font-black uppercase mb-6 flex items-center gap-2">
                <FiPackage /> Order Items
              </h2>
              <div className="space-y-6">
                {order.orderItems?.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-6 border-b-2 border-gray-100 last:border-0 last:pb-0">
                    <div className="w-20 h-20 bg-gray-200 border-2 border-dark-950 flex items-center justify-center shrink-0">
                      <FiPackage size={24} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg uppercase mb-1">{item.productName}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {item.color && `Color: ${item.color}`} {item.size && `| Size: ${item.size}`}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="font-mono font-bold text-gray-600">
                          {item.price?.toLocaleString('vi-VN')}đ x {item.quantity}
                        </p>
                        <p className="font-display font-black text-xl">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline (Simplified) */}
            <div className="border-2 border-dark-950 bg-white p-6">
              <h2 className="text-xl font-display font-black uppercase mb-6 flex items-center gap-2">
                <FiClock /> Order Status
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-street-blue border-2 border-dark-950"></div>
                    <div className="w-0.5 h-full bg-gray-200 my-1"></div>
                  </div>
                  <div>
                    <p className="font-bold uppercase">Order Placed</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {/* Add more timeline items based on status if needed */}
              </div>
            </div>
          </div>

          {/* Sidebar - Summary & Info */}
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="border-2 border-dark-950 bg-white p-6">
              <h2 className="text-xl font-display font-black uppercase mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 font-bold">
                  <span>Subtotal</span>
                  <span>{order.totalAmount?.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-gray-600 font-bold">
                  <span>Shipping</span>
                  <span>0đ</span>
                </div>
                <div className="pt-3 border-t-2 border-dark-950 flex justify-between text-xl font-black uppercase">
                  <span>Total</span>
                  <span>{order.totalAmount?.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
              
              {order.status === 'PENDING' && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="w-full py-3 bg-white text-street-red border-2 border-street-red font-black uppercase hover:bg-street-red hover:text-white transition-colors disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
            </div>

            {/* Shipping Info */}
            <div className="border-2 border-dark-950 bg-white p-6">
              <h2 className="text-xl font-display font-black uppercase mb-6 flex items-center gap-2">
                <FiMapPin /> Shipping Address
              </h2>
              <div className="text-gray-600 font-medium">
                <p className="font-bold text-dark-950 uppercase mb-1">{order.receiverName}</p>
                <p className="mb-1">{order.receiverPhone}</p>
                <p>{order.shippingAddress}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="border-2 border-dark-950 bg-white p-6">
              <h2 className="text-xl font-display font-black uppercase mb-6 flex items-center gap-2">
                <FiCreditCard /> Payment
              </h2>
              <div className="text-gray-600 font-medium">
                <p className="uppercase">Method: {order.paymentMethod}</p>
                <p className="uppercase">Status: {order.paymentStatus || 'UNPAID'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;

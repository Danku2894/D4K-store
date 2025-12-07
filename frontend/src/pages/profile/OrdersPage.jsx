import { useState, useEffect } from 'react';
import { FiPackage } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Breadcrumb from '@components/common/Breadcrumb';
import AccountNav from '@components/profile/AccountNav';
import OrderCard from '@components/profile/OrderCard';
import orderService from '@services/order-service';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'My Orders - D4K Store';
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMyOrders();
      if (response.success) {
        setOrders(response.data.content || response.data); // Handle pagination response
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error('FAILED TO LOAD ORDERS');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'My Account', path: '/profile' },
    { label: 'Orders', path: '/profile/orders' },
  ];

  return (
    <div className="min-h-screen bg-light-50">
      <div className="container-street py-6">
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Header */}
        <div className="py-8 border-b-4 border-dark-950 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <FiPackage size={48} className="text-dark-950" />
            <div>
              <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight glitch-street">
                MY ORDERS
              </h1>
              <p className="text-gray-600 font-bold uppercase tracking-wide mt-2">
                TRACK AND MANAGE YOUR PURCHASES
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <AccountNav />
          </aside>

          <main className="lg:col-span-3">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 bg-light-200 animate-pulse border-4 border-gray-300"></div>
                ))}
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-4 border-gray-200 bg-white">
                <p className="text-gray-400 font-bold uppercase text-lg mb-4">
                  No orders found
                </p>
                <a href="/products" className="btn-street inline-block">
                  START SHOPPING
                </a>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiMapPin, FiCreditCard, FiClock, FiUser, FiSave } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import orderService from '@services/order-service';

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    document.title = `Admin Order #${id} - D4K Store`;
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderByIdAdmin(id);
      if (response.success) {
        setOrder(response.data);
        setStatus(response.data.status);
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      toast.error('FAILED TO LOAD ORDER');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      const response = await orderService.updateOrderStatus(id, status);
      if (response.success) {
        toast.success('ORDER STATUS UPDATED SUCCESSFULLY');
        setOrder(response.data);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('FAILED TO UPDATE STATUS');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-400 text-dark-950';
      case 'CONFIRMED': return 'bg-blue-400 text-white';
      case 'SHIPPED': return 'bg-purple-500 text-white';
      case 'DELIVERED': return 'bg-green-500 text-white';
      case 'CANCELLED': return 'bg-red-500 text-white';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-dark-950 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-black uppercase mb-4">Order Not Found</h1>
          <Link to="/admin/orders" className="btn-street">Back to Orders</Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link to="/admin/orders" className="inline-flex items-center gap-2 font-bold uppercase text-gray-600 hover:text-dark-950 mb-4">
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
            
            <div className="flex items-center gap-4">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 border-2 border-dark-950 font-bold uppercase bg-white focus:outline-none focus:border-street-red"
              >
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
              
              <button
                onClick={handleStatusUpdate}
                disabled={updating || status === order.status}
                className="flex items-center gap-2 px-6 py-2 bg-dark-950 text-light-50 border-2 border-dark-950 font-bold uppercase hover:bg-street-red hover:border-street-red transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave /> {updating ? 'Saving...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Items */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <div className="border-2 border-dark-950 bg-white p-6">
              <h2 className="text-xl font-display font-black uppercase mb-6 flex items-center gap-2">
                <FiPackage /> Order Items
              </h2>
              <div className="space-y-6">
                {order.orderItems?.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-6 border-b-2 border-gray-100 last:border-0 last:pb-0">
                    <div className="w-20 h-20 bg-gray-200 border-2 border-dark-950 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                      ) : (
                        <FiPackage size={24} className="text-gray-400" />
                      )}
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

            {/* Timeline/Status Info */}
            <div className="border-2 border-dark-950 bg-white p-6">
              <h2 className="text-xl font-display font-black uppercase mb-6 flex items-center gap-2">
                <FiClock /> Order History
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-dark-950 border-2 border-dark-950"></div>
                    <div className="w-0.5 h-full bg-gray-200 my-1"></div>
                  </div>
                  <div>
                    <p className="font-bold uppercase">Order Placed</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {order.updatedAt && order.updatedAt !== order.createdAt && (
                  <div className="flex gap-4">
                    <div className="w-8 flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-street-blue border-2 border-dark-950"></div>
                    </div>
                    <div>
                      <p className="font-bold uppercase">Last Updated</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Customer & Payment Info */}
          <div className="space-y-8">
            {/* Customer Info */}
            <div className="border-2 border-dark-950 bg-white p-6">
              <h2 className="text-xl font-display font-black uppercase mb-6 flex items-center gap-2">
                <FiUser /> Customer Info
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Name</p>
                  <p className="font-bold text-lg">{order.receiverName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Phone</p>
                  <p className="font-bold">{order.receiverPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">User Account</p>
                  <p className="font-bold">{order.userName || 'Guest'}</p>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="border-2 border-dark-950 bg-white p-6">
              <h2 className="text-xl font-display font-black uppercase mb-6 flex items-center gap-2">
                <FiMapPin /> Shipping Address
              </h2>
              <div className="text-gray-600 font-medium">
                <p>{order.shippingAddress}</p>
                <p>{order.shippingDistrict}, {order.shippingCity}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="border-2 border-dark-950 bg-white p-6">
              <h2 className="text-xl font-display font-black uppercase mb-6 flex items-center gap-2">
                <FiCreditCard /> Payment
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-bold">Method</span>
                  <span className="font-black uppercase">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-bold">Status</span>
                  <span className={`font-black uppercase px-2 py-0.5 text-xs ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {order.paymentStatus || 'PENDING'}
                  </span>
                </div>
                <div className="pt-3 border-t-2 border-dark-950 flex justify-between text-xl font-black uppercase">
                  <span>Total</span>
                  <span>{order.totalAmount?.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderDetailPage;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiEye, FiSearch } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import orderService from '@services/order-service';

/**
 * AdminOrders Component - Street Style
 * Quản lý đơn hàng
 */
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    document.title = 'Orders - D4K Admin';
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders({
        page: currentPage,
        size: pageSize,
        search: searchQuery,
      });

      if (response.success && response.data) {
        setOrders(response.data.content);
        setTotalPages(response.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      
      // Mock data
      setOrders([
        { id: 101, userName: 'John Doe', totalAmount: 1250000, status: 'PENDING', createdAt: '2023-11-20' },
        { id: 102, userName: 'Jane Smith', totalAmount: 890000, status: 'SHIPPED', createdAt: '2023-11-19' },
        { id: 103, userName: 'Mike Ross', totalAmount: 450000, status: 'DELIVERED', createdAt: '2023-11-18' },
      ]);
      setTotalPages(1);
      
      toast('USING MOCK DATA', { icon: 'ℹ️', duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await orderService.updateOrderStatus(id, newStatus);
      toast.success(`ORDER #${id} STATUS UPDATED!`);
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('FAILED TO UPDATE STATUS');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-dark-950 mb-2 glitch-street">
              ORDERS
            </h1>
            <p className="text-gray-600 font-bold uppercase tracking-wide">
              TRACK & MANAGE ORDERS
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
              <FiSearch size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH ORDERS..."
              className="w-full pl-12 pr-4 py-3 border-2 border-dark-950 bg-light-50
                       text-dark-950 placeholder-gray-400 uppercase font-bold
                       focus:outline-none focus:border-street-red transition-all"
            />
          </div>
          <button
            onClick={() => { setCurrentPage(0); fetchOrders(); }}
            className="px-6 py-3 border-2 border-dark-950 bg-dark-950 text-light-50
                     hover:bg-street-red hover:border-street-red font-bold uppercase
                     tracking-wide transition-all"
          >
            SEARCH
          </button>
        </div>

        {/* Orders Table */}
        <div className="border-4 border-dark-950 bg-light-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-dark-950 text-light-50">
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                    ORDER ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                    CUSTOMER
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                    DATE
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                    TOTAL
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-dark-950">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center">
                      <div className="animate-pulse text-sm font-bold uppercase tracking-wide text-gray-600">
                        LOADING...
                      </div>
                    </td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-light-100 transition-colors">
                      <td className="px-4 py-3 text-sm font-bold">
                        #{order.id}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold uppercase">
                        {order.userName || 'Guest'}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm font-black">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className={`
                            px-2 py-1 text-xs uppercase border-2 border-dark-950 font-bold cursor-pointer
                            ${order.status === 'PENDING' ? 'bg-yellow-400' : 
                              order.status === 'SHIPPED' ? 'bg-blue-400' :
                              order.status === 'DELIVERED' ? 'bg-street-neon' :
                              'bg-street-red text-light-50'}
                          `}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center space-x-2">
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="p-2 border-2 border-dark-950 hover:bg-dark-950 
                                     hover:text-light-50 transition-all"
                            title="View Details"
                          >
                            <FiEye size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center">
                      <FiShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-sm font-bold uppercase tracking-wide text-gray-600">
                        NO ORDERS FOUND
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-4 py-2 border-2 border-dark-950 bg-dark-950 text-light-50
                         font-bold uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                PREV
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`px-4 py-2 border-2 border-dark-950 font-bold uppercase text-sm transition-all
                    ${currentPage === i 
                      ? 'bg-street-red text-light-50' 
                      : 'bg-light-50 text-dark-950 hover:bg-dark-950 hover:text-light-50'
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 border-2 border-dark-950 bg-dark-950 text-light-50
                         font-bold uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                NEXT
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;

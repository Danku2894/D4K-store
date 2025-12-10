import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiDollarSign, 
  FiShoppingBag, 
  FiUsers, 
  FiPackage,
  FiTag,
  FiLayers,
  FiTrendingUp,
  FiArrowRight,
  FiActivity
} from 'react-icons/fi';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { toast } from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import StatsCard from '@components/admin/StatsCard';
import dashboardService from '@services/dashboard-service';
import orderService from '@services/order-service';

/**
 * AdminDashboard Component - Street Style Redesign
 */
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Dashboard - D4K Admin';
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Calculate date range for sales data (Last 7 days)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 6);

      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      // Parallel Fetch
      const [overviewRes, salesRes, topProductsRes, ordersRes] = await Promise.all([
        dashboardService.getDashboardOverview().catch(() => null),
        dashboardService.getSalesData('DAILY', startDateStr, endDateStr).catch(() => null),
        dashboardService.getTopProducts(5).catch(() => null),
        orderService.getAllOrders({ page: 0, size: 5 }).catch(() => null)
      ]);

      // 1. Set Overview Stats
      if (overviewRes && overviewRes.success) {
        setStats(overviewRes.data);
      } else if (overviewRes && !overviewRes.success) {
         // Fallback if response structure is direct data (legacy check)
         setStats(overviewRes);
      }

      // 2. Set Sales Data
      if (salesRes && salesRes.data) {
        // Map backend response to Chart format
        // Backend: { date: "2024-12-10", revenue: 100000, orderCount: 2 }
        // Chart: { name: "10/12", revenue: 100000, orders: 2 }
        const formattedSales = salesRes.data.map(item => ({
          name: item.date.split('-').slice(1).reverse().join('/'), // 2024-12-10 -> 10/12
          revenue: item.revenue,
          orders: item.orderCount
        }));
        setSalesData(formattedSales);
      }

      // 3. Set Top Products
      if (topProductsRes && topProductsRes.data) {
        setTopProducts(topProductsRes.data.topProducts || []);
      }

      // 4. Set Recent Orders
      if (ordersRes && ordersRes.success && ordersRes.data) {
        setRecentOrders(ordersRes.data.content);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      toast.error('FAILED TO LOAD DASHBOARD DATA');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const quickActions = [
    { path: '/admin/products', icon: FiPackage, label: 'Add Product', color: 'bg-street-neon text-dark-950' },
    { path: '/admin/orders', icon: FiShoppingBag, label: 'View Orders', color: 'bg-street-red text-light-50' },
    { path: '/admin/users', icon: FiUsers, label: 'Manage Users', color: 'bg-dark-950 text-light-50' },
    { path: '/admin/coupons', icon: FiTag, label: 'Create Coupon', color: 'bg-yellow-400 text-dark-950' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-dark-950 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter text-dark-950 leading-none glitch-street">
              Dashboard
            </h1>
            <p className="text-gray-600 font-bold uppercase tracking-widest mt-2">
              Welcome back, Admin
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchAllData} className="btn-street-sm bg-white">
              Refresh Data
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            icon={FiDollarSign}
            label="Total Revenue"
            value={formatCurrency(stats?.totalRevenue || 0)}
            change={null} 
            changeLabel="vs last month"
          />
          <StatsCard
            icon={FiShoppingBag}
            label="Total Orders"
            value={stats?.totalOrders || 0}
            change={null}
            changeLabel="vs last month"
          />
          <StatsCard
            icon={FiUsers}
            label="Total Users"
            value={stats?.totalUsers || 0}
            change={stats?.newUsersThisMonth > 0 ? `+${stats.newUsersThisMonth}` : null}
            changeLabel="new this month"
          />
          <StatsCard
            icon={FiPackage}
            label="Total Products"
            value={stats?.totalProducts || 0}
            change={null}
            changeLabel="vs last month"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Revenue Chart */}
            <div className="border-4 border-dark-950 bg-white p-6 relative group">
              <div className="absolute top-0 right-0 p-2 bg-dark-950 text-white font-bold text-xs uppercase">
                Last 7 Days
              </div>
              <h3 className="text-xl font-display font-black uppercase mb-6 flex items-center gap-2">
                <FiTrendingUp /> Revenue Overview
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF0000" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#FF0000" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="name" stroke="#000" tick={{fontSize: 12, fontWeight: 'bold'}} />
                    <YAxis stroke="#000" tick={{fontSize: 12, fontWeight: 'bold'}} tickFormatter={(value) => `${value/1000000}M`} />
                    <Tooltip 
                      contentStyle={{border: '2px solid #000', borderRadius: 0, boxShadow: '4px 4px 0 #000'}}
                      itemStyle={{fontWeight: 'bold', color: '#000'}}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#FF0000" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="border-4 border-dark-950 bg-white p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-display font-black uppercase flex items-center gap-2">
                  <FiActivity /> Recent Orders
                </h3>
                <Link to="/admin/orders" className="text-sm font-bold uppercase hover:text-street-red flex items-center gap-1">
                  View All <FiArrowRight />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-dark-950 text-left">
                      <th className="pb-3 font-black uppercase text-xs">Order ID</th>
                      <th className="pb-3 font-black uppercase text-xs">Customer</th>
                      <th className="pb-3 font-black uppercase text-xs">Total</th>
                      <th className="pb-3 font-black uppercase text-xs">Status</th>
                      <th className="pb-3 font-black uppercase text-xs text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-gray-100">
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <tr key={order.id} className="group hover:bg-gray-50">
                          <td className="py-3 font-bold text-sm">#{order.orderNumber || order.id}</td>
                          <td className="py-3 font-medium text-sm">{order.receiverName || order.userName || 'Guest'}</td>
                          <td className="py-3 font-black text-sm">{formatCurrency(order.totalAmount)}</td>
                          <td className="py-3">
                            <span className={`
                              px-2 py-0.5 text-[10px] font-black uppercase
                              ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                                order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
                                order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' : 
                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'}
                            `}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <Link to={`/admin/orders/${order.id}`} className="text-gray-400 hover:text-dark-950 group-hover:translate-x-1 transition-transform inline-block">
                              <FiArrowRight />
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-4 text-center text-gray-500 font-medium">No recent orders found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Actions & Top Products */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="border-4 border-dark-950 bg-dark-950 p-6 text-light-50">
              <h3 className="text-xl font-display font-black uppercase mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <Link 
                      key={idx} 
                      to={action.path}
                      className={`p-4 flex flex-col items-center justify-center gap-2 text-center border-2 border-transparent hover:border-white transition-all ${action.color}`}
                    >
                      <Icon size={24} />
                      <span className="text-xs font-black uppercase leading-tight">{action.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Top Products */}
            <div className="border-4 border-dark-950 bg-white p-6">
              <h3 className="text-xl font-display font-black uppercase mb-6 flex items-center gap-2">
                <FiLayers /> Top Products
              </h3>
              <div className="space-y-4">
                {topProducts.length > 0 ? (
                  topProducts.map((product, i) => (
                    <div key={product.productId} className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-200 border-2 border-dark-950 font-black flex items-center justify-center text-sm relative overflow-hidden">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span>{i + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${product.productId}`} className="font-bold uppercase text-sm truncate block hover:text-street-red">
                          {product.productName}
                        </Link>
                        <div className="w-full h-2 bg-gray-100 mt-1">
                          {/* Mock progress bar based on sold count relative to top 1 */}
                          <div 
                            className="h-full bg-dark-950" 
                            style={{width: `${(product.totalSold / (topProducts[0]?.totalSold || 1)) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs whitespace-nowrap">{product.totalSold} sold</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">No sales data yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
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
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { toast } from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import StatsCard from '@components/admin/StatsCard';
import dashboardService from '@services/dashboard-service';
import orderService from '@services/order-service';
import productService from '@services/product-service';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: 'red', color: 'white', zIndex: 9999, position: 'relative' }}>
          <h2>Something went wrong in AdminDashboard.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

const COLORS = ['#FF0000', '#000000', '#666666', '#CCCCCC', '#FFE5B4'];

/**
 * AdminDashboard Component - Street Style Redesign
 */
const AdminDashboardContent = () => {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [timeRange, setTimeRange] = useState('7_days');
  const [loading, setLoading] = useState(true);

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  useEffect(() => {
    document.title = 'Dashboard - D4K Admin';
    fetchAllData();
  }, [timeRange]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const endDate = new Date();
      const startDate = new Date();
      if (timeRange === '7_days') startDate.setDate(endDate.getDate() - 6);
      else if (timeRange === '30_days') startDate.setDate(endDate.getDate() - 29);
      else if (timeRange === '90_days') startDate.setDate(endDate.getDate() - 89);
      else startDate.setFullYear(2020); // All time fallback

      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      // Parallel Fetch
      const [overviewRes, salesRes, topProductsRes, ordersRes, lowStockRes, allOrdersRes] = await Promise.all([
        dashboardService.getDashboardOverview().catch(() => null),
        dashboardService.getSalesData('DAILY', startDateStr, endDateStr).catch(() => null),
        dashboardService.getTopProducts(5).catch(() => null),
        orderService.getAllOrders({ page: 0, size: 5 }).catch(() => null),
        productService.getAllProductsAdmin({ sort: 'stockQuantity,asc', size: 5 }).catch(() => null),
        orderService.getAllOrders({ page: 0, size: 100 }).catch(() => null)
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
        setRecentOrders(ordersRes.data.content || (Array.isArray(ordersRes.data) ? ordersRes.data : []));
      }

      // 5. Set Low Stock Products
      if (lowStockRes && lowStockRes.success && lowStockRes.data) {
        setLowStockProducts(lowStockRes.data.content || (Array.isArray(lowStockRes.data) ? lowStockRes.data : []));
      }

      // 6. Set Order Status Distribution
      if (allOrdersRes && allOrdersRes.success && allOrdersRes.data) {
        const content = allOrdersRes.data.content || (Array.isArray(allOrdersRes.data) ? allOrdersRes.data : []);
        const statusCounts = {};
        content.forEach(o => {
          statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
        });
        const statusChartData = Object.keys(statusCounts).map(key => ({
          name: key,
          value: statusCounts[key]
        }));
        setOrderStatusData(statusChartData);
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

  if (loading && !stats) {
    return (
      <AdminLayout>
        <div className="space-y-8">
          <div className="h-16 w-64 skeleton-street"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="h-32 skeleton-street"></div>)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="h-96 skeleton-street"></div>
              <div className="h-80 skeleton-street"></div>
            </div>
            <div className="space-y-8">
              <div className="h-64 skeleton-street"></div>
              <div className="h-96 skeleton-street"></div>
            </div>
          </div>
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
          <div className="flex items-center gap-4">
            <select 
              value={timeRange}
              onChange={handleTimeRangeChange}
              className="p-3 border-2 border-dark-950 font-bold uppercase focus:outline-none focus:border-street-red bg-light-50"
            >
              <option value="7_days">LAST 7 DAYS</option>
              <option value="30_days">LAST 30 DAYS</option>
              <option value="90_days">LAST 90 DAYS</option>
              <option value="all_time">ALL TIME</option>
            </select>
            <button onClick={fetchAllData} className="btn-street-sm bg-white border-2 border-dark-950 font-bold px-4 py-3 uppercase hover:bg-dark-950 hover:text-white transition-all">
              {loading ? 'LOADING...' : 'REFRESH'}
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
            <div className={`border-4 border-dark-950 bg-white p-6 relative group ${loading ? 'opacity-50' : ''}`}>
              <div className="absolute top-0 right-0 p-2 bg-dark-950 text-white font-bold text-xs uppercase">
                {timeRange.replace('_', ' ')}
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
                                order.status === 'SHIPPING' ? 'bg-blue-100 text-blue-800' : 
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

            {/* Order Status Pie Chart */}
            <div className="border-4 border-dark-950 bg-white p-6">
              <h3 className="text-xl font-display font-black uppercase mb-6 flex items-center gap-2">
                <FiPackage /> Order Status Distribution
              </h3>
              <div className="h-[300px] w-full flex items-center justify-center">
                {orderStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{border: '2px solid #000', borderRadius: 0, boxShadow: '4px 4px 0 #000'}}
                        itemStyle={{fontWeight: 'bold', color: '#000'}}
                      />
                      <Legend iconType="square" wrapperStyle={{fontWeight: 'bold', fontSize: '12px'}} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-gray-500 font-bold uppercase text-sm">NO ORDER DATA</div>
                )}
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

            {/* Low Stock Alerts */}
            <div className="border-4 border-street-red bg-white p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-street-red text-white p-2 text-xs font-black uppercase animate-pulse">
                ALERT
              </div>
              <h3 className="text-xl font-display font-black uppercase mb-6 flex items-center gap-2 text-street-red">
                <FiActivity /> Low Stock Items
              </h3>
              <div className="space-y-4">
                {lowStockProducts?.length > 0 ? (
                  lowStockProducts.filter(p => (p.stockQuantity || p.stock || 0) <= 10).map((product) => (
                    <div key={product.id || product.productId} className="flex justify-between items-center border-b-2 border-gray-100 pb-2">
                      <Link to={`/admin/products/edit/${product.id || product.productId}`} className="font-bold uppercase text-sm truncate hover:text-street-red flex-1">
                        {product.name || product.productName}
                      </Link>
                      <span className={`font-black px-2 py-1 text-xs border-2 ${(product.stockQuantity || product.stock || 0) === 0 ? 'bg-street-red text-white border-street-red' : 'bg-yellow-100 text-yellow-800 border-yellow-800'}`}>
                        {product.stockQuantity || product.stock || 0} LEFT
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 font-bold text-sm uppercase">All stock levels look good.</div>
                )}
                {lowStockProducts?.filter(p => (p.stockQuantity || p.stock || 0) <= 10).length === 0 && lowStockProducts?.length > 0 && (
                  <div className="text-gray-500 font-bold text-sm uppercase">All stock levels look good.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const AdminDashboard = () => {
  return (
    <ErrorBoundary>
      <AdminDashboardContent />
    </ErrorBoundary>
  );
};

export default AdminDashboard;

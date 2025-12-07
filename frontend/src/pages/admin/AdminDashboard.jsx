import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiDollarSign, 
  FiShoppingBag, 
  FiUsers, 
  FiPackage,
  FiTag,
  FiLayers,
  FiTrendingUp
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import StatsCard from '@components/admin/StatsCard';
import dashboardService from '@services/dashboard-service';

/**
 * AdminDashboard Component - Street Style
 * Trang dashboard admin với stats và charts
 */
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Dashboard - D4K Admin';
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getDashboardOverview();

      if (response) {
        setStats(response);
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      
      // Use mock data if API not ready
      setStats({
        totalRevenue: 12500000,
        totalOrders: 145,
        totalUsers: 89,
        totalProducts: 234,
        revenueChange: 12.5,
        ordersChange: 8.3,
        usersChange: -2.1,
        productsChange: 5.7,
      });
      
      toast('USING MOCK DATA', {
        icon: 'ℹ️',
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Quick actions
  const quickActions = [
    {
      path: '/admin/products',
      icon: FiPackage,
      label: 'MANAGE PRODUCTS',
      color: 'bg-street-neon',
    },
    {
      path: '/admin/orders',
      icon: FiShoppingBag,
      label: 'MANAGE ORDERS',
      color: 'bg-street-red',
    },
    {
      path: '/admin/users',
      icon: FiUsers,
      label: 'MANAGE USERS',
      color: 'bg-dark-950',
    },
    {
      path: '/admin/coupons',
      icon: FiTag,
      label: 'MANAGE COUPONS',
      color: 'bg-yellow-400',
    },
    {
      path: '/admin/media',
      icon: FiLayers,
      label: 'MEDIA LIBRARY',
      color: 'bg-purple-400',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-dark-950 mb-2 glitch-street">
            DASHBOARD
          </h1>
          <p className="text-gray-600 font-bold uppercase tracking-wide">
            OVERVIEW & STATISTICS
          </p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-40 bg-light-200 border-4 border-gray-300"></div>
              </div>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              icon={FiDollarSign}
              label="TOTAL REVENUE"
              value={formatCurrency(stats.totalRevenue)}
              change={stats.revenueChange}
              changeLabel="vs last month"
            />
            <StatsCard
              icon={FiShoppingBag}
              label="TOTAL ORDERS"
              value={stats.totalOrders}
              change={stats.ordersChange}
              changeLabel="vs last month"
            />
            <StatsCard
              icon={FiUsers}
              label="TOTAL USERS"
              value={stats.totalUsers}
              change={stats.usersChange}
              changeLabel="vs last month"
            />
            <StatsCard
              icon={FiPackage}
              label="TOTAL PRODUCTS"
              value={stats.totalProducts}
              change={stats.productsChange}
              changeLabel="vs last month"
            />
          </div>
        ) : null}

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-display font-black uppercase tracking-tight text-dark-950 mb-4">
            QUICK ACTIONS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.path}
                  to={action.path}
                  className="p-6 border-4 border-dark-950 bg-light-50 
                           hover:scale-[1.02] hover:shadow-street transition-all group"
                >
                  <div className={`
                    inline-block p-3 border-2 border-dark-950 ${action.color}
                    group-hover:scale-110 transition-transform mb-4
                  `}>
                    <Icon size={24} className="text-dark-950" />
                  </div>
                  <p className="text-sm font-black uppercase tracking-wider text-dark-950">
                    {action.label}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity / Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart Placeholder */}
          <div className="p-6 border-4 border-dark-950 bg-light-50">
            <h3 className="text-xl font-display font-black uppercase tracking-tight text-dark-950 mb-4 flex items-center space-x-2">
              <FiTrendingUp size={24} />
              <span>SALES OVER TIME</span>
            </h3>
            <div className="h-64 border-2 border-dark-950 flex items-center justify-center bg-light-100">
              <p className="text-sm font-bold uppercase tracking-wide text-gray-600">
                CHART PLACEHOLDER
              </p>
            </div>
          </div>

          {/* Top Products Placeholder */}
          <div className="p-6 border-4 border-dark-950 bg-light-50">
            <h3 className="text-xl font-display font-black uppercase tracking-tight text-dark-950 mb-4 flex items-center space-x-2">
              <FiLayers size={24} />
              <span>TOP PRODUCTS</span>
            </h3>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border-2 border-dark-950">
                  <span className="text-sm font-bold uppercase tracking-wide">
                    Product {i}
                  </span>
                  <span className="text-xs font-black uppercase px-2 py-1 bg-street-neon text-dark-950">
                    {100 - i * 10} SOLD
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;


import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiGrid, 
  FiPackage, 
  FiShoppingBag, 
  FiUsers, 
  FiTag,
  FiImage,
  FiMenu,
  FiX,
  FiLogOut,
  FiLayers
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import authService from '@services/auth-service';
import useCartStore from '@store/use-cart-store';

/**
 * AdminLayout Component - Street Style
 * Layout wrapper cho admin pages
 */
const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = authService.getCurrentUser();
  const clearCart = useCartStore((state) => state.clearCart);

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: FiGrid,
      label: 'DASHBOARD',
    },
    {
      path: '/admin/products',
      icon: FiPackage,
      label: 'PRODUCTS',
    },
    {
      path: '/admin/categories',
      icon: FiLayers,
      label: 'CATEGORIES',
    },
    {
      path: '/admin/orders',
      icon: FiShoppingBag,
      label: 'ORDERS',
    },
    {
      path: '/admin/users',
      icon: FiUsers,
      label: 'USERS',
    },
    {
      path: '/admin/coupons',
      icon: FiTag,
      label: 'COUPONS',
    },
    {
      path: '/admin/media',
      icon: FiImage,
      label: 'MEDIA',
    },
  ];

  const handleLogout = () => {
    authService.logout();
    clearCart();
    navigate('/admin/login');
    toast.success('LOGGED OUT!', { icon: '👋' });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-light-50 flex">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-950 
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b-2 border-light-50">
            <Link to="/admin/dashboard" className="flex items-center space-x-3">
              <div className="text-3xl font-display font-black text-light-50 uppercase">
                D4K
              </div>
              <span className="px-2 py-1 bg-street-red text-light-50 text-xs font-bold uppercase">
                ADMIN
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 px-6 py-3 transition-all
                    ${active
                      ? 'bg-street-red text-light-50'
                      : 'text-light-50 hover:bg-light-50/10'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="text-sm font-bold uppercase tracking-wide">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-6 border-t-2 border-light-50">
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">
                LOGGED IN AS
              </p>
              <p className="text-sm font-black uppercase text-light-50 truncate">
                {user?.fullName || 'ADMIN'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 py-3 
                       bg-transparent border-2 border-light-50 text-light-50
                       hover:bg-street-red hover:border-street-red transition-all
                       font-bold uppercase text-sm tracking-wide"
            >
              <FiLogOut size={18} />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar (Mobile) */}
        <header className="lg:hidden sticky top-0 z-40 bg-light-50 border-b-4 border-dark-950 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-display font-black text-dark-950 uppercase">
              D4K ADMIN
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-dark-950"
            >
              {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-dark-950/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;


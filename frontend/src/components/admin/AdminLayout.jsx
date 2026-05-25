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
  FiLayers,
  FiLock
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import authService from '@services/auth-service';
import userService from '@services/user-service';
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

  // Change Password State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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
      label: 'HERO BANNER',
    },
  ];

  const handleLogout = () => {
    authService.logout();
    clearCart();
    navigate('/');
    toast.success('LOGGED OUT!');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setIsChangingPassword(true);
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      });
      toast.success('Password changed successfully');
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
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
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center justify-center space-x-2 py-3 mb-2
                       bg-transparent border-2 border-dark-950 text-light-50
                       hover:bg-light-50 hover:text-dark-950 transition-all
                       font-bold uppercase text-sm tracking-wide"
            >
              <FiLock size={18} />
              <span>CHANGE PASSWORD</span>
            </button>
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

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm">
          <div className="bg-light-50 w-full max-w-md border-4 border-dark-950 shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]">
            <div className="flex justify-between items-center p-4 border-b-4 border-dark-950 bg-light-200">
              <h2 className="text-xl font-black uppercase text-dark-950">Change Password</h2>
              <button onClick={() => setShowPasswordModal(false)} className="text-dark-950 hover:text-street-red transition-colors">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold uppercase text-dark-950 mb-2">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full p-3 bg-light-50 border-2 border-dark-950 focus:outline-none focus:ring-0 font-medium"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase text-dark-950 mb-2">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full p-3 bg-light-50 border-2 border-dark-950 focus:outline-none focus:ring-0 font-medium"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase text-dark-950 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full p-3 bg-light-50 border-2 border-dark-950 focus:outline-none focus:ring-0 font-medium"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-3 border-2 border-dark-950 font-bold uppercase text-dark-950 hover:bg-light-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-1 py-3 bg-dark-950 text-light-50 font-bold uppercase border-2 border-dark-950 hover:bg-street-red hover:border-street-red transition-colors disabled:opacity-50"
                >
                  {isChangingPassword ? 'Saving...' : 'Save Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;


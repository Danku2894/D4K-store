import { Link, useLocation } from 'react-router-dom';
import { 
  FiUser, 
  FiMapPin, 
  FiShoppingBag, 
  FiHeart, 
  FiLock,
  FiLogOut 
} from 'react-icons/fi';

/**
 * AccountNav Component - Street Style
 * Left sidebar navigation cho account pages
 * 
 * @param {Function} onLogout - Logout callback
 */
const AccountNav = ({ onLogout }) => {
  const location = useLocation();

  const navItems = [
    {
      path: '/profile',
      icon: FiUser,
      label: 'MY PROFILE',
      description: 'Personal info & settings',
    },
    {
      path: '/profile/addresses',
      icon: FiMapPin,
      label: 'ADDRESSES',
      description: 'Manage delivery addresses',
    },
    {
      path: '/profile/orders',
      icon: FiShoppingBag,
      label: 'MY ORDERS',
      description: 'Track & manage orders',
    },

    {
      path: '/profile/password',
      icon: FiLock,
      label: 'CHANGE PASSWORD',
      description: 'Update your password',
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-start space-x-4 p-4 border-2 transition-all
              ${active
                ? 'border-street-red bg-street-red/10'
                : 'border-dark-950 bg-light-50 hover:border-street-red hover:scale-[1.02]'
              }
            `}
          >
            <div className={`
              p-2 border-2 transition-all
              ${active
                ? 'border-street-red bg-street-red text-light-50'
                : 'border-dark-950 text-dark-950'
              }
            `}>
              <Icon size={20} />
            </div>

            <div className="flex-1">
              <p className={`
                text-sm font-black uppercase tracking-wider mb-1
                ${active ? 'text-dark-950' : 'text-dark-950'}
              `}>
                {item.label}
              </p>
              <p className="text-xs text-gray-600 font-medium">
                {item.description}
              </p>
            </div>
          </Link>
        );
      })}

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full flex items-start space-x-4 p-4 border-2 border-dark-950 
                 bg-light-50 hover:border-street-red hover:bg-street-red hover:text-light-50 
                 transition-all text-left group"
      >
        <div className="p-2 border-2 border-dark-950 text-dark-950 group-hover:border-light-50 
                      group-hover:bg-light-50 group-hover:text-street-red transition-all">
          <FiLogOut size={20} />
        </div>

        <div className="flex-1">
          <p className="text-sm font-black uppercase tracking-wider mb-1">
            LOGOUT
          </p>
          <p className="text-xs opacity-70 font-medium group-hover:opacity-100">
            Sign out of your account
          </p>
        </div>
      </button>
    </nav>
  );
};

export default AccountNav;


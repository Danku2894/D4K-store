import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Breadcrumb from '@components/common/Breadcrumb';
import AccountNav from '@components/profile/AccountNav';
import ProfileForm from '@components/profile/ProfileForm';
import authService from '@services/auth-service';
import userService from '@services/user-service';
import useCartStore from '@store/use-cart-store';

/**
 * ProfilePage Component - Street Style
 * Trang quản lý profile user
 */
const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    document.title = 'My Profile - D4K Store';
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getMyProfile();

      if (response.success && response.data) {
        setUser(response.data);
        // Update localStorage with latest user data
        const currentAuth = {
          accessToken: localStorage.getItem('d4k_access_token'),
          refreshToken: localStorage.getItem('d4k_refresh_token'),
          user: response.data
        };
        authService.saveAuthData(currentAuth);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      
      // If unauthorized, redirect to login
      if (err.status === 401) {
        authService.logout();
        clearCart();
        navigate('/login');
        return;
      }
      
      // Fallback: use user data from localStorage if API fails
      const localUser = authService.getCurrentUser();
      if (localUser) {
        setUser(localUser);
        toast('SHOWING CACHED PROFILE', {
          icon: 'ℹ️',
        });
      } else {
        toast.error('FAILED TO LOAD PROFILE');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (formData) => {
    try {
      setUpdating(true);

      const response = await userService.updateMyProfile(formData);

      if (response.success && response.data) {
        setUser(response.data);
        
        // Update localStorage
        const currentAuth = {
          accessToken: localStorage.getItem('d4k_access_token'),
          refreshToken: localStorage.getItem('d4k_refresh_token'),
          user: response.data
        };
        authService.saveAuthData(currentAuth);

        toast.success('PROFILE UPDATED!', {
          icon: '✅',
          style: {
            background: '#00FF00',
            color: '#000000',
            border: '2px solid #000000',
            fontWeight: 'bold',
          },
        });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorMessage = err.message || 'FAILED TO UPDATE PROFILE';
      toast.error(errorMessage.toUpperCase());
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    clearCart();
    navigate('/');
    toast.success('LOGGED OUT SUCCESSFULLY!', {
      icon: '👋',
    });
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'My Account', path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-light-50">
      <div className="container-street py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Header */}
        <div className="py-8 border-b-4 border-dark-950 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <FiUser size={48} className="text-dark-950" />
            <div>
              <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight glitch-street">
                MY PROFILE
              </h1>
              {user && (
                <p className="text-gray-600 font-bold uppercase tracking-wide mt-2">
                  WELCOME BACK, {user.fullName?.split(' ')[0] || 'USER'}!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Account Navigation */}
          <aside className="lg:col-span-1">
            <AccountNav onLogout={handleLogout} />
          </aside>

          {/* Right Content - Profile Form */}
          <main className="lg:col-span-3">
            {loading ? (
              // Loading State
              <div className="p-8 border-4 border-dark-950 bg-light-50">
                <div className="animate-pulse space-y-6">
                  <div className="h-12 bg-light-200 border-2 border-gray-300"></div>
                  <div className="h-12 bg-light-200 border-2 border-gray-300"></div>
                  <div className="h-12 bg-light-200 border-2 border-gray-300"></div>
                  <div className="h-16 bg-light-200 border-2 border-gray-300"></div>
                </div>
              </div>
            ) : user ? (
              // Profile Form
              <div className="p-8 border-4 border-dark-950 bg-light-50">
                <div className="mb-6 pb-6 border-b-2 border-dark-950">
                  <h2 className="text-2xl font-display font-black uppercase tracking-tight text-dark-950 mb-2">
                    PERSONAL INFORMATION
                  </h2>
                  <p className="text-sm text-gray-600 font-medium">
                    Update your personal details and contact information
                  </p>
                </div>

                <ProfileForm
                  user={user}
                  onUpdate={handleUpdateProfile}
                  isLoading={updating}
                />

                {/* Additional Info */}
                <div className="mt-8 pt-6 border-t-2 border-dark-950">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-4">
                    ACCOUNT INFORMATION
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border-2 border-dark-950 bg-light-100">
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">
                        ROLE
                      </p>
                      <p className="text-sm font-black uppercase">
                        {user.role || 'USER'}
                      </p>
                    </div>
                    <div className="p-4 border-2 border-dark-950 bg-light-100">
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">
                        MEMBER SINCE
                      </p>
                      <p className="text-sm font-black uppercase">
                        {user.createdAt 
                          ? new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                            })
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Error State
              <div className="p-8 border-4 border-street-red text-center">
                <p className="text-street-red font-bold uppercase mb-4">
                  FAILED TO LOAD PROFILE
                </p>
                <button
                  onClick={fetchProfile}
                  className="btn-street"
                >
                  TRY AGAIN
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


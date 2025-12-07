import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import authService from '@services/auth-service';

/**
 * AdminLoginPage Component - Street Style
 * Admin login page with role validation
 */
const AdminLoginPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = 'Admin Login - D4K Store';

    // Redirect if already logged in as admin
    const user = authService.getCurrentUser();
    if (user && user.role === 'ADMIN') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'EMAIL IS REQUIRED';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'EMAIL IS INVALID';
    }

    if (!formData.password) {
      newErrors.password = 'PASSWORD IS REQUIRED';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('PLEASE FIX THE ERRORS!');
      return;
    }

    try {
      setIsLoading(true);

      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success && response.data) {
        const { user } = response.data;

        // Check if user is ADMIN
        if (user.role !== 'ADMIN') {
          toast.error('UNAUTHORIZED! ADMIN ACCESS ONLY', {
            icon: '🚫',
            style: {
              background: '#FF0000',
              color: '#ffffff',
              border: '2px solid #000000',
              fontWeight: 'bold',
            },
            duration: 4000,
          });
          return;
        }

        // Save auth data
        authService.saveAuthData(response.data);

        toast.success('WELCOME ADMIN!', {
          icon: '🔐',
          style: {
            background: '#00FF00',
            color: '#000000',
            border: '2px solid #000000',
            fontWeight: 'bold',
          },
        });

        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      const errorMessage = err.message || 'LOGIN FAILED';
      toast.error(errorMessage.toUpperCase());
      
      if (err.errors) {
        setErrors(err.errors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 border-4 border-street-red bg-street-red/10 mb-6">
            <FiShield size={48} className="text-street-red" />
          </div>

          <h1 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tight text-light-50 mb-4 glitch-street">
            ADMIN ACCESS
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-wide">
            AUTHORIZED PERSONNEL ONLY
          </p>
          
          {/* Decorative Line */}
          <div className="flex items-center justify-center space-x-2 mt-4">
            <div className="w-16 h-1 bg-street-red"></div>
            <div className="w-2 h-2 bg-street-red"></div>
            <div className="w-16 h-1 bg-street-red"></div>
          </div>
        </div>

        {/* Login Card */}
        <div className="p-8 border-4 border-light-50 bg-dark-950">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2 text-light-50">
                EMAIL *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiMail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ADMIN@D4K.COM"
                  className={`
                    w-full pl-12 pr-4 py-3 border-2 bg-dark-950
                    text-light-50 placeholder-gray-600 font-bold
                    focus:outline-none transition-all
                    ${errors.email 
                      ? 'border-street-red' 
                      : 'border-light-50 focus:border-street-red'
                    }
                  `}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-street-red">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2 text-light-50">
                PASSWORD *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiLock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="YOUR PASSWORD"
                  className={`
                    w-full pl-12 pr-12 py-3 border-2 bg-dark-950
                    text-light-50 placeholder-gray-600 font-bold
                    focus:outline-none transition-all
                    ${errors.password 
                      ? 'border-street-red' 
                      : 'border-light-50 focus:border-street-red'
                    }
                  `}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                           hover:text-light-50 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-street-red">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-street-red border-2 border-street-red text-light-50 
                       font-black uppercase text-lg tracking-wider
                       hover:bg-light-50 hover:text-dark-950 hover:border-light-50 hover:scale-[1.02]
                       transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? 'AUTHENTICATING...' : 'ADMIN LOGIN'}
            </button>
          </form>

          {/* Warning */}
          <div className="mt-6 p-4 border-2 border-street-red bg-street-red/10">
            <p className="text-xs text-gray-400 font-medium text-center">
              ⚠️ This area is restricted to authorized administrators only.
              Unauthorized access attempts are logged and monitored.
            </p>
          </div>
        </div>

        {/* Back to Site */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm font-bold uppercase tracking-wide text-gray-400 
                     hover:text-light-50 transition-colors"
          >
            ← BACK TO STORE
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;


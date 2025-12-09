import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import authService from '@services/auth-service';
import useCartStore from '@store/use-cart-store';

/**
 * LoginPage Component - Street Style
 * Trang đăng nhập
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const syncCart = useCartStore((state) => state.syncCart);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = 'Login - D4K Store';

    // Redirect if already logged in
    if (authService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'EMAIL IS REQUIRED';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'EMAIL IS INVALID';
    }

    // Password validation
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
    // Clear error when user types
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
        // Save auth data
        authService.saveAuthData(response.data);
        
        // Sync cart
        await syncCart();

        toast.success('WELCOME BACK!', {
          icon: '👋',
          style: {
            background: '#00FF00',
            color: '#000000',
            border: '2px solid #000000',
            fontWeight: 'bold',
          },
        });

        // Check role and redirect
        const userRole = response.data.user?.role;
        
        if (userRole === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          // Redirect to intended page or home
          const from = location.state?.from?.pathname || '/';
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.message || 'LOGIN FAILED';
      toast.error(errorMessage.toUpperCase());
      
      // Set form errors if specific field errors
      if (err.errors) {
        setErrors(err.errors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tight text-dark-950 mb-4 glitch-street">
            WELCOME BACK
          </h1>
          <p className="text-gray-600 font-bold uppercase tracking-wide">
            LOGIN TO YOUR ACCOUNT
          </p>
          
          {/* Decorative Line */}
          <div className="flex items-center justify-center space-x-2 mt-4">
            <div className="w-16 h-1 bg-dark-950"></div>
            <div className="w-2 h-2 bg-street-red"></div>
            <div className="w-16 h-1 bg-dark-950"></div>
          </div>
        </div>

        {/* Login Card */}
        <div className="p-8 border-4 border-dark-950 bg-light-50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2 text-dark-950">
                EMAIL *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                  <FiMail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="YOUR@EMAIL.COM"
                  className={`
                    w-full pl-12 pr-4 py-3 border-2 bg-light-50
                    text-dark-950 placeholder-gray-400 font-bold
                    focus:outline-none transition-all
                    ${errors.email 
                      ? 'border-street-red' 
                      : 'border-dark-950 focus:border-street-red'
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
              <label className="block text-xs font-black uppercase tracking-wider mb-2 text-dark-950">
                PASSWORD *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                  <FiLock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="YOUR PASSWORD"
                  className={`
                    w-full pl-12 pr-12 py-3 border-2 bg-light-50
                    text-dark-950 placeholder-gray-400 font-bold
                    focus:outline-none transition-all
                    ${errors.password 
                      ? 'border-street-red' 
                      : 'border-dark-950 focus:border-street-red'
                    }
                  `}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 
                           hover:text-dark-950 transition-colors"
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

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-bold uppercase tracking-wide text-dark-950 
                         hover:text-street-red transition-colors"
              >
                FORGOT PASSWORD?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-dark-950 border-2 border-dark-950 text-light-50 
                       font-black uppercase text-lg tracking-wider
                       hover:bg-street-red hover:border-street-red hover:scale-[1.02]
                       transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </form>




          {/* Register Link */}
          <div className="mt-8 pt-6 border-t-2 border-dark-950 text-center">
            <p className="text-sm text-gray-600 font-medium">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-dark-950 font-black uppercase tracking-wide 
                         hover:text-street-red transition-colors"
              >
                REGISTER NOW
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm font-bold uppercase tracking-wide text-gray-600 
                     hover:text-dark-950 transition-colors"
          >
            ← BACK TO HOME
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import authService from '@services/auth-service';

/**
 * RegisterPage Component - Street Style
 * Trang đăng ký tài khoản
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = 'Register - D4K Store';

    // Redirect if already logged in
    if (authService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  // Password strength checker (UI only)
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: 'WEAK', color: 'bg-street-red' };
    if (strength <= 3) return { strength, label: 'MEDIUM', color: 'bg-yellow-500' };
    return { strength, label: 'STRONG', color: 'bg-street-neon' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const validateForm = () => {
    const newErrors = {};

    // Full name validation
    if (!formData.fullName) {
      newErrors.fullName = 'FULL NAME IS REQUIRED';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'FULL NAME TOO SHORT';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'EMAIL IS REQUIRED';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'EMAIL IS INVALID';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'PASSWORD IS REQUIRED';
    } else if (formData.password.length < 8) {
      newErrors.password = 'PASSWORD MUST BE AT LEAST 8 CHARACTERS';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'PLEASE CONFIRM PASSWORD';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'PASSWORDS DO NOT MATCH';
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

      const response = await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        toast.success('ACCOUNT CREATED SUCCESSFULLY!', {
          icon: '🎉',
          duration: 5000,
          style: {
            background: '#00FF00',
            color: '#000000',
            border: '2px solid #000000',
            fontWeight: 'bold',
          },
        });

        // Option 1: Auto-login after register
        // if (response.data?.accessToken) {
        //   authService.saveAuthData(response.data);
        //   navigate('/');
        // }

        // Option 2: Redirect to login page
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Registration successful! Please login.' 
            } 
          });
        }, 1500);
      }
    } catch (err) {
      console.error('Register error:', err);
      const errorMessage = err.message || 'REGISTRATION FAILED';
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
            JOIN D4K
          </h1>
          <p className="text-gray-600 font-bold uppercase tracking-wide">
            CREATE YOUR ACCOUNT
          </p>
          
          {/* Decorative Line */}
          <div className="flex items-center justify-center space-x-2 mt-4">
            <div className="w-16 h-1 bg-dark-950"></div>
            <div className="w-2 h-2 bg-street-red"></div>
            <div className="w-16 h-1 bg-dark-950"></div>
          </div>
        </div>

        {/* Register Card */}
        <div className="p-8 border-4 border-dark-950 bg-light-50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Field */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2 text-dark-950">
                FULL NAME *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                  <FiUser size={20} />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="NGUYEN VAN A"
                  className={`
                    w-full pl-12 pr-4 py-3 border-2 bg-light-50
                    text-dark-950 placeholder-gray-400 uppercase font-bold
                    focus:outline-none transition-all
                    ${errors.fullName 
                      ? 'border-street-red' 
                      : 'border-dark-950 focus:border-street-red'
                    }
                  `}
                  disabled={isLoading}
                />
              </div>
              {errors.fullName && (
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-street-red">
                  {errors.fullName}
                </p>
              )}
            </div>

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
                  placeholder="CREATE PASSWORD"
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

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-gray-600">
                      PASSWORD STRENGTH:
                    </span>
                    <span className={`text-xs font-black uppercase tracking-wide ${
                      passwordStrength.label === 'WEAK' ? 'text-street-red' :
                      passwordStrength.label === 'MEDIUM' ? 'text-yellow-600' :
                      'text-street-neon'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="flex space-x-1 h-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 border-2 border-dark-950 transition-all ${
                          i < passwordStrength.strength 
                            ? passwordStrength.color 
                            : 'bg-light-200'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-600 font-medium">
                    Use 8+ characters with mix of letters, numbers & symbols
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2 text-dark-950">
                CONFIRM PASSWORD *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                  <FiLock size={20} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="CONFIRM PASSWORD"
                  className={`
                    w-full pl-12 pr-12 py-3 border-2 bg-light-50
                    text-dark-950 placeholder-gray-400 font-bold
                    focus:outline-none transition-all
                    ${errors.confirmPassword 
                      ? 'border-street-red' 
                      : 'border-dark-950 focus:border-street-red'
                    }
                  `}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 
                           hover:text-dark-950 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-street-red">
                  {errors.confirmPassword}
                </p>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-street-neon flex items-center space-x-2">
                  <FiCheck size={16} />
                  <span>PASSWORDS MATCH</span>
                </p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="pt-2">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 border-2 border-dark-950 mt-0.5"
                />
                <span className="text-xs text-gray-700 font-medium">
                  I agree to the{' '}
                  <a href="/terms" className="text-dark-950 font-bold underline hover:text-street-red">
                    Terms & Conditions
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-dark-950 font-bold underline hover:text-street-red">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-dark-950 border-2 border-dark-950 text-light-50 
                       font-black uppercase text-lg tracking-wider
                       hover:bg-street-red hover:border-street-red hover:scale-[1.02]
                       transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>



          {/* Login Link */}
          <div className="mt-8 pt-6 border-t-2 border-dark-950 text-center">
            <p className="text-sm text-gray-600 font-medium">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-dark-950 font-black uppercase tracking-wide 
                         hover:text-street-red transition-colors"
              >
                LOGIN HERE
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

export default RegisterPage;


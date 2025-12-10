import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiLock, FiCheck } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import authService from '@services/auth-service';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const newPassword = watch('newPassword');

  useEffect(() => {
    if (!token) {
        toast.error("MISSING RESET TOKEN");
        navigate('/login');
    }
  }, [token, navigate]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await authService.resetPassword(token, data.newPassword);
      
      if (response.success) {
        toast.success("PASSWORD RESET SUCCESSFUL!");
        navigate('/login');
      }
    } catch (err) {
        console.error("Reset password error:", err);
        const errorMsg = err.response?.data?.message || err.message || "FAILED TO RESET PASSWORD";
        toast.error(errorMsg.toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-50 flex items-center justify-center p-4">
      <div className="container-street max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-4xl font-display font-black uppercase tracking-tighter mb-2 glitch-street">
            D4K
          </Link>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
            Reset Password
          </p>
        </div>

        {/* Form Container */}
        <div className="p-8 border-4 border-dark-950 bg-light-50 shadow-street relative">
          <h1 className="text-3xl font-display font-black uppercase tracking-tight mb-6">
            NEW PASSWORD
          </h1>
          
          <p className="mb-6 text-gray-600 font-medium text-sm">
            Please enter your new password below.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
             {/* New Password */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider block">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiLock />
                </div>
                <input
                  type="password"
                  {...register('newPassword', { 
                    required: 'Password is required',
                    minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                    }
                  })}
                  className={`w-full pl-10 pr-4 py-3 bg-light-100 border-2 border-dark-950 focus:outline-none focus:shadow-street transition-shadow font-bold
                    ${errors.newPassword ? 'border-street-red' : ''}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.newPassword && (
                <p className="text-street-red text-xs font-bold uppercase mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider block">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiLock />
                </div>
                <input
                  type="password"
                  {...register('confirmPassword', { 
                    required: 'Please confirm password',
                    validate: value => value === newPassword || "Passwords do not match"
                  })}
                  className={`w-full pl-10 pr-4 py-3 bg-light-100 border-2 border-dark-950 focus:outline-none focus:shadow-street transition-shadow font-bold
                    ${errors.confirmPassword ? 'border-street-red' : ''}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-street-red text-xs font-bold uppercase mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-street w-full flex items-center justify-center space-x-2 group"
            >
              {loading ? (
                <span>RESETTING...</span>
              ) : (
                <>
                  <span>RESET PASSWORD</span>
                  <FiCheck className="group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

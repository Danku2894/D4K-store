import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiMail, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import authService from '@services/auth-service';

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await authService.forgotPassword(data.email);
      
      if (response.success) {
        setSubmitted(true);
        toast.success("RESET LINK SENT! CHECK YOUR EMAIL");
      }
    } catch (err) {
        console.error("Forgot password error:", err);
        const errorMsg = err.response?.data?.message || err.message || "FAILED TO SEND RESET LINK";
        toast.error(errorMsg.toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-light-50 flex items-center justify-center p-4">
         <div className="container-street max-w-md w-full p-8 border-4 border-dark-950 bg-light-50 shadow-street">
             <div className="text-center">
                 <div className="w-16 h-16 bg-street-neon border-2 border-dark-950 mx-auto flex items-center justify-center mb-6">
                    <FiMail size={32} />
                 </div>
                 <h2 className="text-3xl font-display font-black uppercase tracking-tight mb-4">
                   CHECK YOUR EMAIL
                 </h2>
                 <p className="text-gray-600 font-bold mb-8">
                   We've sent a password reset link to your email address.
                 </p>
                 <Link to="/login" className="btn-street w-full block text-center">
                   BACK TO LOGIN
                 </Link>
             </div>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-50 flex items-center justify-center p-4">
      <div className="container-street max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-4xl font-display font-black uppercase tracking-tighter mb-2 glitch-street">
            D4K
          </Link>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
            Forgot Password
          </p>
        </div>

        {/* Form Container */}
        <div className="p-8 border-4 border-dark-950 bg-light-50 shadow-street relative">
          {/* Decorative Elements */}
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-street-red border-2 border-dark-950"></div>
          <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-street-neon border-2 border-dark-950"></div>

          <h1 className="text-3xl font-display font-black uppercase tracking-tight mb-6">
            RESET ACCESS
          </h1>
          
          <p className="mb-6 text-gray-600 font-medium text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiMail />
                </div>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className={`w-full pl-10 pr-4 py-3 bg-light-100 border-2 border-dark-950 focus:outline-none focus:shadow-street transition-shadow font-bold
                    ${errors.email ? 'border-street-red' : ''}`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-street-red text-xs font-bold uppercase mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-street w-full flex items-center justify-center space-x-2 group"
            >
              {loading ? (
                <span>SENDING...</span>
              ) : (
                <>
                  <span>SEND RESET LINK</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            <div className="text-center mt-6">
                <Link to="/login" className="text-sm font-bold uppercase tracking-wide hover:text-street-red hover:underline">
                    Back to Login
                </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

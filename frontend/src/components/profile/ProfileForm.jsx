import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiSave } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

/**
 * ProfileForm Component - Street Style
 * Form để update profile information
 * 
 * @param {Object} user - User data
 * @param {Function} onUpdate - Update callback
 * @param {Boolean} isLoading - Loading state
 */
const ProfileForm = ({ user, onUpdate, isLoading = false }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user]);

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

    // Phone validation (optional)
    if (formData.phoneNumber && !/^[0-9+\-\s()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'PHONE NUMBER IS INVALID';
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('PLEASE FIX THE ERRORS!');
      return;
    }

    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
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

      {/* Email */}
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

      {/* Phone Number (Optional) */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider mb-2 text-dark-950">
          PHONE NUMBER <span className="text-gray-500">(OPTIONAL)</span>
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
            <FiPhone size={20} />
          </div>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="0912345678"
            className={`
              w-full pl-12 pr-4 py-3 border-2 bg-light-50
              text-dark-950 placeholder-gray-400 font-bold
              focus:outline-none transition-all
              ${errors.phoneNumber 
                ? 'border-street-red' 
                : 'border-dark-950 focus:border-street-red'
              }
            `}
            disabled={isLoading}
          />
        </div>
        {errors.phoneNumber && (
          <p className="mt-2 text-xs font-bold uppercase tracking-wide text-street-red">
            {errors.phoneNumber}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 py-4 
                   bg-dark-950 border-2 border-dark-950 text-light-50 
                   font-black uppercase text-lg tracking-wider
                   hover:bg-street-red hover:border-street-red hover:scale-[1.02]
                   transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <FiSave size={20} />
          <span>{isLoading ? 'SAVING...' : 'SAVE CHANGES'}</span>
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;


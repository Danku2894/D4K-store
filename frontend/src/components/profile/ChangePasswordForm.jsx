import { useState } from 'react';
import { toast } from 'react-hot-toast';
import userService from '@services/user-service';

const ChangePasswordForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('PASSWORDS DO NOT MATCH');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('PASSWORD MUST BE AT LEAST 6 CHARACTERS');
      return;
    }

    try {
      setLoading(true);
      const response = await userService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });

      if (response.success) {
        toast.success('PASSWORD CHANGED SUCCESSFULLY!', {
          icon: '🔒',
        });
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      console.error('Error changing password:', err);
      const message = err.response?.data?.message || 'FAILED TO CHANGE PASSWORD';
      toast.error(message.toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 border-4 border-dark-950 bg-light-50">
      <div className="mb-6 pb-6 border-b-2 border-dark-950">
        <h2 className="text-2xl font-display font-black uppercase tracking-tight text-dark-950 mb-2">
          CHANGE PASSWORD
        </h2>
        <p className="text-sm text-gray-600 font-medium">
          Ensure your account is secure with a strong password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase mb-1">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            className="w-full p-3 border-2 border-dark-950 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow font-medium"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase mb-1">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            className="w-full p-3 border-2 border-dark-950 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow font-medium"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-3 border-2 border-dark-950 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow font-medium"
            placeholder="••••••••"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-dark-950 text-white font-black uppercase tracking-wider hover:bg-street-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;

import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const AddressFormModal = ({ isOpen, onClose, onSubmit, initialData, title }) => {
  const [formData, setFormData] = useState({
    receiverName: '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    city: '',
    isDefault: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        receiverName: initialData.receiverName || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        ward: initialData.ward || '',
        district: initialData.district || '',
        city: initialData.city || '',
        isDefault: initialData.isDefault || false
      });
    } else {
      setFormData({
        receiverName: '',
        phone: '',
        address: '',
        ward: '',
        district: '',
        city: '',
        isDefault: false
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clean phone number: remove all non-digit characters
    const cleanedData = {
      ...formData,
      phone: formData.phone.replace(/\D/g, '')
    };
    onSubmit(cleanedData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md border-4 border-dark-950 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b-4 border-dark-950 bg-street-yellow">
          <h2 className="font-display font-black text-xl uppercase tracking-tight">
            {title || 'Address Details'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-black hover:text-white transition-colors border-2 border-transparent hover:border-black"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Receiver Name</label>
            <input
              type="text"
              name="receiverName"
              value={formData.receiverName}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-dark-950 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow font-medium"
              placeholder="JOHN DOE"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10,11}"
              className="w-full p-3 border-2 border-dark-950 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow font-medium"
              placeholder="0123456789"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Address (Street, Building)</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="2"
              className="w-full p-3 border-2 border-dark-950 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow font-medium resize-none"
              placeholder="123 STREET NAME"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Ward</label>
              <input
                type="text"
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                className="w-full p-3 border-2 border-dark-950 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1">District</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full p-3 border-2 border-dark-950 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">City / Province</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-3 border-2 border-dark-950 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow font-medium"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="w-5 h-5 border-2 border-dark-950 rounded-none accent-street-blue cursor-pointer"
            />
            <label htmlFor="isDefault" className="text-sm font-bold uppercase cursor-pointer select-none">
              Set as default address
            </label>
          </div>

          <div className="flex gap-4 pt-4 mt-6 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border-2 border-dark-950 font-black uppercase hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-dark-950 text-white border-2 border-dark-950 font-black uppercase hover:bg-street-blue hover:border-street-blue transition-colors"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressFormModal;

import { useState } from 'react';
import { FiPlus, FiCheck, FiEdit, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

/**
 * AddressSelector Component - Street Style
 * Chọn địa chỉ giao hàng
 * 
 * @param {Array} addresses - Danh sách addresses
 * @param {Number} selectedAddressId - Address ID được chọn
 * @param {Function} onSelectAddress - Callback khi chọn address
 * @param {Function} onAddAddress - Callback khi thêm address mới
 */
const AddressSelector = ({ 
  addresses = [], 
  selectedAddressId, 
  onSelectAddress,
  onAddAddress 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    receiverName: '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    city: '',
    isDefault: false,
  });

  const handleSubmitNewAddress = (e) => {
    e.preventDefault();
    
    // Validation
    if (!newAddress.receiverName || !newAddress.phone || !newAddress.address || 
        !newAddress.ward || !newAddress.district || !newAddress.city) {
      toast.error('PLEASE FILL ALL FIELDS!');
      return;
    }

    // Clean phone number
    const cleanedAddress = {
      ...newAddress,
      phone: newAddress.phone.replace(/\D/g, '')
    };

    onAddAddress(cleanedAddress);
    
    // Reset form
    setNewAddress({
      receiverName: '',
      phone: '',
      address: '',
      ward: '',
      district: '',
      city: '',
      isDefault: false,
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-display font-black uppercase tracking-tight">
          DELIVERY ADDRESS
        </h3>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 border-2 border-dark-950 
                     bg-transparent text-dark-950 hover:bg-dark-950 hover:text-light-50 
                     font-bold uppercase text-sm tracking-wide transition-all"
          >
            <FiPlus size={16} />
            <span>ADD NEW</span>
          </button>
        )}
      </div>

      {/* Existing Addresses */}
      {addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((address) => (
            <button
              type="button"
              key={address.id}
              onClick={() => onSelectAddress(address.id)}
              className={`
                w-full p-4 border-2 text-left transition-all
                ${String(selectedAddressId) === String(address.id)
                  ? 'border-street-red bg-street-red/10'
                  : 'border-dark-950 bg-light-50 hover:border-street-red'
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <p className="font-black uppercase">
                      {address.receiverName}
                    </p>
                    {address.isDefault && (
                      <span className="px-2 py-1 bg-street-neon text-dark-950 text-xs font-bold uppercase">
                        DEFAULT
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm font-bold text-gray-700">
                    {address.phone}
                  </p>
                  
                  <p className="text-sm text-gray-600 mt-2">
                    {address.address}, {address.ward}, {address.district}, {address.city}
                  </p>
                </div>

                {String(selectedAddressId) === String(address.id) && (
                  <div className="ml-4">
                    <FiCheck size={24} className="text-street-red" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Add New Address Form */}
      {showAddForm && (
        <form onSubmit={handleSubmitNewAddress} className="p-6 border-4 border-dark-950 bg-light-50 space-y-4">
          <h4 className="text-lg font-black uppercase tracking-wide mb-4">
            NEW ADDRESS
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Receiver Name */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2">
                RECEIVER NAME *
              </label>
              <input
                type="text"
                value={newAddress.receiverName}
                onChange={(e) => setNewAddress({ ...newAddress, receiverName: e.target.value })}
                placeholder="NGUYEN VAN A"
                className="w-full px-4 py-3 border-2 border-dark-950 
                         text-dark-950 placeholder-gray-400 uppercase font-bold
                         focus:outline-none focus:border-street-red transition-all"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2">
                PHONE NUMBER *
              </label>
              <input
                type="tel"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                placeholder="0912345678"
                className="w-full px-4 py-3 border-2 border-dark-950 
                         text-dark-950 placeholder-gray-400 font-bold
                         focus:outline-none focus:border-street-red transition-all"
                required
              />
            </div>
          </div>

          {/* Street Address */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-2">
              STREET ADDRESS *
            </label>
            <input
              type="text"
              value={newAddress.address}
              onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
              placeholder="123 NGUYEN HUE"
              className="w-full px-4 py-3 border-2 border-dark-950 
                       text-dark-950 placeholder-gray-400 uppercase font-bold
                       focus:outline-none focus:border-street-red transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ward */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2">
                WARD *
              </label>
              <input
                type="text"
                value={newAddress.ward}
                onChange={(e) => setNewAddress({ ...newAddress, ward: e.target.value })}
                placeholder="BEN NGHE"
                className="w-full px-4 py-3 border-2 border-dark-950 
                         text-dark-950 placeholder-gray-400 uppercase font-bold
                         focus:outline-none focus:border-street-red transition-all"
                required
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2">
                DISTRICT *
              </label>
              <input
                type="text"
                value={newAddress.district}
                onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                placeholder="DISTRICT 1"
                className="w-full px-4 py-3 border-2 border-dark-950 
                         text-dark-950 placeholder-gray-400 uppercase font-bold
                         focus:outline-none focus:border-street-red transition-all"
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2">
                CITY *
              </label>
              <input
                type="text"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                placeholder="HO CHI MINH"
                className="w-full px-4 py-3 border-2 border-dark-950 
                         text-dark-950 placeholder-gray-400 uppercase font-bold
                         focus:outline-none focus:border-street-red transition-all"
                required
              />
            </div>
          </div>

          {/* Set as Default */}
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={newAddress.isDefault}
              onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
              className="w-5 h-5 border-2 border-dark-950"
            />
            <span className="text-sm font-bold uppercase tracking-wide">
              SET AS DEFAULT ADDRESS
            </span>
          </label>

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-dark-950 border-2 border-dark-950 text-light-50 
                       font-black uppercase tracking-wider hover:bg-street-red 
                       hover:border-street-red transition-all"
            >
              ADD ADDRESS
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="flex-1 py-3 bg-transparent border-2 border-dark-950 text-dark-950 
                       font-black uppercase tracking-wider hover:bg-dark-950 
                       hover:text-light-50 transition-all"
            >
              CANCEL
            </button>
          </div>
        </form>
      )}

      {/* Empty State */}
      {addresses.length === 0 && !showAddForm && (
        <div className="p-8 border-2 border-dark-950 text-center">
          <p className="text-gray-600 font-bold uppercase tracking-wide mb-4">
            NO ADDRESSES SAVED
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-street"
          >
            ADD YOUR FIRST ADDRESS
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;


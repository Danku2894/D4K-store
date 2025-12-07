import { useState, useEffect } from 'react';
import { FiPlus, FiMapPin } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Breadcrumb from '@components/common/Breadcrumb';
import AccountNav from '@components/profile/AccountNav';
import AddressCard from '@components/profile/AddressCard';
import AddressFormModal from '@components/profile/AddressFormModal';
import addressService from '@services/address-service';

const AddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    document.title = 'My Addresses - D4K Store';
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressService.getMyAddresses();
      if (response.success) {
        setAddresses(response.data);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
      toast.error('FAILED TO LOAD ADDRESSES');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      const response = await addressService.deleteAddress(id);
      if (response.success) {
        toast.success('ADDRESS DELETED!');
        fetchAddresses();
      }
    } catch (err) {
      console.error('Error deleting address:', err);
      toast.error('FAILED TO DELETE ADDRESS');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const response = await addressService.setDefaultAddress(id);
      if (response.success) {
        toast.success('DEFAULT ADDRESS UPDATED!');
        fetchAddresses();
      }
    } catch (err) {
      console.error('Error setting default address:', err);
      toast.error('FAILED TO UPDATE DEFAULT ADDRESS');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      let response;
      if (editingAddress) {
        response = await addressService.updateAddress(editingAddress.id, formData);
      } else {
        response = await addressService.addAddress(formData);
      }

      if (response.success) {
        toast.success(editingAddress ? 'ADDRESS UPDATED!' : 'ADDRESS ADDED!');
        setIsModalOpen(false);
        fetchAddresses();
      }
    } catch (err) {
      console.error('Error saving address:', err);
      if (err.errorCode === 'VALIDATION_ERROR' && err.data) {
        // Show the first validation error
        const firstError = Object.values(err.data)[0];
        toast.error(firstError || 'VALIDATION FAILED');
      } else {
        toast.error(err.message || 'FAILED TO SAVE ADDRESS');
      }
    }
  };

  const breadcrumbItems = [
    { label: 'My Account', path: '/profile' },
    { label: 'Addresses', path: '/profile/addresses' },
  ];

  return (
    <div className="min-h-screen bg-light-50">
      <div className="container-street py-6">
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Header */}
        <div className="py-8 border-b-4 border-dark-950 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <FiMapPin size={48} className="text-dark-950" />
            <div>
              <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight glitch-street">
                MY ADDRESSES
              </h1>
              <p className="text-gray-600 font-bold uppercase tracking-wide mt-2">
                MANAGE YOUR SHIPPING ADDRESSES
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <AccountNav />
          </aside>

          <main className="lg:col-span-3">
            {/* Add New Button */}
            <button
              onClick={handleAddAddress}
              className="w-full mb-8 p-6 border-4 border-dashed border-gray-300 hover:border-street-blue hover:bg-light-100 transition-all group flex flex-col items-center justify-center gap-2"
            >
              <div className="w-12 h-12 rounded-full bg-light-200 group-hover:bg-street-blue group-hover:text-white flex items-center justify-center transition-colors">
                <FiPlus size={24} />
              </div>
              <span className="font-display font-black uppercase text-lg text-gray-400 group-hover:text-street-blue transition-colors">
                Add New Address
              </span>
            </button>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="h-48 bg-light-200 animate-pulse border-4 border-gray-300"></div>
                ))}
              </div>
            ) : addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <AddressCard
                    key={addr.id}
                    address={addr}
                    onEdit={handleEditAddress}
                    onDelete={handleDeleteAddress}
                    onSetDefault={handleSetDefault}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-4 border-gray-200 bg-white">
                <p className="text-gray-400 font-bold uppercase text-lg">
                  No addresses found
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      <AddressFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingAddress}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
      />
    </div>
  );
};

export default AddressesPage;

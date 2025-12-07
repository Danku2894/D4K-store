import { useState, useEffect } from 'react';
import { FiTag, FiPlus, FiEdit, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import couponService from '@services/coupon-service';

/**
 * AdminCoupons Component - Street Style
 * Quản lý mã giảm giá
 */
const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  // Create Modal State
  const [showModal, setShowModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderAmount: '',
    maxDiscount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    isActive: true
  });

  useEffect(() => {
    document.title = 'Coupons - D4K Admin';
    fetchCoupons();
  }, [currentPage]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await couponService.getAllCoupons({
        page: currentPage,
        size: pageSize,
        search: searchQuery,
      });

      if (response.success && response.data) {
        setCoupons(response.data.content);
        setTotalPages(response.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching coupons:', err);
      
      // Mock data
      setCoupons([
        { id: 1, code: 'WELCOME10', discountType: 'PERCENTAGE', discountValue: 10, status: 'ACTIVE', expiryDate: '2024-12-31' },
        { id: 2, code: 'SUMMER20', discountType: 'PERCENTAGE', discountValue: 20, status: 'EXPIRED', expiryDate: '2023-08-31' },
        { id: 3, code: 'FREESHIP', discountType: 'FIXED_AMOUNT', discountValue: 30000, status: 'ACTIVE', expiryDate: '2024-06-30' },
      ]);
      setTotalPages(1);
      
      toast('USING MOCK DATA', { icon: 'ℹ️', duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await couponService.createCoupon(newCoupon);
      toast.success('COUPON CREATED!');
      setShowModal(false);
      fetchCoupons();
      setNewCoupon({
        code: '',
        name: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        minOrderAmount: '',
        maxDiscount: '',
        startDate: '',
        endDate: '',
        usageLimit: '',
        isActive: true
      });
    } catch (err) {
      console.error('Error creating coupon:', err);
      toast.error('FAILED TO CREATE COUPON');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('DELETE THIS COUPON?')) return;

    try {
      await couponService.deleteCoupon(id);
      toast.success('COUPON DELETED!');
      fetchCoupons();
    } catch (err) {
      console.error('Error deleting coupon:', err);
      toast.error('FAILED TO DELETE');
    }
  };

  const formatValue = (type, value) => {
    if (type === 'PERCENTAGE') return `${value}%`;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-dark-950 mb-2 glitch-street">
              COUPONS
            </h1>
            <p className="text-gray-600 font-bold uppercase tracking-wide">
              MANAGE DISCOUNTS
            </p>
          </div>

          <button
            className="btn-street inline-flex items-center space-x-2"
            onClick={() => setShowModal(true)}
          >
            <FiPlus size={20} />
            <span>ADD COUPON</span>
          </button>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
              <FiSearch size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH COUPONS..."
              className="w-full pl-12 pr-4 py-3 border-2 border-dark-950 bg-light-50
                       text-dark-950 placeholder-gray-400 uppercase font-bold
                       focus:outline-none focus:border-street-red transition-all"
            />
          </div>
          <button
            onClick={() => { setCurrentPage(0); fetchCoupons(); }}
            className="px-6 py-3 border-2 border-dark-950 bg-dark-950 text-light-50
                     hover:bg-street-red hover:border-street-red font-bold uppercase
                     tracking-wide transition-all"
          >
            SEARCH
          </button>
        </div>

        {/* Coupons Table */}
        <div className="border-4 border-dark-950 bg-light-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-dark-950 text-light-50">
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                    CODE
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                    TYPE
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                    VALUE
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                    EXPIRY
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-dark-950">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center">
                      <div className="animate-pulse text-sm font-bold uppercase tracking-wide text-gray-600">
                        LOADING...
                      </div>
                    </td>
                  </tr>
                ) : coupons.length > 0 ? (
                  coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-light-100 transition-colors">
                      <td className="px-4 py-3 text-sm font-black uppercase text-street-red">
                        {coupon.code}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold uppercase">
                        {coupon.discountType}
                      </td>
                      <td className="px-4 py-3 text-sm font-black">
                        {formatValue(coupon.discountType, coupon.discountValue)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-600">
                        {new Date(coupon.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold">
                        <span className={`
                          px-2 py-1 text-xs uppercase
                          ${coupon.status === 'ACTIVE' ? 'bg-street-neon text-dark-950' : 'bg-gray-300 text-gray-600'}
                        `}>
                          {coupon.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => toast('EDIT COUPON - COMING SOON')}
                            className="p-2 border-2 border-dark-950 hover:bg-dark-950 
                                     hover:text-light-50 transition-all"
                            title="Edit"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id)}
                            className="p-2 border-2 border-street-red text-street-red 
                                     hover:bg-street-red hover:text-light-50 transition-all"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center">
                      <FiTag size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-sm font-bold uppercase tracking-wide text-gray-600">
                        NO COUPONS FOUND
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-4 py-2 border-2 border-dark-950 bg-dark-950 text-light-50
                         font-bold uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                PREV
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`px-4 py-2 border-2 border-dark-950 font-bold uppercase text-sm transition-all
                    ${currentPage === i 
                      ? 'bg-street-red text-light-50' 
                      : 'bg-light-50 text-dark-950 hover:bg-dark-950 hover:text-light-50'
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 border-2 border-dark-950 bg-dark-950 text-light-50
                         font-bold uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                NEXT
              </button>
            </div>
          </div>
        )}

        {/* Create Coupon Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm">
            <div className="bg-light-50 w-full max-w-2xl border-4 border-dark-950 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b-4 border-dark-950 flex justify-between items-center bg-street-red text-light-50">
                <h2 className="text-2xl font-display font-black uppercase tracking-tight">
                  ADD NEW COUPON
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-dark-950 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <form onSubmit={handleCreateCoupon} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-wide">Coupon Code</label>
                    <input
                      type="text"
                      required
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                      className="w-full p-3 border-2 border-dark-950 font-bold focus:outline-none focus:border-street-red"
                      placeholder="E.G. SUMMER2024"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-wide">Coupon Name</label>
                    <input
                      type="text"
                      required
                      value={newCoupon.name}
                      onChange={(e) => setNewCoupon({...newCoupon, name: e.target.value})}
                      className="w-full p-3 border-2 border-dark-950 font-bold focus:outline-none focus:border-street-red"
                      placeholder="E.G. SUMMER SALE"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-wide">Discount Type</label>
                    <select
                      value={newCoupon.discountType}
                      onChange={(e) => setNewCoupon({...newCoupon, discountType: e.target.value})}
                      className="w-full p-3 border-2 border-dark-950 font-bold focus:outline-none focus:border-street-red"
                    >
                      <option value="PERCENTAGE">PERCENTAGE (%)</option>
                      <option value="FIXED_AMOUNT">FIXED AMOUNT (VND)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-wide">Discount Value</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newCoupon.discountValue}
                      onChange={(e) => setNewCoupon({...newCoupon, discountValue: e.target.value})}
                      className="w-full p-3 border-2 border-dark-950 font-bold focus:outline-none focus:border-street-red"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-wide">Start Date</label>
                    <input
                      type="datetime-local"
                      required
                      value={newCoupon.startDate}
                      onChange={(e) => setNewCoupon({...newCoupon, startDate: e.target.value})}
                      className="w-full p-3 border-2 border-dark-950 font-bold focus:outline-none focus:border-street-red"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-wide">End Date</label>
                    <input
                      type="datetime-local"
                      required
                      value={newCoupon.endDate}
                      onChange={(e) => setNewCoupon({...newCoupon, endDate: e.target.value})}
                      className="w-full p-3 border-2 border-dark-950 font-bold focus:outline-none focus:border-street-red"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-wide">Min Order Amount</label>
                    <input
                      type="number"
                      min="0"
                      value={newCoupon.minOrderAmount}
                      onChange={(e) => setNewCoupon({...newCoupon, minOrderAmount: e.target.value})}
                      className="w-full p-3 border-2 border-dark-950 font-bold focus:outline-none focus:border-street-red"
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-wide">Usage Limit</label>
                    <input
                      type="number"
                      min="1"
                      value={newCoupon.usageLimit}
                      onChange={(e) => setNewCoupon({...newCoupon, usageLimit: e.target.value})}
                      className="w-full p-3 border-2 border-dark-950 font-bold focus:outline-none focus:border-street-red"
                      placeholder="UNLIMITED"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-wide">Description</label>
                  <textarea
                    rows="3"
                    value={newCoupon.description}
                    onChange={(e) => setNewCoupon({...newCoupon, description: e.target.value})}
                    className="w-full p-3 border-2 border-dark-950 font-bold focus:outline-none focus:border-street-red"
                    placeholder="COUPON DESCRIPTION..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={newCoupon.isActive}
                    onChange={(e) => setNewCoupon({...newCoupon, isActive: e.target.checked})}
                    className="w-5 h-5 border-2 border-dark-950 rounded-none text-street-red focus:ring-0"
                  />
                  <label htmlFor="isActive" className="text-sm font-black uppercase tracking-wide">
                    Active Status
                  </label>
                </div>

                <div className="pt-4 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 border-2 border-dark-950 font-bold uppercase hover:bg-gray-200 transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 border-2 border-dark-950 bg-dark-950 text-light-50 font-bold uppercase hover:bg-street-red hover:border-street-red transition-colors"
                  >
                    CREATE COUPON
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCoupons;

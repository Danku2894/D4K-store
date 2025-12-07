import { useState, useEffect } from 'react';
import { FiUsers, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import userService from '@services/user-service';

/**
 * AdminUsers Component - Street Style
 * Quản lý người dùng
 */
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    document.title = 'Users - D4K Admin';
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers({
        page: currentPage,
        size: pageSize,
        search: searchQuery,
      });

      if (response.success && response.data) {
        setUsers(response.data.content);
        setTotalPages(response.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      
      // Mock data
      setUsers([
        { id: 1, fullName: 'John Doe', email: 'john@example.com', role: 'USER', status: 'ACTIVE' },
        { id: 2, fullName: 'Jane Smith', email: 'jane@example.com', role: 'ADMIN', status: 'ACTIVE' },
        { id: 3, fullName: 'Mike Ross', email: 'mike@example.com', role: 'USER', status: 'LOCKED' },
      ]);
      setTotalPages(1);
      
      toast('USING MOCK DATA', { icon: 'ℹ️', duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('DELETE THIS USER?')) return;

    try {
      await userService.deleteUser(id);
      toast.success('USER DELETED!');
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('FAILED TO DELETE');
    }
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
              USERS
            </h1>
            <p className="text-gray-600 font-bold uppercase tracking-wide">
              MANAGE ACCOUNTS
            </p>
          </div>
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
              placeholder="SEARCH USERS..."
              className="w-full pl-12 pr-4 py-3 border-2 border-dark-950 bg-light-50
                       text-dark-950 placeholder-gray-400 uppercase font-bold
                       focus:outline-none focus:border-street-red transition-all"
            />
          </div>
          <button
            onClick={() => { setCurrentPage(0); fetchUsers(); }}
            className="px-6 py-3 border-2 border-dark-950 bg-dark-950 text-light-50
                     hover:bg-street-red hover:border-street-red font-bold uppercase
                     tracking-wide transition-all"
          >
            SEARCH
          </button>
        </div>

        {/* Users Table */}
        <div className="border-4 border-dark-950 bg-light-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-dark-950 text-light-50">
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                    NAME
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                    EMAIL
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">
                    ROLE
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
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-light-100 transition-colors">
                      <td className="px-4 py-3 text-sm font-bold">
                        #{user.id}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold uppercase">
                        {user.fullName}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-sm font-black">
                        <span className={`
                          px-2 py-1 text-xs uppercase
                          ${user.role === 'ADMIN' ? 'bg-street-red text-light-50' : 'bg-gray-200 text-dark-950'}
                        `}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold">
                        <span className={`
                          px-2 py-1 text-xs uppercase
                          ${user.status === 'ACTIVE' || user.isActive ? 'bg-street-neon text-dark-950' : 'bg-gray-300 text-gray-600'}
                        `}>
                          {user.status || (user.isActive ? 'ACTIVE' : 'INACTIVE')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => toast('EDIT USER - COMING SOON')}
                            className="p-2 border-2 border-dark-950 hover:bg-dark-950 
                                     hover:text-light-50 transition-all"
                            title="Edit"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
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
                      <FiUsers size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-sm font-bold uppercase tracking-wide text-gray-600">
                        NO USERS FOUND
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
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;

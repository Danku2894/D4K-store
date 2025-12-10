import { useState, useEffect } from 'react';
import { FiLayers, FiPlus, FiEdit, FiTrash2, FiSearch, FiX, FiImage } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import categoryService from '@services/category-service';
import uploadService from '@services/upload-service';

/**
 * AdminCategories Component - Street Style
 * Quản lý danh mục (CRUD)
 */
const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Create Modal State
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    parentId: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    document.title = 'Categories - D4K Admin';
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories();

      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Mock data if fails
      setCategories([
        { id: 1, name: 'T-Shirts', description: 'Streetwear Tees', productCount: 15 },
        { id: 2, name: 'Hoodies', description: 'Oversized Hoodies', productCount: 8 },
        { id: 3, name: 'Pants', description: 'Cargo & Joggers', productCount: 12 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('PLEASE SELECT AN IMAGE FILE');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('IMAGE SIZE MUST BE LESS THAN 10MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setNewCategory({ name: '', description: '', parentId: '', imageUrl: '' });
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
    setEditId(null);
  };

  const handleEdit = (category) => {
    setIsEditing(true);
    setEditId(category.id);
    setNewCategory({
      name: category.name,
      description: category.description || '',
      parentId: category.parentId || '',
      imageUrl: category.imageUrl || ''
    });
    // If has existing image, show it
    if (category.imageUrl) {
      setImagePreview(category.imageUrl);
    } else {
      setImagePreview(null);
    }
    setShowModal(true);
  };

  const handleCreateOrUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      let imageUrl = newCategory.imageUrl;
      
      // Upload NEW image if selected
      if (imageFile) {
        toast.loading('UPLOADING IMAGE...');
        const uploadResponse = await uploadService.uploadFile(imageFile);
        
        if (uploadResponse.success && uploadResponse.data) {
          imageUrl = uploadResponse.data.url;
          toast.dismiss();
          toast.success('IMAGE UPLOADED!');
        }
      }
      
      const data = {
        ...newCategory,
        parentId: newCategory.parentId || null,
        imageUrl: imageUrl || null
      };
      
      if (isEditing) {
        await categoryService.updateCategory(editId, data);
        toast.success('CATEGORY UPDATED!');
      } else {
        await categoryService.createCategory(data);
        toast.success('CATEGORY CREATED!');
      }
      
      setShowModal(false);
      fetchCategories();
      resetForm();
    } catch (err) {
      console.error('Error saving category:', err);
      toast.error(isEditing ? 'FAILED TO UPDATE' : 'FAILED TO CREATE');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('DELETE THIS CATEGORY?')) return;

    try {
      await categoryService.deleteCategory(id);
      toast.success('CATEGORY DELETED!');
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error('FAILED TO DELETE');
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-dark-950 mb-2 glitch-street">
              CATEGORIES
            </h1>
            <p className="text-gray-600 font-bold uppercase tracking-wide">
              ORGANIZE YOUR PRODUCTS
            </p>
          </div>

          <button
            className="btn-street inline-flex items-center space-x-2"
            onClick={() => setShowModal(true)}
          >
            <FiPlus size={20} />
            <span>ADD CATEGORY</span>
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
              placeholder="SEARCH CATEGORIES..."
              className="w-full pl-12 pr-4 py-3 border-2 border-dark-950 bg-light-50
                       text-dark-950 placeholder-gray-400 uppercase font-bold
                       focus:outline-none focus:border-street-red transition-all"
            />
          </div>
        </div>

        {/* Categories Table */}
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
                    DESCRIPTION
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-dark-950">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center">
                      <div className="animate-pulse text-sm font-bold uppercase tracking-wide text-gray-600">
                        LOADING...
                      </div>
                    </td>
                  </tr>
                ) : filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-light-100 transition-colors">
                      <td className="px-4 py-3 text-sm font-bold">
                        #{category.id}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold uppercase">
                        {category.name}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-600">
                        {category.description || 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-2 border-2 border-dark-950 hover:bg-dark-950 
                                     hover:text-light-50 transition-all"
                            title="Edit"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
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
                    <td colSpan="4" className="px-4 py-8 text-center">
                      <FiLayers size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-sm font-bold uppercase tracking-wide text-gray-600">
                        NO CATEGORIES FOUND
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Category Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm">
            <div className="bg-light-50 w-full max-w-lg border-4 border-dark-950">
              <div className="p-6 border-b-4 border-dark-950 flex justify-between items-center bg-street-red text-light-50">
                <h2 className="text-2xl font-display font-black uppercase tracking-tight">
                  {isEditing ? 'EDIT CATEGORY' : 'ADD NEW CATEGORY'}
                </h2>
                <button 
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="p-1 hover:bg-dark-950 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <form onSubmit={handleCreateOrUpdateCategory} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-wide">Category Name</label>
                  <input
                    type="text"
                    required
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    className="w-full p-3 border-2 border-dark-950 font-bold focus:outline-none focus:border-street-red"
                    placeholder="E.G. ACCESSORIES"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-wide">Parent Category (Optional)</label>
                  <select
                    value={newCategory.parentId}
                    onChange={(e) => setNewCategory({...newCategory, parentId: e.target.value})}
                    className="w-full p-3 border-2 border-dark-950 font-bold focus:outline-none focus:border-street-red"
                  >
                    <option value="">NONE (ROOT CATEGORY)</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-wide">Description</label>
                  <textarea
                    rows="3"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    className="w-full p-3 border-2 border-dark-950 font-bold focus:outline-none focus:border-street-red"
                    placeholder="CATEGORY DESCRIPTION..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-wide">Category Image (Optional)</label>
                  <div className="border-2 border-dashed border-dark-950 p-4">
                    {imagePreview ? (
                      <div className="space-y-2">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-48 object-cover border-2 border-dark-950"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="w-full px-4 py-2 border-2 border-street-red text-street-red font-bold uppercase hover:bg-street-red hover:text-light-50 transition-colors"
                        >
                          REMOVE IMAGE
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center cursor-pointer">
                        <FiImage size={48} className="text-gray-400 mb-2" />
                        <span className="text-sm font-bold uppercase text-gray-600">CLICK TO UPLOAD IMAGE</span>
                        <span className="text-xs text-gray-500 mt-1">JPG, PNG, GIF (MAX 10MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
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
                    disabled={uploading}
                    className="px-6 py-3 border-2 border-dark-950 bg-dark-950 text-light-50 font-bold uppercase hover:bg-street-red hover:border-street-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'SAVING...' : (isEditing ? 'UPDATE CATEGORY' : 'CREATE CATEGORY')}
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

export default AdminCategories;

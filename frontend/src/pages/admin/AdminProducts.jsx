import { useState, useEffect } from 'react';
import { FiPackage, FiPlus, FiEdit, FiTrash2, FiSearch, FiX, FiImage, FiMinus } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import productService from '@services/product-service';
import categoryService from '@services/category-service';
import uploadService from '@services/upload-service';

/**
 * AdminProducts Component - Street Style
 * Quản lý sản phẩm (CRUD) với Variants (Size/Color) và Multiple Images
 */
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  // Create Modal State
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    imageUrl: '',
    additionalImages: [], // Array of URLs
    isActive: true,
    variants: [
      { size: 'M', color: 'BLACK', stock: 10, priceAdjustment: 0 }
    ]
  });
  
  const [imageFile, setImageFile] = useState(null); // Main image file
  const [imagePreview, setImagePreview] = useState(null);
  
  const [additionalFiles, setAdditionalFiles] = useState([]); // Additional image files
  const [additionalPreviews, setAdditionalPreviews] = useState([]);
  
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    document.title = 'Products - D4K Admin';
    fetchProducts();
    fetchCategories();
  }, [currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProductsAdmin({
        page: currentPage,
        size: pageSize,
        search: searchQuery,
      });

      if (response.success && response.data) {
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error('FAILED TO LOAD PRODUCTS');
    } finally {
      setLoading(false);
    }
  };

  // Main Image Handler
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

  // Additional Images Handler
  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + additionalFiles.length > 5) {
      toast.error('MAXIMUM 5 ADDITIONAL IMAGES');
      return;
    }

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`INVALID FILE TYPE: ${file.name}`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`FILE TOO LARGE: ${file.name}`);
        return false;
      }
      return true;
    });

    setAdditionalFiles(prev => [...prev, ...validFiles]);

    // Generate previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdditionalPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAdditionalImage = (index) => {
    setAdditionalFiles(prev => prev.filter((_, i) => i !== index));
    setAdditionalPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Variant Handlers
  const handleAddVariant = () => {
    setNewProduct({
      ...newProduct,
      variants: [
        ...newProduct.variants,
        { size: '', color: '', stock: 0, priceAdjustment: 0 }
      ]
    });
  };

  const handleRemoveVariant = (index) => {
    if (newProduct.variants.length === 1) {
      toast.error('MUST HAVE AT LEAST ONE VARIANT');
      return;
    }
    const updatedVariants = newProduct.variants.filter((_, i) => i !== index);
    setNewProduct({ ...newProduct, variants: updatedVariants });
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...newProduct.variants];
    updatedVariants[index][field] = value;
    setNewProduct({ ...newProduct, variants: updatedVariants });
  };

  const calculateTotalStock = () => {
    return newProduct.variants.reduce((sum, v) => sum + (parseInt(v.stock) || 0), 0);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      // Validation
      if (newProduct.variants.some(v => !v.size || !v.stock)) {
        toast.error('PLEASE FILL ALL VARIANT FIELDS (SIZE & STOCK)');
        return;
      }

      setUploading(true);
      let mainImageUrl = '';
      let additionalImageUrls = [];
      
      // Upload Main Image
      if (imageFile) {
        toast.loading('UPLOADING MAIN IMAGE...');
        const uploadResponse = await uploadService.uploadFile(imageFile);
        if (uploadResponse.success && uploadResponse.data) {
          mainImageUrl = uploadResponse.data.url;
        }
      }

      // Upload Additional Images
      if (additionalFiles.length > 0) {
        toast.loading(`UPLOADING ${additionalFiles.length} ADDITIONAL IMAGES...`);
        for (const file of additionalFiles) {
          const response = await uploadService.uploadFile(file);
          if (response.success && response.data) {
            additionalImageUrls.push(response.data.url);
          }
        }
      }
      
      toast.dismiss();

      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        categoryId: parseInt(newProduct.categoryId),
        imageUrl: mainImageUrl || newProduct.imageUrl || null,
        additionalImages: additionalImageUrls,
        isActive: newProduct.isActive,
        variants: newProduct.variants.map(v => ({
          size: v.size.toUpperCase(),
          color: v.color ? v.color.toUpperCase() : 'DEFAULT',
          stock: parseInt(v.stock),
          priceAdjustment: parseFloat(v.priceAdjustment || 0)
        }))
      };
      
      await productService.createProduct(productData);
      toast.success('PRODUCT CREATED!');
      setShowModal(false);
      fetchProducts();
      
      // Reset form
      setNewProduct({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        imageUrl: '',
        additionalImages: [],
        isActive: true,
        variants: [{ size: 'M', color: 'BLACK', stock: 10, priceAdjustment: 0 }]
      });
      setImageFile(null);
      setImagePreview(null);
      setAdditionalFiles([]);
      setAdditionalPreviews([]);
    } catch (err) {
      console.error('Error creating product:', err);
      const errorMsg = err.response?.data?.message || 'FAILED TO CREATE PRODUCT';
      toast.error(errorMsg.toUpperCase());
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('DELETE THIS PRODUCT?')) return;

    try {
      await productService.deleteProduct(id);
      toast.success('PRODUCT DELETED!');
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('FAILED TO DELETE');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
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
              PRODUCTS
            </h1>
            <p className="text-gray-600 font-bold uppercase tracking-wide">
              MANAGE YOUR INVENTORY
            </p>
          </div>

          <button
            className="btn-street inline-flex items-center space-x-2"
            onClick={() => setShowModal(true)}
          >
            <FiPlus size={20} />
            <span>ADD PRODUCT</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
              <FiSearch size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH PRODUCTS..."
              className="w-full pl-12 pr-4 py-3 border-2 border-dark-950 bg-light-50
                       text-dark-950 placeholder-gray-400 uppercase font-bold
                       focus:outline-none focus:border-street-red transition-all"
            />
          </div>

          <button
            onClick={() => { setCurrentPage(0); fetchProducts(); }}
            className="px-6 py-3 border-2 border-dark-950 bg-dark-950 text-light-50
                     hover:bg-street-red hover:border-street-red font-bold uppercase
                     tracking-wide transition-all"
          >
            SEARCH
          </button>
        </div>

        {/* Products Table */}
        <div className="border-4 border-dark-950 bg-light-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-dark-950 text-light-50">
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">NAME</th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">CATEGORY</th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">PRICE</th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">TOTAL STOCK</th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider">STATUS</th>
                  <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-dark-950">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center">
                      <div className="animate-pulse text-sm font-bold uppercase tracking-wide text-gray-600">
                        LOADING...
                      </div>
                    </td>
                  </tr>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-light-100 transition-colors">
                      <td className="px-4 py-3 text-sm font-bold">#{product.id}</td>
                      <td className="px-4 py-3 text-sm font-bold uppercase">{product.name}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-600">
                        {product.categoryName || product.category || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm font-black">{formatPrice(product.price)}</td>
                      <td className="px-4 py-3 text-sm font-bold">
                        <span className={`
                          px-2 py-1 text-xs uppercase
                          ${product.stock > 10 ? 'bg-street-neon text-dark-950' : product.stock > 0 ? 'bg-yellow-400 text-dark-950' : 'bg-street-red text-light-50'}
                        `}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold">
                        <span className={`px-2 py-1 text-xs uppercase ${product.isActive ? 'bg-street-neon text-dark-950' : 'bg-gray-300 text-gray-600'}`}>
                          {product.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 border-2 border-street-red text-street-red hover:bg-street-red hover:text-light-50 transition-all"
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
                    <td colSpan="7" className="px-4 py-8 text-center">
                      <FiPackage size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-sm font-bold uppercase tracking-wide text-gray-600">NO PRODUCTS FOUND</p>
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
                className="px-4 py-2 border-2 border-dark-950 bg-dark-950 text-light-50 font-bold uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                PREV
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`px-4 py-2 border-2 border-dark-950 font-bold uppercase text-sm transition-all
                    ${currentPage === i ? 'bg-street-red text-light-50' : 'bg-light-50 text-dark-950 hover:bg-dark-950 hover:text-light-50'}`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 border-2 border-dark-950 bg-dark-950 text-light-50 font-bold uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                NEXT
              </button>
            </div>
          </div>
        )}

        {/* Create Product Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm">
            <div className="bg-light-50 w-full max-w-3xl border-4 border-dark-950 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b-4 border-dark-950 flex justify-between items-center bg-street-red text-light-50">
                <h2 className="text-2xl font-display font-black uppercase tracking-tight">ADD NEW PRODUCT</h2>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-dark-950 transition-colors">
                  <FiX size={24} />
                </button>
              </div>
              
              <form onSubmit={handleCreateProduct} className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-wide">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full p-3 border-2 border-dark-950 font-bold focus:outline-none focus:border-street-red"
                      placeholder="E.G. OVERSIZED TEE"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-wide">Category *</label>
                    <select
                      required
                      value={newProduct.categoryId}
                      onChange={(e) => setNewProduct({...newProduct, categoryId: e.target.value})}
                      className="w-full p-3 border-2 border-dark-950 font-bold focus:outline-none focus:border-street-red"
                    >
                      <option value="">SELECT CATEGORY</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-wide">Price (VND) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full p-3 border-2 border-dark-950 font-bold focus:outline-none focus:border-street-red"
                    placeholder="0"
                  />
                </div>

                {/* Variants Section */}
                <div className="space-y-2 border-2 border-dark-950 p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-black uppercase tracking-wide">Variants (Size & Color) *</label>
                    <span className="text-sm font-bold text-street-red">TOTAL STOCK: {calculateTotalStock()}</span>
                  </div>
                  
                  {newProduct.variants.map((variant, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1 space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500">Size</label>
                        <input
                          type="text"
                          required
                          value={variant.size}
                          onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                          className="w-full p-2 border-2 border-dark-950 font-bold text-sm focus:outline-none focus:border-street-red"
                          placeholder="S, M, L..."
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500">Color</label>
                        <input
                          type="text"
                          value={variant.color}
                          onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                          className="w-full p-2 border-2 border-dark-950 font-bold text-sm focus:outline-none focus:border-street-red"
                          placeholder="BLACK, RED..."
                        />
                      </div>
                      <div className="w-24 space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500">Stock</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={variant.stock}
                          onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                          className="w-full p-2 border-2 border-dark-950 font-bold text-sm focus:outline-none focus:border-street-red"
                          placeholder="0"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(index)}
                        className="p-2 border-2 border-dark-950 text-dark-950 hover:bg-street-red hover:text-light-50 hover:border-street-red transition-colors h-[42px]"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="mt-2 flex items-center space-x-1 text-sm font-black uppercase text-dark-950 hover:text-street-red"
                  >
                    <FiPlus size={16} /> <span>ADD VARIANT</span>
                  </button>
                </div>

                {/* Main Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-wide">Main Product Image</label>
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
                        <span className="text-sm font-bold uppercase text-gray-600">CLICK TO UPLOAD MAIN IMAGE</span>
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

                {/* Additional Images Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-wide">Additional Images (Max 5)</label>
                  <div className="border-2 border-dashed border-dark-950 p-4">
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {additionalPreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={preview} 
                            alt={`Preview ${index}`} 
                            className="w-full h-24 object-cover border-2 border-dark-950"
                          />
                          <button
                            type="button"
                            onClick={() => removeAdditionalImage(index)}
                            className="absolute top-1 right-1 p-1 bg-street-red text-light-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FiX size={12} />
                          </button>
                        </div>
                      ))}
                      
                      {additionalPreviews.length < 5 && (
                        <label className="flex flex-col items-center justify-center h-24 border-2 border-dark-950 cursor-pointer hover:bg-gray-100 transition-colors">
                          <FiPlus size={24} className="text-gray-400" />
                          <span className="text-xs font-bold uppercase text-gray-600 mt-1">ADD MORE</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleAdditionalImagesChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-wide">Description</label>
                  <textarea
                    rows="4"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full p-3 border-2 border-dark-950 font-bold focus:outline-none focus:border-street-red"
                    placeholder="PRODUCT DESCRIPTION..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={newProduct.isActive}
                    onChange={(e) => setNewProduct({...newProduct, isActive: e.target.checked})}
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
                    disabled={uploading}
                    className="px-6 py-3 border-2 border-dark-950 bg-dark-950 text-light-50 font-bold uppercase hover:bg-street-red hover:border-street-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'UPLOADING...' : 'CREATE PRODUCT'}
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

export default AdminProducts;

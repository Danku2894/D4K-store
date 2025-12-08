import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiPackage } from 'react-icons/fi';
import Breadcrumb from '@components/common/Breadcrumb';
import FilterSidebar from '@components/category/FilterSidebar';
import ProductCard from '@components/product/ProductCard';
import Pagination from '@components/common/Pagination';
import productService from '@services/product-service';

/**
 * ProductsPage Component - Street Style
 * Trang danh sách tất cả sản phẩm với filters nâng cao
 */
const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 12;

  // Filter state
  const [filters, setFilters] = useState({
    categoryId: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    size: searchParams.get('size') || '',
    color: searchParams.get('color') || '',
    sort: searchParams.get('sort') || 'createdAt,desc',
  });

  useEffect(() => {
    document.title = 'All Products - D4K Store';
  }, []);

  useEffect(() => {
    // Sync filters from URL params when they change
    setFilters({
      categoryId: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      size: searchParams.get('size') || '',
      color: searchParams.get('color') || '',
      sort: searchParams.get('sort') || 'createdAt,desc',
    });
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage - 1,
        size: pageSize,
        ...(filters.categoryId && { categoryId: filters.categoryId }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.size && { size: filters.size }),
        ...(filters.color && { color: filters.color }),
        ...(filters.sort && { sort: filters.sort }),
      };

      let response;
      
      if (filters.categoryId) {
        // If category is selected, use the category specific endpoint
        // Don't send categoryId in params since it's already in the URL
        const { categoryId, ...paramsWithoutCategory } = params;
        response = await productService.getProductsByCategory(filters.categoryId, paramsWithoutCategory);
      } else {
        // Otherwise use the general endpoint
        response = await productService.getProducts(params);
      }

      if (response.success && response.data) {
        setProducts(response.data.content || response.data);
        setTotalPages(response.data.totalPages || 1);
        setTotalItems(response.data.totalElements || response.data.length || 0);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    // Update URL query params
    const params = new URLSearchParams();
    if (newFilters.categoryId) params.set('category', newFilters.categoryId);
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice);
    if (newFilters.size) params.set('size', newFilters.size);
    if (newFilters.color) params.set('color', newFilters.color);
    if (newFilters.sort) params.set('sort', newFilters.sort);
    
    setSearchParams(params);
    // State update will happen via useEffect [searchParams]
  };

  const handlePageChange = (page) => {
    // Pagination component passes 0-indexed page, convert to 1-indexed for our state
    setCurrentPage(page + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'All Products', path: null },
  ];

  return (
    <div className="min-h-screen bg-light-50">
      <div className="container-street py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Header */}
        <div className="py-8 border-b-4 border-dark-950 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <FiPackage size={48} className="text-dark-950" />
            <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight glitch-street">
              ALL PRODUCTS
            </h1>
          </div>
          <p className="text-gray-600 font-bold uppercase tracking-wide">
            {loading ? 'LOADING...' : `${totalItems} PRODUCTS FOUND`}
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <aside className="lg:w-1/4">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(pageSize)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-light-200 border-2 border-gray-300"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-light-200"></div>
                      <div className="h-6 bg-light-200 w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-12">
                <div className="inline-block p-6 border-4 border-street-red">
                  <p className="text-street-red font-bold uppercase mb-4">{error}</p>
                  <button
                    onClick={fetchProducts}
                    className="btn-street"
                  >
                    TRY AGAIN
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && products.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 pt-8 border-t-4 border-dark-950">
                    <Pagination
                      currentPage={currentPage - 1}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}

                {/* Results Summary */}
                <div className="mt-8 text-center">
                  <p className="text-sm font-bold uppercase tracking-wide text-gray-600">
                    SHOWING {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalItems)} OF {totalItems} PRODUCTS
                  </p>
                </div>
              </>
            )}

            {/* Empty State */}
            {!loading && !error && products.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-block p-12 border-4 border-dark-950">
                  <FiPackage size={80} className="mx-auto mb-6 text-gray-400" />
                  <h2 className="text-3xl font-display font-black uppercase tracking-tight text-gray-600 mb-4">
                    NO PRODUCTS FOUND
                  </h2>
                  <p className="text-gray-600 font-medium mb-6">
                    Try adjusting your filters or search criteria.
                  </p>
                  <button
                    onClick={() => {
                      setFilters({
                        categoryId: '',
                        minPrice: '',
                        maxPrice: '',
                        size: '',
                        color: '',
                        sort: 'createdAt,desc',
                      });
                      setSearchParams({});
                    }}
                    className="btn-street"
                  >
                    CLEAR FILTERS
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;


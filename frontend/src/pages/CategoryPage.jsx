import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { FiFilter, FiGrid, FiList } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import SEOHelmet from '@components/common/SEOHelmet';
import Breadcrumb from '@components/common/Breadcrumb';
import FilterSidebar from '@components/category/FilterSidebar';
import ProductCard from '@components/product/ProductCard';
import Pagination from '@components/common/Pagination';
import productService from '@services/product-service';
import categoryService from '@services/category-service';

/**
 * CategoryPage Component - Street Style
 * Trang hiển thị sản phẩm theo category với filters
 */
const CategoryPage = () => {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Filters state
  const [filters, setFilters] = useState({
    priceRange: '',
    sizes: [],
    colors: [],
    sort: 'createdAt,desc',
  });

  // Fetch category details
  useEffect(() => {
    if (categoryId) {
      fetchCategoryDetails();
    }
  }, [categoryId]);

  // Fetch products khi filters hoặc page thay đổi
  useEffect(() => {
    fetchProducts();
  }, [categoryId, currentPage, filters]);

  // Page title is now handled by SEOHelmet component

  const fetchCategoryDetails = async () => {
    try {
      const response = await categoryService.getCategoryById(categoryId);
      if (response.success && response.data) {
        setCategory(response.data);
      }
    } catch (err) {
      console.error('Error fetching category:', err);
      toast.error('Cannot load category details');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Build params
      const params = {
        page: currentPage,
        size: 12,
        categoryId: categoryId,
      };

      // Add sort
      if (filters.sort) {
        params.sort = filters.sort;
      }

      // Add price range
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-');
        params.minPrice = min;
        params.maxPrice = max;
      }

      // Add sizes (if API supports)
      if (filters.sizes?.length > 0) {
        params.sizes = filters.sizes.join(',');
      }

      // Add colors (if API supports)
      if (filters.colors?.length > 0) {
        params.colors = filters.colors.join(',');
      }

      const response = await productService.getProducts(params);
      
      if (response.success && response.data) {
        setProducts(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
        setTotalElements(response.data.totalElements || 0);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error('Cannot load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(0); // Reset về trang đầu khi filter
  };

  const handleResetFilters = () => {
    setFilters({
      priceRange: '',
      sizes: [],
      colors: [],
      sort: 'createdAt,desc',
    });
    setCurrentPage(0);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Products', path: '/products' },
    { label: category?.name || 'Category', path: null },
  ];

  return (
    <>
      {/* SEO Meta Tags - Dynamic based on category */}
      {category && (
        <SEOHelmet 
          title={`${category.name} Streetwear chính hãng - ${totalElements} sản phẩm | D4K Store`}
          description={`Mua ${category.name} streetwear chính hãng tại D4K Store. ${category.description || `Bộ sưu tập ${category.name} đa dạng, phong cách street culture độc đáo`}. ${totalElements} sản phẩm chất lượng cao, giá tốt nhất. Giao hàng toàn quốc, freeship từ 500k. Đổi trả dễ dàng trong 7 ngày.`}
          keywords={`${category.name}, mua ${category.name}, ${category.name} streetwear, ${category.name} y2k, ${category.name} giá rẻ, ${category.name} chính hãng, shop ${category.name}, thời trang ${category.name}, d4k store`}
          image={category.imageUrl || '/logo.png'}
          url={`/category/${categoryId}`}
          type="website"
        />
      )}
      
      <div className="min-h-screen bg-light-50">
        <div className="container-street py-6">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

        {/* Category Header */}
        <div className="py-8 border-b-4 border-dark-950 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight mb-2 glitch-street">
                {category?.name || 'Products'}
              </h1>
              {category?.description && (
                <p className="text-gray-600 font-medium max-w-2xl">
                  {category.description}
                </p>
              )}
            </div>
            
            {/* Results Count */}
            <div className="text-right">
              <p className="text-sm font-bold uppercase tracking-wider text-gray-600">
                {loading ? 'Loading...' : `${totalElements} Products Found`}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar - Desktop */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-dark-950">
              {/* Mobile Filter Button */}
              <button
                onClick={toggleFilter}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 border-2 border-dark-950 
                         bg-transparent text-dark-950 hover:bg-dark-950 hover:text-light-50 
                         font-bold uppercase text-sm tracking-wide transition-all"
              >
                <FiFilter size={18} />
                <span>FILTERS</span>
              </button>

              {/* View Mode Toggle - Desktop */}
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 border-2 border-dark-950 transition-all
                            ${viewMode === 'grid' 
                              ? 'bg-dark-950 text-light-50' 
                              : 'bg-transparent text-dark-950 hover:bg-dark-950 hover:text-light-50'
                            }`}
                  aria-label="Grid view"
                >
                  <FiGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 border-2 border-dark-950 transition-all
                            ${viewMode === 'list' 
                              ? 'bg-dark-950 text-light-50' 
                              : 'bg-transparent text-dark-950 hover:bg-dark-950 hover:text-light-50'
                            }`}
                  aria-label="List view"
                >
                  <FiList size={20} />
                </button>
              </div>

              {/* Active Filters Count */}
              <div className="text-sm font-bold uppercase tracking-wide text-gray-600">
                {filters.priceRange || filters.sizes?.length > 0 || filters.colors?.length > 0 ? (
                  <span>
                    {[
                      filters.priceRange ? 1 : 0,
                      filters.sizes?.length || 0,
                      filters.colors?.length || 0,
                    ].reduce((a, b) => a + b, 0)} ACTIVE
                  </span>
                ) : null}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className={`
                grid gap-6 
                ${viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
                }
              `}>
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="product-card-street animate-pulse">
                    <div className="aspect-[3/4] bg-light-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-light-200 w-1/3"></div>
                      <div className="h-6 bg-light-200 w-3/4"></div>
                      <div className="h-4 bg-light-200 w-full"></div>
                      <div className="h-8 bg-light-200 w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!loading && products.length > 0 && (
              <div className={`
                grid gap-6 
                ${viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
                }
              `}>
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ 
                      animationDelay: `${index * 0.05}s`,
                      animationFillMode: 'both',
                    }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-block p-8 border-4 border-dark-950">
                  <p className="text-2xl font-black uppercase tracking-wide mb-4">
                    NO PRODUCTS FOUND
                  </p>
                  <p className="text-gray-600 font-medium mb-6">
                    Try adjusting your filters or search criteria
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="btn-street"
                  >
                    RESET FILTERS
                  </button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {!loading && products.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                loading={loading}
              />
            )}
          </div>
        </div>

        {/* Mobile Filter Sidebar */}
        <div className="lg:hidden">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            isOpen={isFilterOpen}
            onClose={toggleFilter}
          />
        </div>
      </div>
    </>
  );
};

export default CategoryPage;


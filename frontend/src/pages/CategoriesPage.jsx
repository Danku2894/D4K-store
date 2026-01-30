import { useState, useEffect } from 'react';
import { FiGrid } from 'react-icons/fi';
import SEOHelmet from '@components/common/SEOHelmet';
import Breadcrumb from '@components/common/Breadcrumb';
import CategoryCard from '@components/categories/CategoryCard';
import categoryService from '@services/category-service';

/**
 * CategoriesPage Component - Street Style
 * Trang danh sách tất cả categories
 */
const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await categoryService.getAllCategories();

      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Categories', path: null },
  ];

  return (
    <>
      <SEOHelmet 
        title="Danh mục sản phẩm Streetwear - Tất cả Categories | D4K Store"
        description={`Khám phá ${categories.length} danh mục sản phẩm streetwear tại D4K Store. Áo hoodie, áo thun, quần baggy, phụ kiện và nhiều hơn nữa. Phong cách street culture đa dạng, chất lượng cao, giá tốt nhất.`}
        keywords="danh mục streetwear, categories streetwear, phân loại sản phẩm, các loại áo streetwear, thể loại thời trang đường phố, d4k categories"
        image="/logo.png"
        url="/categories"
        type="website"
      />
      
      <div className="min-h-screen bg-light-50">
        <div className="container-street py-6">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

        {/* Page Header */}
        <div className="py-8 border-b-4 border-dark-950 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <FiGrid size={48} className="text-dark-950" />
            <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight glitch-street">
              CATEGORIES
            </h1>
          </div>
          <p className="text-gray-600 font-bold uppercase tracking-wide">
            EXPLORE ALL PRODUCT CATEGORIES
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-light-200 border-2 border-gray-300"></div>
                <div className="p-6 bg-light-100 border-t-2 border-gray-300 space-y-3">
                  <div className="h-6 bg-light-200"></div>
                  <div className="h-4 bg-light-200 w-3/4"></div>
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
                onClick={fetchCategories}
                className="btn-street"
              >
                TRY AGAIN
              </button>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        {!loading && !error && categories.length > 0 && (
          <>
            {/* Grid Layout - Asymmetric Street Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(450px,auto)]">
              {categories.map((category, index) => {
                // Logic for Alternating Bento Grid
                // Pattern repeats every 5 items (1 block)
                // Even blocks (0, 2...): Large item at index 2 (Right side)
                // Odd blocks (1, 3...): Large item at index 0 (Left side)
                const blockIndex = Math.floor(index / 5);
                const isEvenBlock = blockIndex % 2 === 0;
                const posInBlock = index % 5;
                
                const isLarge = isEvenBlock ? posInBlock === 2 : posInBlock === 0;
                
                return (
                  <div
                    key={category.id}
                    className={`
                      ${isLarge ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : ''}
                    `}
                  >
                    <CategoryCard category={category} className="h-full" />
                  </div>
                );
              })}
            </div>

            {/* Total Count */}
            <div className="mt-12 pt-8 border-t-2 border-dark-950 text-center">
              <p className="text-lg font-black uppercase tracking-wide text-gray-600">
                TOTAL: {categories.length} {categories.length === 1 ? 'CATEGORY' : 'CATEGORIES'}
              </p>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && categories.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-12 border-4 border-dark-950">
              <FiGrid size={80} className="mx-auto mb-6 text-gray-400" />
              <h2 className="text-3xl font-display font-black uppercase tracking-tight text-gray-600 mb-4">
                NO CATEGORIES FOUND
              </h2>
              <p className="text-gray-600 font-medium mb-6">
                There are no categories available at the moment.
              </p>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;


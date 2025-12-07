import { useState, useEffect } from 'react';
import { FiGrid } from 'react-icons/fi';
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
    document.title = 'Categories - D4K Store';
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
            {/* Grid Layout - Asymmetric */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className={`
                    ${index % 7 === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}
                    ${index % 11 === 0 ? 'lg:row-span-2' : ''}
                  `}
                >
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>

            {/* Total Count */}
            <div className="mt-12 pt-8 border-t-4 border-dark-950 text-center">
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
  );
};

export default CategoriesPage;


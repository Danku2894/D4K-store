import { useState, useEffect } from 'react';
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import categoryService from '@services/category-service';

/**
 * FilterSidebar Component - Street Style
 * Sidebar filter với collapsible sections
 * 
 * @param {Object} filters - Current filter values
 * @param {Function} onFilterChange - Handler khi filter thay đổi
 * @param {Function} onReset - Handler reset filters
 * @param {Boolean} isOpen - Mobile filter open state
 * @param {Function} onClose - Mobile filter close handler
 */
const FilterSidebar = ({ filters = {}, onFilterChange, onReset, isOpen = true, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    sort: true,
  });
  
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Sort options (backend supports: sortBy and direction)
  const sortOptions = [
    { label: 'Newest First', value: 'createdAt,desc' },
    { label: 'Oldest First', value: 'createdAt,asc' },
    { label: 'Price: Low to High', value: 'price,asc' },
    { label: 'Price: High to Low', value: 'price,desc' },
    { label: 'Name: A-Z', value: 'name,asc' },
    { label: 'Name: Z-A', value: 'name,desc' },
  ];

  const handleCategoryChange = (categoryId) => {
    onFilterChange({ ...filters, categoryId: categoryId || '' });
  };

  const handleSortChange = (value) => {
    onFilterChange({ ...filters, sort: value });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div 
          className="fixed inset-0 bg-dark-950/50 z-[55] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-auto
          w-80 lg:w-full bg-light-50 border-r-4 lg:border-r-0 lg:border-2 border-dark-950
          overflow-y-auto z-[60] lg:z-0
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-dark-950">
            <h2 className="text-2xl font-display font-black uppercase tracking-tight">
              FILTERS
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden text-dark-950 hover:text-street-red transition-colors"
              >
                <FiX size={24} />
              </button>
            )}
          </div>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="w-full py-2 border-2 border-dark-950 bg-transparent text-dark-950 
                     font-bold uppercase text-sm tracking-wide hover:bg-dark-950 hover:text-light-50 
                     transition-all"
          >
            RESET ALL
          </button>

          {/* Category Filter */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('category')}
              className="w-full flex items-center justify-between font-bold uppercase text-sm tracking-wide"
            >
              <span>CATEGORY</span>
              {expandedSections.category ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {expandedSections.category && (
              <div className="space-y-2 pl-2">
                {/* All Categories option */}
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={!filters.categoryId}
                    onChange={() => handleCategoryChange('')}
                    className="w-4 h-4 border-2 border-dark-950 checked:bg-dark-950"
                  />
                  <span className="text-sm font-medium group-hover:text-street-red transition-colors">
                    All Categories
                  </span>
                </label>
                
                {loadingCategories ? (
                  <div className="text-sm text-gray-500">Loading...</div>
                ) : (
                  categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={filters.categoryId === String(category.id)}
                        onChange={() => handleCategoryChange(String(category.id))}
                        className="w-4 h-4 border-2 border-dark-950 checked:bg-dark-950"
                      />
                      <span className="text-sm font-medium group-hover:text-street-red transition-colors">
                        {category.name}
                      </span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t-2 border-dark-950"></div>

          {/* Sort */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('sort')}
              className="w-full flex items-center justify-between font-bold uppercase text-sm tracking-wide"
            >
              <span>SORT BY</span>
              {expandedSections.sort ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {expandedSections.sort && (
              <div className="space-y-2 pl-2">
                {sortOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="sort"
                      value={option.value}
                      checked={filters.sort === option.value}
                      onChange={() => handleSortChange(option.value)}
                      className="w-4 h-4 border-2 border-dark-950 checked:bg-dark-950"
                    />
                    <span className="text-sm font-medium group-hover:text-street-red transition-colors">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;


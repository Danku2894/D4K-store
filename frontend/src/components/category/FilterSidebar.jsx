import { useState } from 'react';
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

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
    price: true,
    size: true,
    color: true,
    sort: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Price ranges
  const priceRanges = [
    { label: 'Under 500k', value: '0-500000' },
    { label: '500k - 1M', value: '500000-1000000' },
    { label: '1M - 2M', value: '1000000-2000000' },
    { label: '2M - 5M', value: '2000000-5000000' },
    { label: 'Over 5M', value: '5000000-999999999' },
  ];

  // Sizes
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Colors
  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Red', hex: '#FF0000' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Olive', hex: '#808000' },
  ];

  // Sort options
  const sortOptions = [
    { label: 'Newest First', value: 'createdAt,desc' },
    { label: 'Price: Low to High', value: 'price,asc' },
    { label: 'Price: High to Low', value: 'price,desc' },
    { label: 'Name: A-Z', value: 'name,asc' },
  ];

  const handlePriceChange = (value) => {
    onFilterChange({ ...filters, priceRange: value });
  };

  const handleSizeChange = (size) => {
    const currentSizes = filters.sizes || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size];
    onFilterChange({ ...filters, sizes: newSizes });
  };

  const handleColorChange = (color) => {
    const currentColors = filters.colors || [];
    const newColors = currentColors.includes(color)
      ? currentColors.filter(c => c !== color)
      : [...currentColors, color];
    onFilterChange({ ...filters, colors: newColors });
  };

  const handleSortChange = (value) => {
    onFilterChange({ ...filters, sort: value });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div 
          className="fixed inset-0 bg-dark-950/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-auto
          w-80 lg:w-full bg-light-50 border-r-4 lg:border-r-0 lg:border-2 border-dark-950
          overflow-y-auto z-50 lg:z-0
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

          {/* Price Range */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('price')}
              className="w-full flex items-center justify-between font-bold uppercase text-sm tracking-wide"
            >
              <span>PRICE</span>
              {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {expandedSections.price && (
              <div className="space-y-2 pl-2">
                {priceRanges.map((range) => (
                  <label
                    key={range.value}
                    className="flex items-center space-x-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      value={range.value}
                      checked={filters.priceRange === range.value}
                      onChange={() => handlePriceChange(range.value)}
                      className="w-4 h-4 border-2 border-dark-950 checked:bg-dark-950"
                    />
                    <span className="text-sm font-medium group-hover:text-street-red transition-colors">
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t-2 border-dark-950"></div>

          {/* Size */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('size')}
              className="w-full flex items-center justify-between font-bold uppercase text-sm tracking-wide"
            >
              <span>SIZE</span>
              {expandedSections.size ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {expandedSections.size && (
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    className={`
                      py-2 border-2 border-dark-950 font-bold uppercase text-sm
                      transition-all
                      ${(filters.sizes || []).includes(size)
                        ? 'bg-dark-950 text-light-50'
                        : 'bg-transparent text-dark-950 hover:bg-dark-950 hover:text-light-50'
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>


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


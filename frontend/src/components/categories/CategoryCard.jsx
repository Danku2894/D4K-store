import { Link } from 'react-router-dom';

/**
 * CategoryCard Component - Street Style
 * Card hiển thị category
 * 
 * @param {Object} category - Category data
 */
const CategoryCard = ({ category, className = '' }) => {
  return (
    <Link
      to={`/products?category=${category.id}`}
      className={`group flex flex-col h-full border-2 border-dark-950 bg-light-50 overflow-hidden
               hover:border-street-red hover:scale-[1.02] transition-all duration-300 ${className}`}
    >
      {/* Image with Overlay */}
      <div className="relative flex-1 overflow-hidden min-h-[200px]">
        {/* Category Image */}
        <img
          src={category.imageUrl || '/placeholder-category.jpg'}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover filter-grayscale-80 
                   group-hover:filter-grayscale-0 group-hover:scale-110 
                   transition-all duration-500"
        />

        {/* Noise Overlay */}
        <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none"></div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-dark-950/0 group-hover:bg-dark-950/20 
                      transition-all duration-300"></div>

        {/* Product Count Badge */}
        {category.productCount !== undefined && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-dark-950 border-2 border-dark-950 
                        group-hover:bg-street-red group-hover:border-street-red transition-all z-10">
            <span className="text-light-50 font-black text-xs uppercase tracking-wider">
              {category.productCount} ITEMS
            </span>
          </div>
        )}
      </div>

      {/* Category Info */}
      <div className="p-5 bg-light-50 border-t-2 border-dark-950 shrink-0">
        <h3 className="text-xl font-display font-black uppercase tracking-tight 
                     text-dark-950 group-hover:text-street-red transition-colors mb-2">
          {category.name}
        </h3>

        {category.description && (
          <p className="text-sm text-gray-600 font-medium line-clamp-2">
            {category.description}
          </p>
        )}

        {/* CTA */}
        <div className="mt-4 flex items-center space-x-2 text-sm font-bold uppercase tracking-wide 
                      text-dark-950 group-hover:text-street-red transition-colors">
          <span>SHOP NOW</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;


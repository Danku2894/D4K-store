import { Link } from 'react-router-dom';
import { FiShoppingBag, FiArrowRight } from 'react-icons/fi';

/**
 * RecommendedProducts Component - Street Style
 * Hiển thị danh sách sản phẩm được đề xuất
 * 
 * @param {String} title - Tiêu đề section
 * @param {Array} products - Danh sách sản phẩm
 * @param {Boolean} loading - Loading state
 */
const RecommendedProducts = ({ title = 'RECOMMENDED', products = [], loading = false }) => {
  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="py-12">
        <h2 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight mb-8 flex items-center gap-3">
          <FiShoppingBag size={28} />
          {title}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-200 border-2 border-gray-300 mb-3"></div>
              <div className="h-4 bg-gray-200 mb-2 w-3/4"></div>
              <div className="h-6 bg-gray-200 w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="py-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight flex items-center gap-3">
          <FiShoppingBag size={28} />
          {title}
        </h2>
        <Link 
          to="/products" 
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide 
                   text-gray-600 hover:text-dark-950 transition-colors"
        >
          VIEW ALL <FiArrowRight />
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.slice(0, 8).map((product) => (
          <Link 
            key={product.id}
            to={`/product/${product.id}`}
            className="group block border-2 border-dark-950 bg-light-50 overflow-hidden
                     hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.02] 
                     transition-all duration-300"
          >
            {/* Image */}
            <div className="aspect-[3/4] overflow-hidden bg-gray-100">
              <img
                src={product.imageUrl || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Category */}
              {product.categoryName && (
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  {product.categoryName}
                </p>
              )}
              
              {/* Name */}
              <h3 className="font-bold uppercase text-sm leading-tight line-clamp-2 mb-2 
                           group-hover:text-street-red transition-colors">
                {product.name}
              </h3>

              {/* Price */}
              <div className="flex items-center gap-2">
                {product.salePrice && product.salePrice < product.price ? (
                  <>
                    <span className="font-black text-street-red text-lg">
                      {formatPrice(product.salePrice)}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="font-black text-dark-950 text-lg">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;

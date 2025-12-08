import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import useCartStore from '@store/use-cart-store';
import useWishlistStore from '@store/use-wishlist-store';

/**
 * ProductCard Component - Y2K Style
 * Card hiển thị sản phẩm với hover effects
 * 
 * @param {Object} product - Thông tin sản phẩm
 */
const ProductCard = ({ product }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock <= 0) {
      toast.error('Sản phẩm đã hết hàng!');
      return;
    }
    
    addToCart(product, 1);
    toast.success(`Added ${product.name} to cart!`, {
      icon: '🛒',
      style: {
        background: '#000000',
        color: '#ffffff',
        border: '2px solid #000000',
        fontWeight: 'bold',
        textTransform: 'uppercase',
      },
    });
  };

  // Handle toggle wishlist
  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const added = toggleWishlist(product);
    
    if (added) {
      toast.success('Added to wishlist!', {
        icon: '❤️',
        style: {
          background: '#FF0000',
          color: '#ffffff',
          border: '2px solid #000000',
          fontWeight: 'bold',
          textTransform: 'uppercase',
        },
      });
    } else {
      toast.success('Removed from wishlist!', {
        icon: '💔',
        style: {
          background: '#000000',
          color: '#ffffff',
          border: '2px solid #000000',
          fontWeight: 'bold',
          textTransform: 'uppercase',
        },
      });
    }
  };

  return (
    <Link 
      to={`/product/${product.id}`}
      className="product-card-street group block"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-light-200">
        {/* Product Image */}
        <img
          src={product.imageUrl || '/placeholder-product.jpg'}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 
                    ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Loading Skeleton */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800 animate-pulse" />
        )}

        {/* Stock Badge */}
        {product.stock <= 0 && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-dark-950 
                        text-light-50 text-xs font-bold border-2 border-dark-950 uppercase tracking-wider">
            OUT OF STOCK
          </div>
        )}

        {/* Sale Badge (if applicable) */}
        {product.salePrice && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-street-red 
                        text-light-50 text-xs font-bold border-2 border-dark-950 uppercase tracking-wider">
            SALE
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-light-50/95 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                      flex items-center justify-center">
          <div className="flex flex-col space-y-3 px-4 w-full">
            {/* View Details Button (to select size) */}
            <Link
              to={`/product/${product.id}`}
              onClick={(e) => e.stopPropagation()}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 
                       bg-dark-950 text-light-50 font-bold uppercase tracking-wider text-sm
                       border-2 border-dark-950 hover:bg-street-red hover:border-street-red
                       transition-all duration-300"
              aria-label="View details and select size"
            >
              <FiShoppingCart size={18} />
              <span>Select Size</span>
            </Link>

            {/* Bottom Actions */}
            <div className="flex space-x-2">
              {/* Wishlist Button */}
              <button
                onClick={handleToggleWishlist}
                className={`flex-1 p-3 border-2 transition-all duration-300
                          ${isInWishlist 
                            ? 'bg-street-red border-street-red text-light-50' 
                            : 'bg-transparent border-dark-950 text-dark-950 hover:bg-dark-950 hover:text-light-50'
                          }`}
                aria-label="Add to wishlist"
              >
                <FiHeart 
                  size={18} 
                  fill={isInWishlist ? 'currentColor' : 'none'}
                  className="mx-auto"
                />
              </button>

              {/* Quick View Button */}
              <button
                className="flex-1 p-3 bg-transparent border-2 border-dark-950 text-dark-950
                         hover:bg-dark-950 hover:text-light-50 transition-all duration-300"
                aria-label="Quick view"
              >
                <FiEye size={18} className="mx-auto" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2 bg-light-50 flex flex-col min-h-[180px]">
        {/* Category */}
        {product.categoryName && (
          <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">
            {product.categoryName}
          </p>
        )}

        {/* Product Name */}
        <h3 className="text-dark-950 font-bold text-lg line-clamp-2 group-hover:text-street-red 
                     transition-colors duration-300 uppercase min-h-[56px]">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-gray-600 text-sm line-clamp-2 min-h-[40px]">
            {product.description}
          </p>
        )}

        {/* Spacer to push price to bottom */}
        <div className="flex-1"></div>

        {/* Price */}
        <div className="flex items-center space-x-3 pt-2">
          {product.salePrice ? (
            <>
              <span className="text-street-red font-black text-xl">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-gray-500 line-through text-sm font-bold">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-dark-950 font-black text-xl">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Stock Info */}
        {product.stock > 0 && product.stock < 10 && (
          <p className="text-street-red text-xs font-bold uppercase tracking-wider">
            Only {product.stock} left!
          </p>
        )}
      </div>

      {/* Decorative Bottom Line */}
      <div className="h-1 bg-dark-950 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </Link>
  );
};

export default ProductCard;


import { useState, useEffect } from 'react';
import { FiShoppingCart, FiHeart, FiMinus, FiPlus } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import useCartStore from '@store/use-cart-store';
import useWishlistStore from '@store/use-wishlist-store';

/**
 * AddToCartSection Component - Street Style
 * Section thêm vào cart với size, color, quantity selector
 * 
 * @param {Object} product - Product data
 */
const AddToCartSection = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  // Extract available variants
  const variants = product.variants || [];
  
  // Get unique sizes and colors
  const uniqueSizes = [...new Set(variants.map(v => v.size))];
  const uniqueColors = [...new Set(variants.map(v => v.color))].filter(c => c !== 'DEFAULT');

  // Reset selections when product changes
  useEffect(() => {
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
  }, [product.id]);

  // Helper to get stock for a specific combination
  const getStock = (size, color) => {
    if (!variants.length) return product.stock || 0;

    let filtered = variants;
    if (size) filtered = filtered.filter(v => v.size === size);
    if (color) filtered = filtered.filter(v => v.color === color);
    
    return filtered.reduce((sum, v) => sum + v.stock, 0);
  };

  // Helper to check if a combination is valid (exists and has stock)
  const isCombinationAvailable = (size, color) => {
    return getStock(size, color) > 0;
  };

  const handleColorSelect = (color) => {
    if (selectedColor === color) {
      setSelectedColor(''); // Deselect
      setSelectedSize(''); // Reset size when color is deselected
      return;
    }

    setSelectedColor(color);
    setSelectedSize(''); // Reset size when color changes
    setQuantity(1);
  };

  const handleSizeSelect = (size) => {
    if (selectedSize === size) {
      setSelectedSize(''); // Deselect
      return;
    }
    
    setSelectedSize(size);
    setQuantity(1);
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    const maxStock = getStock(selectedSize, selectedColor);
    
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    // Check total stock
    if (product.stock <= 0) {
      toast.error('OUT OF STOCK!');
      return;
    }

    // Validate Color First
    if (uniqueColors.length > 0 && !selectedColor) {
      toast.error('PLEASE SELECT A COLOR FIRST!');
      return;
    }

    // Validate Size
    if (uniqueSizes.length > 0 && !selectedSize) {
      toast.error('PLEASE SELECT A SIZE!');
      return;
    }

    // Find specific variant ID if possible
    const selectedVariant = variants.find(v => 
      (!selectedSize || v.size === selectedSize) && 
      (!selectedColor || v.color === selectedColor)
    );

    // Add to cart
    addToCart({ 
      ...product, 
      size: selectedSize, 
      color: selectedColor,
      variantId: selectedVariant?.id 
    }, quantity);
    
    toast.success(
      `ADDED ${quantity}x ${product.name.toUpperCase()} TO CART!`,
      {
        icon: '🛒',
        style: {
          background: '#000000',
          color: '#ffffff',
          border: '2px solid #000000',
          fontWeight: 'bold',
        },
      }
    );
  };

  const handleToggleWishlist = () => {
    const added = toggleWishlist(product);
    if (added) {
      toast.success('ADDED TO WISHLIST!', { icon: '❤️' });
    } else {
      toast.success('REMOVED FROM WISHLIST!', { icon: '💔' });
    }
  };

  const currentStock = getStock(selectedSize, selectedColor);

  return (
    <div className="space-y-6">
      {/* Color Selector (First) */}
      {uniqueColors.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-black uppercase tracking-wider">
            SELECT COLOR
          </label>
          <div className="flex flex-wrap gap-3">
            {uniqueColors.map((color) => {
              // Check if this color has ANY stock available (regardless of size)
              const available = isCombinationAvailable(null, color);

              return (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  disabled={!available}
                  className={`
                    px-4 py-2 border-2 font-bold uppercase text-sm transition-all
                    ${selectedColor === color
                      ? 'bg-dark-950 border-dark-950 text-light-50 scale-95'
                      : !available
                        ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed line-through'
                        : 'bg-transparent border-dark-950 text-dark-950 hover:bg-dark-950 hover:text-light-50'
                    }
                  `}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selector (Second - Dependent on Color) */}
      {uniqueSizes.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-black uppercase tracking-wider">
            SELECT SIZE
          </label>
          <div className="grid grid-cols-6 gap-2">
            {uniqueSizes.map((size) => {
              // Only check availability if color is selected
              const available = selectedColor 
                ? isCombinationAvailable(size, selectedColor)
                : false; // Disable if no color selected
              
              return (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  disabled={!selectedColor || !available}
                  className={`
                    relative py-3 border-2 font-bold uppercase text-sm transition-all overflow-hidden
                    ${selectedSize === size
                      ? 'bg-dark-950 border-dark-950 text-light-50 scale-95'
                      : (!selectedColor || !available)
                        ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                        : 'bg-transparent border-dark-950 text-dark-950 hover:bg-dark-950 hover:text-light-50'
                    }
                  `}
                  title={!selectedColor ? "Please select a color first" : ""}
                >
                  {size}
                  {/* Show strike-through only if color is selected but size is out of stock */}
                  {selectedColor && !available && (
                     <span className="absolute inset-0 flex items-center justify-center text-street-red text-3xl font-black pointer-events-none z-10" style={{ lineHeight: '1' }}>
                       ✕
                     </span>
                  )}
                </button>
              );
            })}
          </div>
          {!selectedColor && uniqueColors.length > 0 && (
            <p className="text-xs font-bold text-street-red uppercase tracking-wide animate-pulse">
              * PLEASE SELECT A COLOR FIRST
            </p>
          )}
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-black uppercase tracking-wider">
          QUANTITY
        </label>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="w-12 h-12 border-2 border-dark-950 bg-transparent text-dark-950
                     hover:bg-dark-950 hover:text-light-50 transition-all
                     disabled:opacity-30 disabled:cursor-not-allowed
                     flex items-center justify-center"
          >
            <FiMinus size={20} />
          </button>
          
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 1;
              if (val >= 1 && val <= currentStock) {
                setQuantity(val);
              }
            }}
            className="w-20 h-12 border-2 border-dark-950 text-center font-black text-lg
                     focus:outline-none focus:border-street-red"
            min="1"
            max={currentStock}
          />
          
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= currentStock}
            className="w-12 h-12 border-2 border-dark-950 bg-transparent text-dark-950
                     hover:bg-dark-950 hover:text-light-50 transition-all
                     disabled:opacity-30 disabled:cursor-not-allowed
                     flex items-center justify-center"
          >
            <FiPlus size={20} />
          </button>

          {/* Stock Info */}
          <span className="text-sm font-bold text-gray-600 uppercase tracking-wide ml-4">
            {currentStock} AVAILABLE
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="w-full flex items-center justify-center space-x-3 py-4 
                   bg-dark-950 border-2 border-dark-950 text-light-50 
                   font-black uppercase text-lg tracking-wider
                   hover:bg-street-red hover:border-street-red hover:scale-[1.02]
                   transition-all duration-300
                   disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <FiShoppingCart size={24} />
          <span>{product.stock <= 0 ? 'OUT OF STOCK' : 'ADD TO CART'}</span>
        </button>

        <button
          onClick={handleToggleWishlist}
          className={`
            w-full flex items-center justify-center space-x-3 py-4 
            border-2 font-black uppercase text-lg tracking-wider
            transition-all duration-300 hover:scale-[1.02]
            ${isInWishlist
              ? 'bg-street-red border-street-red text-light-50'
              : 'bg-transparent border-dark-950 text-dark-950 hover:bg-dark-950 hover:text-light-50'
            }
          `}
        >
          <FiHeart size={24} fill={isInWishlist ? 'currentColor' : 'none'} />
          <span>{isInWishlist ? 'IN WISHLIST' : 'ADD TO WISHLIST'}</span>
        </button>
      </div>

      {/* Additional Info */}
      <div className="pt-4 border-t-2 border-dark-950 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
          ✓ FREE SHIPPING ON ORDERS OVER $50
        </p>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
          ✓ 30-DAY RETURN POLICY
        </p>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
          ✓ SECURE CHECKOUT
        </p>
      </div>
    </div>
  );
};

export default AddToCartSection;

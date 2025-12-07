import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

/**
 * CartItem Component - Street Style
 * Item trong giỏ hàng
 * 
 * @param {Object} item - Cart item data
 * @param {Function} onUpdateQuantity - Update quantity callback
 * @param {Function} onRemove - Remove item callback
 * @param {Boolean} updating - Loading state
 */
const CartItem = ({ item, onUpdateQuantity, onRemove, updating = false }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isRemoving, setIsRemoving] = useState(false);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Handle quantity change
  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    // Check stock if available
    const stock = item.stock || item.product?.stock || 99;
    if (newQuantity > stock) {
      toast.error('EXCEEDS AVAILABLE STOCK!');
      return;
    }

    setQuantity(newQuantity);
    await onUpdateQuantity(item.id, newQuantity);
  };

  // Handle remove
  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemove(item.id);
  };

  // Support both flat structure (from store/sync) and nested structure (legacy/initial add)
  const product = item.product || item;
  const price = item.price || item.product?.price || 0;
  const name = item.name || item.product?.name || 'Product';
  const imageUrl = item.imageUrl || item.product?.imageUrl || '/placeholder-product.jpg';
  const categoryName = item.categoryName || item.product?.categoryName;
  const stock = item.stock || item.product?.stock;
  
  const subtotal = price * quantity;

  return (
    <div 
      className={`
        grid grid-cols-12 gap-4 p-6 border-2 border-dark-950 bg-light-50
        transition-all duration-300
        ${isRemoving ? 'opacity-50 scale-95' : 'hover:shadow-street'}
      `}
    >
      {/* Product Image */}
      <div className="col-span-12 sm:col-span-3 lg:col-span-2">
        <Link to={`/product/${item.id}`}>
          <div className="aspect-square border-2 border-dark-950 overflow-hidden group">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover filter-grayscale-80 
                       group-hover:filter-grayscale-0 group-hover:scale-110 
                       transition-all duration-500"
            />
          </div>
        </Link>
      </div>

      {/* Product Info */}
      <div className="col-span-12 sm:col-span-6 lg:col-span-5 space-y-2">
        <Link 
          to={`/product/${item.id}`}
          className="block"
        >
          <h3 className="text-lg font-bold uppercase hover:text-street-red transition-colors">
            {name}
          </h3>
        </Link>
        
        {categoryName && (
          <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
            {categoryName}
          </p>
        )}

        {/* Variant Info */}
        {(item.size || item.color) && (
          <div className="flex space-x-3 text-xs font-bold uppercase tracking-wide text-gray-500">
            {item.size && <span>SIZE: {item.size}</span>}
            {item.color && <span>COLOR: {item.color}</span>}
          </div>
        )}

        {/* Price per item */}
        <div className="flex items-baseline space-x-2">
          <span className="text-sm font-bold text-gray-600">PRICE:</span>
          <span className="text-lg font-black">
            {formatPrice(price)}
          </span>
        </div>

        {/* Stock warning */}
        {stock && stock < 5 && (
          <p className="text-xs font-bold uppercase tracking-wide text-street-red">
            ONLY {stock} LEFT IN STOCK!
          </p>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="col-span-12 sm:col-span-6 lg:col-span-2 flex flex-col justify-center space-y-2">
        <label className="text-xs font-black uppercase tracking-wider text-gray-600">
          QUANTITY
        </label>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1 || updating}
            className="w-10 h-10 border-2 border-dark-950 bg-transparent text-dark-950
                     hover:bg-dark-950 hover:text-light-50 transition-all
                     disabled:opacity-30 disabled:cursor-not-allowed
                     flex items-center justify-center"
            aria-label="Decrease quantity"
          >
            <FiMinus size={16} />
          </button>
          
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 1;
              handleQuantityChange(val);
            }}
            disabled={updating}
            className="w-16 h-10 border-2 border-dark-950 text-center font-black
                     focus:outline-none focus:border-street-red
                     disabled:opacity-50"
            min="1"
            max={stock || 99}
          />
          
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= (stock || 99) || updating}
            className="w-10 h-10 border-2 border-dark-950 bg-transparent text-dark-950
                     hover:bg-dark-950 hover:text-light-50 transition-all
                     disabled:opacity-30 disabled:cursor-not-allowed
                     flex items-center justify-center"
            aria-label="Increase quantity"
          >
            <FiPlus size={16} />
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="col-span-12 sm:col-span-6 lg:col-span-2 flex flex-col justify-center">
        <label className="text-xs font-black uppercase tracking-wider text-gray-600 mb-2">
          SUBTOTAL
        </label>
        <div className="text-2xl font-black">
          {formatPrice(subtotal)}
        </div>
      </div>

      {/* Remove Button */}
      <div className="col-span-12 sm:col-span-6 lg:col-span-1 flex items-center justify-center">
        <button
          onClick={handleRemove}
          disabled={isRemoving || updating}
          className="p-3 text-gray-600 hover:text-street-red hover:bg-light-200
                   transition-all border-2 border-transparent hover:border-street-red
                   disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Remove item"
        >
          {isRemoving ? <FiX size={20} className="animate-spin" /> : <FiTrash2 size={20} />}
        </button>
      </div>
    </div>
  );
};

export default CartItem;


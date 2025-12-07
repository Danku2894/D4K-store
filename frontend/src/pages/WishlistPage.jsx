import { Link } from 'react-router-dom';
import { FiHeart, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import useWishlistStore from '@store/use-wishlist-store';
import useCartStore from '@store/use-cart-store';
import Breadcrumb from '@components/common/Breadcrumb';

const WishlistPage = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addToCart);

  const handleMoveToCart = (product) => {
    // Default to first variant if available, or just add product
    // This logic might need refinement based on how addToCart handles products without explicit variant selection
    // For now, we'll redirect to product page if variants are needed, or add directly if simple
    // But safer to just link to product page for selection
    window.location.href = `/product/${product.id}`;
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Wishlist', path: '/wishlist' },
  ];

  return (
    <div className="min-h-screen bg-light-50">
      <div className="container-street py-6">
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Header */}
        <div className="py-8 border-b-4 border-dark-950 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FiHeart size={48} className="text-street-red" />
              <div>
                <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight glitch-street">
                  MY WISHLIST
                </h1>
                <p className="text-gray-600 font-bold uppercase tracking-wide mt-2">
                  {items.length} ITEMS SAVED
                </p>
              </div>
            </div>
            
            {items.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Clear all items from wishlist?')) {
                    clearWishlist();
                    toast.success('WISHLIST CLEARED');
                  }
                }}
                className="hidden md:flex items-center gap-2 text-gray-500 hover:text-street-red font-bold uppercase transition-colors"
              >
                <FiTrash2 /> Clear All
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((product) => (
              <div key={product.id} className="group border-2 border-dark-950 bg-white hover:shadow-street transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden border-b-2 border-dark-950">
                  <img
                    src={product.imageUrl || product.images?.[0] || product.image || 'https://placehold.co/400x600?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => {
                      removeFromWishlist(product.id);
                      toast.success('REMOVED FROM WISHLIST');
                    }}
                    className="absolute top-2 right-2 w-10 h-10 bg-white border-2 border-dark-950 flex items-center justify-center text-street-red hover:bg-street-red hover:text-white transition-colors z-10"
                    title="Remove"
                  >
                    <FiTrash2 size={20} />
                  </button>

                  {/* Sale Tag */}
                  {product.salePrice && (
                    <div className="absolute top-2 left-2 bg-street-red text-white text-xs font-black px-2 py-1 border-2 border-dark-950">
                      SALE
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-bold text-lg uppercase line-clamp-1 hover:text-street-red transition-colors mb-1">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center gap-2 mb-4">
                    {product.salePrice ? (
                      <>
                        <span className="font-black text-xl text-street-red">
                          {product.salePrice.toLocaleString('vi-VN')}đ
                        </span>
                        <span className="text-sm text-gray-400 line-through font-bold">
                          {product.price.toLocaleString('vi-VN')}đ
                        </span>
                      </>
                    ) : (
                      <span className="font-black text-xl text-dark-950">
                        {product.price?.toLocaleString('vi-VN')}đ
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="w-full py-3 bg-dark-950 text-white font-black uppercase hover:bg-street-blue transition-colors flex items-center justify-center gap-2"
                  >
                    <FiShoppingCart /> View Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-4 border-gray-200 bg-white">
            <FiHeart size={64} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-black uppercase text-gray-400 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 font-medium mb-8">Save items you love to buy later!</p>
            <Link to="/products" className="btn-street inline-block">
              START SHOPPING
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;

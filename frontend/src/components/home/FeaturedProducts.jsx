import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '@components/product/ProductCard';
import productService from '@services/product-service';
import { toast } from 'react-hot-toast';

/**
 * FeaturedProducts Component
 * Hiển thị sản phẩm nổi bật
 */
const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Gọi API lấy featured products
      const response = await productService.getFeaturedProducts(0, 8);
      
      if (response.success && response.data) {
        setProducts(response.data.content || []);
      } else {
        throw new Error('Không thể tải sản phẩm nổi bật');
      }
    } catch (err) {
      console.error('Error fetching featured products:', err);
      setError(err.message || 'Có lỗi xảy ra');
      toast.error('Không thể tải sản phẩm nổi bật');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16">
      <div className="container-street">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-dark-950 glitch-street">
            Featured Products
          </h2>
          <p className="text-gray-600 text-lg font-medium max-w-2xl mx-auto">
            Check out our handpicked selection of trending items
          </p>
          
          {/* Decorative Line */}
          <div className="flex items-center justify-center space-x-2 pt-4">
            <div className="w-16 h-1 bg-dark-950"></div>
            <div className="w-2 h-2 bg-street-red"></div>
            <div className="w-16 h-1 bg-dark-950"></div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="product-card-y2k animate-pulse">
                <div className="aspect-[3/4] bg-dark-800 rounded-t-2xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-dark-800 rounded w-1/3"></div>
                  <div className="h-6 bg-dark-800 rounded w-3/4"></div>
                  <div className="h-4 bg-dark-800 rounded w-full"></div>
                  <div className="h-8 bg-dark-800 rounded w-1/2"></div>
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
                onClick={fetchFeaturedProducts}
                className="btn-street"
              >
                TRY AGAIN
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
              <Link
                to="/products?featured=true"
                className="btn-street inline-block"
              >
                VIEW ALL FEATURED
              </Link>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block p-6 border-2 border-dark-950">
              <p className="text-gray-600 font-bold uppercase tracking-wide mb-4">
                NO FEATURED PRODUCTS
              </p>
              <Link to="/products" className="btn-street">
                VIEW ALL PRODUCTS
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;


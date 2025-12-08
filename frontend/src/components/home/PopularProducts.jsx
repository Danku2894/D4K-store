import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import ProductCard from '@components/product/ProductCard';
import recommendationService from '@services/recommendation-service';

/**
 * PopularProducts Component - Street Style
 * Hiển thị sản phẩm phổ biến (được mua nhiều nhất)
 */
const PopularProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularProducts();
  }, []);

  const fetchPopularProducts = async () => {
    try {
      setLoading(true);
      const response = await recommendationService.getPopularProducts(8);
      
      if (response.success && response.data) {
        setProducts(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching popular products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if no products
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-light-50">
      <div className="container-street py-16 md:py-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-2 block">
              BEST SELLERS
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight flex items-center gap-4">
              <FiTrendingUp className="text-street-red" />
              SẢN PHẨM PHỔ BIẾN
            </h2>
          </div>
          <Link 
            to="/products" 
            className="inline-flex items-center space-x-2 text-sm font-black uppercase tracking-wider 
                     text-dark-950 hover:text-street-red transition-colors group"
          >
            <span>VIEW ALL</span> 
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 border-2 border-gray-300 mb-4"></div>
                <div className="h-4 bg-gray-200 mb-2 w-2/3"></div>
                <div className="h-3 bg-gray-200 mb-3 w-full"></div>
                <div className="h-5 bg-gray-200 w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularProducts;

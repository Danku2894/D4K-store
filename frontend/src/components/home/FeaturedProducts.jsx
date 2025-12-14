import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '@/hooks/useGSAP';
import ProductCard from '@components/product/ProductCard';
import productService from '@services/product-service';
import { toast } from 'react-hot-toast';

/**
 * FeaturedProducts Component - Simple Grid Layout
 * Scroll-triggered animations
 */
const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  useLayoutEffect(() => {
    if (loading || products.length === 0) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Title clip-path reveal
      gsap.fromTo(
        titleRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards stagger animation
      const cards = cardRefs.current.filter(Boolean);
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 80,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, products]);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
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
    <section ref={sectionRef} className="py-20 md:py-28 bg-dark-950">
      <div className="container-street">
        {/* Section Header */}
        <div ref={headerRef} className="mb-12 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-street-red font-black text-sm uppercase tracking-[0.3em] mb-4 block">
                ★ Trending Now
              </span>
              <h2
                ref={titleRef}
                className="text-5xl md:text-6xl lg:text-7xl font-display font-black uppercase 
                         tracking-tight text-light-50 leading-[0.9]"
              >
                Featured<br />
                <span className="text-street-red">Products</span>
              </h2>
            </div>
            
            <Link
              to="/products?featured=true"
              className="group inline-flex items-center gap-3 text-light-50 font-bold uppercase 
                       tracking-wide hover:text-street-red transition-colors self-start md:self-auto"
            >
              <span>View All</span>
              <span className="w-10 h-10 border-2 border-current flex items-center justify-center
                             group-hover:bg-street-red group-hover:border-street-red 
                             transition-all duration-300">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-dark-800 animate-pulse">
                <div className="aspect-[3/4] bg-dark-700" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-dark-700 w-1/3" />
                  <div className="h-6 bg-dark-700 w-3/4" />
                  <div className="h-8 bg-dark-700 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16">
            <div className="inline-block p-8 border-4 border-street-red">
              <p className="text-street-red font-bold uppercase mb-4">{error}</p>
              <button onClick={fetchFeaturedProducts} className="btn-street">
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div
            ref={gridRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                ref={(el) => (cardRefs.current[index] = el)}
                className="transition-transform duration-300 hover:scale-[1.02] hover:z-10"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-block p-8 border-2 border-light-50/30">
              <p className="text-light-50/60 font-bold uppercase mb-4">No Featured Products</p>
              <Link to="/products" className="btn-street">
                View All Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;

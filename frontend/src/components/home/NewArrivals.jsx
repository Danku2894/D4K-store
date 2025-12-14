import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '@/hooks/useGSAP';
import ProductCard from '@components/product/ProductCard';
import productService from '@services/product-service';
import { toast } from 'react-hot-toast';

/**
 * NewArrivals Component - GSAP 3D Perspective Reveal
 * Scroll-triggered animations với perspective card reveals
 */
const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const badgeRef = useRef(null);
  const gridRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  useLayoutEffect(() => {
    if (loading || products.length === 0) return;

    const ctx = gsap.context(() => {
      // Badge animation
      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, scale: 0.5, rotation: -180 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Title reveal with split text effect
      const title = titleRef.current;
      const words = title.textContent.split(' ');
      title.innerHTML = words
        .map((word) => `<span class="inline-block overflow-hidden"><span class="inline-block">${word}</span></span>`)
        .join(' ');

      const innerSpans = title.querySelectorAll('span > span');
      gsap.fromTo(
        innerSpans,
        { y: '100%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards 3D perspective reveal
      const cards = cardRefs.current.filter(Boolean);
      if (cards.length > 0) {
        // Set initial state
        gsap.set(cards, {
          opacity: 0,
          rotateY: -45,
          rotateX: 15,
          z: -200,
          transformPerspective: 1000,
        });

        // Animate cards with stagger from center
        ScrollTrigger.create({
          trigger: gridRef.current,
          start: 'top 70%',
          onEnter: () => {
            gsap.to(cards, {
              opacity: 1,
              rotateY: 0,
              rotateX: 0,
              z: 0,
              duration: 1,
              stagger: {
                amount: 0.6,
                from: 'center',
                grid: 'auto',
              },
              ease: 'power3.out',
            });
          },
          onLeaveBack: () => {
            gsap.to(cards, {
              opacity: 0,
              rotateY: -45,
              rotateX: 15,
              z: -200,
              duration: 0.5,
              stagger: {
                amount: 0.3,
                from: 'center',
                grid: 'auto',
              },
            });
          },
        });

        // Parallax on each card while scrolling
        cards.forEach((card, i) => {
          gsap.to(card, {
            y: (i % 2 === 0 ? -30 : 30),
            ease: 'none',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          });
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, [loading, products]);

  const fetchNewArrivals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getNewArrivals(0, 8);
      if (response.success && response.data) {
        setProducts(response.data.content || []);
      } else {
        throw new Error('Không thể tải sản phẩm mới');
      }
    } catch (err) {
      console.error('Error fetching new arrivals:', err);
      setError(err.message || 'Có lỗi xảy ra');
      toast.error('Không thể tải sản phẩm mới');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={sectionRef} className="py-24 bg-light-100 overflow-hidden">
      <div className="container-street">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16 space-y-6">
          {/* Badge */}
          <div
            ref={badgeRef}
            className="inline-block px-6 py-3 bg-dark-950 text-light-50 
                     font-black text-sm uppercase tracking-widest
                     shadow-[4px_4px_0px_0px_rgba(255,0,0,1)]"
          >
            ⚡ Just Dropped
          </div>

          {/* Title */}
          <h2
            ref={titleRef}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-black uppercase 
                     tracking-tight text-dark-950 leading-none"
          >
            New Arrivals
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-lg font-medium max-w-2xl mx-auto">
            Fresh styles just landed. Be the first to rock these new pieces!
          </p>

          {/* Decorative Line */}
          <div className="flex items-center justify-center space-x-3 pt-2">
            <div className="w-3 h-3 bg-street-red rotate-45" />
            <div className="w-20 h-1 bg-dark-950" />
            <div className="w-2 h-2 bg-dark-950" />
            <div className="w-20 h-1 bg-dark-950" />
            <div className="w-3 h-3 bg-street-red rotate-45" />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-light-50 border-2 border-dark-950 animate-pulse">
                <div className="aspect-[3/4] bg-light-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-light-200 w-1/3" />
                  <div className="h-6 bg-light-200 w-3/4" />
                  <div className="h-8 bg-light-200 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="inline-block p-8 border-4 border-street-red bg-light-50">
              <p className="text-street-red font-bold uppercase mb-4">{error}</p>
              <button onClick={fetchNewArrivals} className="btn-street">
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <>
            <div
              ref={gridRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              style={{ perspective: '2000px' }}
            >
              {products.map((product, index) => (
                <div
                  key={product.id}
                  ref={(el) => (cardRefs.current[index] = el)}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-16">
              <Link
                to="/products?sort=createdAt,desc"
                className="group inline-flex items-center gap-4 px-10 py-4 bg-dark-950 text-light-50 
                         font-black uppercase tracking-wider
                         hover:bg-street-red transition-all duration-300
                         shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]
                         hover:shadow-[8px_8px_0px_0px_rgba(255,0,0,0.4)]
                         hover:scale-105"
              >
                <span>Explore All New Arrivals</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </Link>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block p-8 border-2 border-dark-950 bg-light-50">
              <p className="text-gray-600 font-bold uppercase tracking-wide mb-4">
                No New Arrivals
              </p>
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

export default NewArrivals;

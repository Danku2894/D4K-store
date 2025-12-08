import { useEffect } from 'react';
import HeroBanner from '@components/home/HeroBanner';
import CategoriesSection from '@components/home/CategoriesSection';
import FeaturedProducts from '@components/home/FeaturedProducts';
import PopularProducts from '@components/home/PopularProducts';
import NewArrivals from '@components/home/NewArrivals';

/**
 * HomePage Component
 * Trang chủ với banner, categories, featured products, new arrivals
 */
const HomePage = () => {
  useEffect(() => {
    // Set page title
    document.title = 'D4K Store - Y2K Fashion';
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Banner / Slider */}
      <HeroBanner />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Popular Products - Recommendation */}
      <PopularProducts />

      {/* Promo Banner */}
      <section className="w-full">
        <div className="relative overflow-hidden bg-street-red py-20 md:py-32 text-center">
          {/* Noise Overlay */}
          <div className="absolute inset-0 bg-noise opacity-10"></div>
          
          {/* Content */}
          <div className="relative z-10 container-street space-y-8">
            <h2 className="text-5xl md:text-8xl font-display font-black text-light-50 uppercase tracking-tighter glitch-street">
              SUMMER SALE 2025
            </h2>
            <p className="text-2xl md:text-4xl text-light-50 font-bold max-w-4xl mx-auto uppercase tracking-wide">
              Get up to <span className="text-dark-950 bg-light-50 px-4 transform -skew-x-12 inline-block">50% OFF</span> on selected items
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-8">
              <a
                href="/products?sale=true"
                className="px-10 py-5 bg-dark-950 text-light-50 
                         font-black uppercase tracking-widest text-xl
                         hover:bg-light-50 hover:text-dark-950 transition-all 
                         hover:scale-105 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]"
              >
                SHOP SALE NOW
              </a>
              <a
                href="/products"
                className="px-10 py-5 bg-transparent border-4 border-dark-950 text-dark-950 
                         font-black uppercase tracking-widest text-xl
                         hover:bg-dark-950 hover:text-light-50 transition-all 
                         hover:scale-105"
              >
                BROWSE ALL
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <NewArrivals />
    </div>
  );
};

export default HomePage;


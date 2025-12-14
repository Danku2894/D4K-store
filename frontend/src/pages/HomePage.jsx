import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/hooks/useGSAP';
import HeroBanner from '@components/home/HeroBanner';
import CategoriesSection from '@components/home/CategoriesSection';
import FeaturedProducts from '@components/home/FeaturedProducts';
import PromoBannerGSAP from '@components/home/PromoBannerGSAP';
import NewArrivals from '@components/home/NewArrivals';

/**
 * HomePage Component - GSAP Enhanced
 * Trang chủ với smooth scrolling và scroll-triggered animations
 */
const HomePage = () => {
  const mainRef = useRef(null);

  useEffect(() => {
    // Set page title
    document.title = 'D4K Store | Street Culture';
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, []);

  useLayoutEffect(() => {
    // Refresh ScrollTrigger after all components mount
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    // Handle resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen">
      {/* Hero Banner - Full height with parallax */}
      <HeroBanner />

      {/* Categories Section - Scroll-triggered stagger */}
      <CategoriesSection />

      {/* Featured Products - Horizontal scroll gallery */}
      <FeaturedProducts />

      {/* Promo Banner - Full-screen takeover effect */}
      <PromoBannerGSAP />

      {/* New Arrivals - 3D perspective reveal */}
      <NewArrivals />

      {/* Footer spacer for ScrollTrigger */}
      <div className="h-1" />
    </div>
  );
};

export default HomePage;

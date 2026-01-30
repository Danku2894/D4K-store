import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/hooks/useGSAP';
import SEOHelmet from '@components/common/SEOHelmet';
import WebPageSchema from '@components/seo/WebPageSchema';
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
    <>
      <SEOHelmet 
        title="D4K Store - Thời trang Streetwear, Y2K Fashion chính hãng Việt Nam"
        description="D4K Store - Shop thời trang streetwear, Y2K style chính hãng tại Việt Nam. Áo hoodie, áo thun, quần baggy, phụ kiện street culture. Giao hàng toàn quốc, giá tốt nhất. Free ship đơn từ 500k."
        keywords="streetwear vietnam, y2k fashion vietnam, áo hoodie streetwear, áo thun oversized, quần baggy, thời trang đường phố, d4k store, street culture, urban fashion, mua áo hoodie, shop streetwear hà nội, shop streetwear sài gòn"
        image="/logo.png"
        url="/"
        type="website"
      />
      
      <WebPageSchema 
        name="D4K Store - Thời trang Streetwear, Y2K Fashion chính hãng Việt Nam"
        description="D4K Store - Shop thời trang streetwear, Y2K style chính hãng tại Việt Nam. Áo hoodie, áo thun, quần baggy, phụ kiện street culture."
        url="/"
      />
      
      <div ref={mainRef} className="min-h-screen">
        <h1 className="sr-only">D4K Store - Thời trang Streetwear &amp; Y2K Fashion chính hãng Việt Nam</h1>
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
    </>
  );
};

export default HomePage;

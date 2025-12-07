import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import hero1 from '../../assets/images/hero1.jpg';
import hero2 from '../../assets/images/hero2.jpg';

/**
 * HeroBanner Component - Y2K Style
 * Slider banner chính ở trang chủ
 */
const HeroBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Banner slides data
  const banners = [
    {
      id: 1,
      title: 'STREET CULTURE',
      subtitle: 'Dream 4 Keep',
      description: 'Authentic streetwear for the bold',
      image: '/banners/street-collection.jpg', // Fallback/Background pattern
      heroImage: hero1, // Specific hero image
      imageScale: 1.2, // Zoom in
      imageTranslateY: '3%', // Move down to show heads
      bgColor: 'bg-dark-950',
      textColor: 'text-light-50',
      ctaText: 'SHOP NOW',
      ctaLink: '/products',
    },
    {
      id: 2,
      title: 'NEW DROP',
      subtitle: 'FRESH ARRIVALS',
      description: 'Latest styles just landed',
      image: '/banners/new-drop.jpg',
      heroImage: hero2, // Specific hero image
      enableBlending: false, // Disable blending for this banner
      imageScale: 1.4, // Zoom in
      imageTranslateY: '10%', // Move down to show heads
      bgColor: 'bg-light-50',
      textColor: 'text-dark-950',
      ctaText: 'EXPLORE',
      ctaLink: '/products?sort=createdAt,desc',
    },
    {
      id: 3,
      title: 'SALE',
      subtitle: 'UP TO 50% OFF',
      description: 'Limited time on selected items',
      image: '/banners/sale.jpg',
      bgColor: 'bg-street-red',
      textColor: 'text-light-50',
      ctaText: 'GET DEALS',
      ctaLink: '/products?sale=true',
    },
  ];

  // Color map for gradients
  const bannerColors = {
    'bg-dark-950': '#000000',
    'bg-light-50': '#ffffff',
    'bg-street-red': '#FF0000'
  };

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-gray-400',
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-dark-950',
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="hero-swiper"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={banner.id}>
            <div className="relative h-[500px] md:h-[600px] overflow-hidden">
              {/* Background Color */}
              <div className={`absolute inset-0 ${banner.bgColor} grid-lines`} />

              {/* Specific Hero Image (Right Side with Blend) */}
              {banner.heroImage && (
                <div className="absolute inset-0 flex justify-end">
                  <div className="relative w-full md:w-[75%] h-full">
                    <img 
                      src={banner.heroImage} 
                      alt={banner.title} 
                      className="w-full h-full object-contain object-right-bottom"
                      style={{
                        ...(banner.enableBlending !== false ? {
                          maskImage: 'linear-gradient(to right, transparent 0%, black 59%)',
                          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 59%)'
                        } : {}),
                        ...(banner.imageScale || banner.imageTranslateY ? { 
                          transform: `scale(${banner.imageScale || 1}) translateY(${banner.imageTranslateY || '0'})`,
                          transformOrigin: 'bottom right'
                        } : {})
                      }}
                    />
                    
                    {/* Strong Overlay Gradient - Adjusted to not cover text */}
                    {banner.enableBlending !== false && (
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `linear-gradient(to right, ${bannerColors[banner.bgColor] || '#000000'} 15%, ${bannerColors[banner.bgColor] || '#000000'} 50%, transparent 100%)`
                        }}
                      ></div>
                    )}

                    {/* Inner Shadow for extra blending depth */}
                    {banner.enableBlending !== false && (
                      <div className="absolute inset-0 pointer-events-none shadow-[inset_50px_0_50px_-20px_rgba(0,0,0,1)]"></div>
                    )}
                    
                    {/* Bottom fade for mobile */}
                    {banner.enableBlending !== false && (
                      <div className={`md:hidden absolute inset-0 bg-gradient-to-t ${banner.bgColor.replace('bg-', 'from-')} via-transparent to-transparent`}></div>
                    )}
                  </div>
                </div>
              )}

              {/* Background Pattern (if no hero image or for texture) */}
              {!banner.heroImage && (
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20 filter-grayscale-80"
                  style={{ 
                    backgroundImage: `url(${banner.image})`,
                  }}
                />
              )}

              {/* Noise Overlay */}
              <div className="absolute inset-0 bg-noise opacity-5"></div>

              {/* Content */}
              <div className={`relative h-full container-street flex items-center ${banner.textColor}`}>
                <div className="max-w-3xl space-y-6 animate-slide-up z-30 relative">
                  {/* Subtitle */}
                  <p className="text-sm md:text-base font-black uppercase tracking-[0.3em] opacity-70">
                    {banner.subtitle}
                  </p>

                  {/* Title */}
                  <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black 
                               leading-none uppercase tracking-tight glitch-street">
                    {banner.title}
                  </h1>

                  {/* Description */}
                  <p className="text-lg md:text-xl max-w-lg font-medium">
                    {banner.description}
                  </p>

                  {/* CTA Button */}
                  <div className="pt-6">
                    <Link
                      to={banner.ctaLink}
                      className="btn-street inline-block text-base"
                    >
                      {banner.ctaText}
                    </Link>
                  </div>

                  {/* Decorative Line */}
                  <div className="flex items-center space-x-2 pt-4">
                    <div className="w-20 h-1 bg-current"></div>
                    <div className="w-2 h-2 bg-current"></div>
                    <div className="w-10 h-1 bg-current"></div>
                  </div>
                </div>
              </div>

              {/* Geometric Accent */}
              {index === 0 && (
                <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-light-50 opacity-20"></div>
              )}
              {index === 1 && (
                <div className="absolute top-10 right-10 w-24 h-24 bg-dark-950 opacity-10"></div>
              )}
              {index === 2 && (
                <div className="absolute top-20 right-20 text-9xl font-black opacity-10">
                  %
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Styling for Swiper Pagination */}
      <style jsx global>{`
        .hero-swiper .swiper-pagination {
          bottom: 30px !important;
        }
        .hero-swiper .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          border-radius: 0;
          transition: all 0.3s;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          width: 30px;
          border-radius: 0;
        }
      `}</style>
    </div>
  );
};

export default HeroBanner;


import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '@/hooks/useGSAP';
import categoryService from '@services/category-service';
import { toast } from 'react-hot-toast';

/**
 * CategoriesSection Component - GSAP Version
 * Premium magazine-style design với category images từ API
 */
const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const cardRefs = useRef([]);

  // Fallback image if category has no image
  const fallbackImage = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=500&fit=crop';

  useEffect(() => {
    fetchCategories();
  }, []);

  useLayoutEffect(() => {
    if (loading || categories.length === 0) return;

    const ctx = gsap.context(() => {
      // Header fade in
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Title reveal with clip-path
      gsap.fromTo(
        titleRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.2,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards stagger animation with 3D effect
      const cards = cardRefs.current.filter(Boolean);
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 120,
            rotateY: -25,
            scale: 0.85,
          },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, categories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories();
      if (response.success && response.data) {
        setCategories(response.data.slice(0, 3));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast.error('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  // Get category image from API data, fallback if not available
  const getCategoryImage = (category) => {
    if (category.imageUrl) {
      return category.imageUrl;
    }
    return fallbackImage;
  };

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-light-50 overflow-hidden">
      <div className="container-street">
        {/* Section Header */}
        <div ref={headerRef} className="mb-16 md:mb-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-street-red font-black text-sm uppercase tracking-[0.3em] mb-4 block">
                Collections
              </span>
              <h2
                ref={titleRef}
                className="text-5xl md:text-6xl lg:text-7xl font-display font-black uppercase 
                         tracking-tight text-dark-950 leading-[0.9]"
              >
                Shop by<br />
                <span className="text-street-red">Category</span>
              </h2>
            </div>
            
            <Link
              to="/categories"
              className="group inline-flex items-center gap-3 text-dark-950 font-bold uppercase 
                       tracking-wide hover:text-street-red transition-colors self-start md:self-auto"
            >
              <span>View All</span>
              <span className="w-10 h-10 border-2 border-current flex items-center justify-center
                             group-hover:bg-street-red group-hover:border-street-red group-hover:text-light-50
                             transition-all duration-300">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="aspect-[4/5] bg-light-200 animate-pulse" />
            ))}
          </div>
        )}

        {/* Categories Grid - Consistent Layout */}
        {!loading && categories.length > 0 && (
          <div
            ref={cardsContainerRef}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
            style={{ perspective: '1200px' }}
          >
            {categories.map((category, index) => {
              return (
                <Link
                  key={category.id}
                  ref={(el) => (cardRefs.current[index] = el)}
                  to={`/products?category=${category.id}`}
                  className="group relative overflow-hidden bg-dark-950 aspect-[4/5]
                           transition-all duration-500 hover:z-10 hover:scale-[1.02]"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Category Image from API */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={getCategoryImage(category)}
                      alt={category.name}
                      className="w-full h-full object-cover transition-all duration-700
                               group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                      onError={(e) => {
                        e.target.src = fallbackImage;
                      }}
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent 
                                  opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                    {/* Category number */}
                    <span className="absolute top-4 right-4 text-light-50/20 font-display font-black 
                                   text-6xl md:text-8xl leading-none
                                   group-hover:text-street-red/30 transition-colors duration-500">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    {/* Category name */}
                    <div className="relative">
                      <h3 className="text-light-50 font-display font-black text-2xl md:text-3xl lg:text-4xl 
                                   uppercase tracking-tight leading-tight mb-3
                                   transform group-hover:translate-x-2 transition-transform duration-300">
                        {category.name}
                      </h3>
                      
                      {/* Description if available */}
                      {category.description && (
                        <p className="text-light-50/60 text-sm line-clamp-2 max-w-[200px] mb-4
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {category.description}
                        </p>
                      )}

                      {/* Arrow indicator */}
                      <div className="flex items-center gap-2 text-light-50
                                    opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0
                                    transition-all duration-300">
                        <div className="w-8 h-[2px] bg-street-red" />
                        <span className="font-bold text-sm uppercase tracking-wider">Explore</span>
                      </div>
                    </div>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-0 left-0 w-0 h-0 border-l-[50px] border-l-street-red 
                                border-b-[50px] border-b-transparent
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && categories.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-block p-8 border-2 border-dark-950">
              <p className="text-gray-600 font-bold uppercase tracking-wide">No categories available</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;

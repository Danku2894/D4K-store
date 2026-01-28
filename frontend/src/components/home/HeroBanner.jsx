import { useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '@/hooks/useGSAP';

import hero1 from '../../assets/images/hero1.jpg';


/**
 * HeroBanner Component - GSAP Parallax Version
 * Full-height hero với parallax layers và scroll-triggered animations
 */
const HeroBanner = () => {
  const containerRef = useRef(null);
  const bgLayerRef = useRef(null);
  const midLayerRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state - hide elements
      gsap.set([titleRef.current, subtitleRef.current, descRef.current, ctaRef.current], {
        opacity: 0,
        y: 100,
      });

      // Entrance animation timeline
      const entranceTl = gsap.timeline({ delay: 0.3 });
      
      entranceTl
        .to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power4.out',
        })
        .to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power4.out',
        }, '-=0.5')
        .to(descRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power4.out',
        }, '-=0.6')
        .to(ctaRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
        }, '-=0.4');

      // Parallax scroll animation
      const parallaxTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      parallaxTl
        .to(bgLayerRef.current, {
          y: '-30%',
          scale: 1.1,
          ease: 'none',
        }, 0)
        .to(midLayerRef.current, {
          y: '-15%',
          ease: 'none',
        }, 0)
        .to(contentRef.current, {
          y: '20%',
          opacity: 0.3,
          ease: 'none',
        }, 0);

      // Scroll indicator bounce animation
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[600px] overflow-hidden bg-dark-950"
    >
      {/* Background Layer - Slowest parallax */}
      <div
        ref={bgLayerRef}
        className="absolute inset-0 w-full h-[130%] -top-[15%]"
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950/80 via-dark-950/40 to-dark-950 z-10" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-lines opacity-20 z-20" />
        
        {/* Hero image */}
        <img
          src={hero1}
          alt="Street Culture"
          className="w-full h-full object-cover opacity-60"
          style={{ objectPosition: 'center 25%' }}
        />
      </div>

      {/* Middle Layer - Medium parallax */}
      <div
        ref={midLayerRef}
        className="absolute inset-0 flex items-end justify-end pointer-events-none z-20"
      >
        {/* Decorative geometric shapes */}
        <div className="absolute top-1/4 right-10 w-40 h-40 border-4 border-light-50/10 rotate-12" />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-street-red/20" />
        <div className="absolute bottom-1/4 right-20 w-32 h-32 border-2 border-street-red/30 -rotate-6" />
      </div>

      {/* Content Layer */}
      <div
        ref={contentRef}
        className="relative z-30 h-full container-street flex flex-col justify-center"
      >
        <div className="max-w-4xl space-y-6">
          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-sm md:text-base font-black uppercase tracking-[0.4em] text-light-50/70"
          >
            Dream 4 Keep
          </p>

          {/* Main Title */}
          <h2
            ref={titleRef}
            className="text-6xl md:text-8xl lg:text-[10rem] font-display font-black 
                       leading-[0.85] uppercase tracking-tight text-light-50"
          >
            <span className="block">Street</span>
            <span className="block text-street-red">Culture</span>
          </h2>

          {/* Description */}
          <p
            ref={descRef}
            className="text-lg md:text-xl max-w-lg font-medium text-light-50/80"
          >
            Authentic streetwear for the bold. Express yourself with our curated collection of urban fashion.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-wrap gap-4 pt-6">
            <Link
              to="/products"
              className="group relative px-10 py-4 bg-light-50 text-dark-950 font-black uppercase 
                         tracking-wider overflow-hidden transition-all duration-300
                         hover:scale-105 hover:shadow-[8px_8px_0px_0px_rgba(255,0,0,1)]"
            >
              <span className="relative z-10">Shop Now</span>
              <div className="absolute inset-0 bg-street-red transform scale-x-0 origin-left 
                            transition-transform duration-300 group-hover:scale-x-100" />
              <span className="absolute inset-0 flex items-center justify-center text-light-50 font-black 
                             uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity 
                             duration-300 delay-100 z-20">
                Shop Now
              </span>
            </Link>
            
            <Link
              to="/categories"
              className="px-10 py-4 border-2 border-light-50 text-light-50 font-black uppercase 
                         tracking-wider transition-all duration-300
                         hover:bg-light-50 hover:text-dark-950 hover:scale-105"
            >
              Explore
            </Link>
          </div>

          {/* Decorative line */}
          <div className="flex items-center space-x-3 pt-8">
            <div className="w-16 h-1 bg-light-50" />
            <div className="w-3 h-3 bg-street-red" />
            <div className="w-8 h-1 bg-light-50/50" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-light-50/60"
      >
        <span className="text-xs font-bold uppercase tracking-widest">Scroll</span>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>

      {/* Noise overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none z-40" />
    </section>
  );
};

export default HeroBanner;

import { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '@/hooks/useGSAP';

/**
 * PromoBannerGSAP Component
 * Full-screen takeover effect với text animations và parallax
 */
const PromoBannerGSAP = () => {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const discountRef = useRef(null);
  const ctaRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Background scale effect
      gsap.fromTo(
        bgRef.current,
        { scale: 1.2 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );

      // Content reveal timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      });

      // Subtitle slide in
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, x: -100, skewX: -10 },
        { opacity: 1, x: 0, skewX: 0, duration: 0.6, ease: 'power3.out' }
      );

      // Title split animation - character by character
      const title = titleRef.current;
      const chars = title.textContent.split('');
      title.textContent = '';
      chars.forEach((char) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(100%) rotateX(-90deg)';
        title.appendChild(span);
      });

      tl.to(
        title.querySelectorAll('span'),
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.03,
          ease: 'back.out(1.7)',
        },
        '-=0.3'
      );

      // Discount counter animation
      tl.fromTo(
        discountRef.current,
        { opacity: 0, scale: 0.5, rotation: -10 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)',
        },
        '-=0.6'
      );

      // CTA buttons
      tl.fromTo(
        ctaRef.current.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
        },
        '-=0.4'
      );

      // Floating animation for discount badge
      gsap.to(discountRef.current, {
        y: -10,
        rotation: 2,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-street-red"
        style={{ transformOrigin: 'center center' }}
      >
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-lines opacity-10" />
        
        {/* Noise texture */}
        <div className="absolute inset-0 bg-noise opacity-10" />
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-[20rem] font-black text-dark-950/5 leading-none">
          %
        </div>
        <div className="absolute bottom-10 right-10 text-[15rem] font-black text-light-50/5 leading-none">
          SALE
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 text-center px-4 py-20">
        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-dark-950 font-black text-lg md:text-xl uppercase tracking-[0.3em] mb-6"
        >
          Limited Time Offer
        </p>

        {/* Main Title */}
        <h2
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-light-50 
                   uppercase tracking-tight mb-8"
          style={{ perspective: '1000px' }}
        >
          SUMMER SALE 2025
        </h2>

        {/* Discount Badge */}
        <div
          ref={discountRef}
          className="inline-block mb-10"
        >
          <div className="relative">
            <div className="bg-dark-950 text-light-50 px-8 py-4 transform -skew-x-6
                          shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)]">
              <span className="text-3xl md:text-5xl font-black">UP TO </span>
              <span className="text-5xl md:text-7xl font-black text-street-red">50%</span>
              <span className="text-3xl md:text-5xl font-black"> OFF</span>
            </div>
            
            {/* Decorative corner */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-light-50" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-light-50" />
          </div>
        </div>

        {/* Description */}
        <p className="text-light-50 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
          Don't miss out on the biggest sale of the season. Shop now and save big on selected items!
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-wrap justify-center gap-6">
          <Link
            to="/products?sale=true"
            className="px-12 py-5 bg-dark-950 text-light-50 font-black uppercase tracking-widest 
                     text-xl hover:bg-light-50 hover:text-dark-950 transition-all duration-300
                     hover:scale-105 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]
                     hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.5)]"
          >
            Shop Sale Now
          </Link>
          <Link
            to="/products"
            className="px-12 py-5 bg-transparent border-4 border-dark-950 text-dark-950 
                     font-black uppercase tracking-widest text-xl
                     hover:bg-dark-950 hover:text-light-50 transition-all duration-300
                     hover:scale-105"
          >
            Browse All
          </Link>
        </div>
      </div>

      {/* Side decorations */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-32 bg-dark-950" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-32 bg-dark-950" />
    </section>
  );
};

export default PromoBannerGSAP;

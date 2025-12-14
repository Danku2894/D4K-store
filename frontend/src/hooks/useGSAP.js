import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for GSAP animations with proper cleanup
 * @param {Function} callback - Animation callback with gsap context
 * @param {Array} deps - Dependency array
 */
export const useGSAP = (callback, deps = []) => {
  const ctx = useRef(null);

  useLayoutEffect(() => {
    // Create GSAP context for cleanup
    ctx.current = gsap.context(() => {
      callback(gsap, ScrollTrigger);
    });

    return () => {
      // Cleanup all animations in context
      ctx.current?.revert();
    };
  }, deps);

  return ctx;
};

/**
 * Hook for scroll-triggered animations
 * @param {Object} options - ScrollTrigger options
 */
export const useScrollTrigger = (ref, options = {}) => {
  useLayoutEffect(() => {
    if (!ref.current) return;

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 80%',
      end: 'bottom 20%',
      ...options,
    });

    return () => trigger.kill();
  }, [ref, options]);
};

/**
 * Refresh ScrollTrigger on resize/content change
 */
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh();
};

export { gsap, ScrollTrigger };
export default useGSAP;

'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimationWrapperProps {
  children: React.ReactNode;
  animation?: 'fadeInUp' | 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'scaleIn';
  delay?: number;
  triggerOnScroll?: boolean;
  className?: string;
}

export default function AnimationWrapper({ 
  children, 
  animation = 'fadeInUp', 
  delay = 0,
  triggerOnScroll = false,
  className = ''
}: AnimationWrapperProps) {
  const [isVisible, setIsVisible] = useState(!triggerOnScroll);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!triggerOnScroll) {
      // Trigger animation on mount with delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }

    // Intersection Observer for scroll-triggered animations
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay, triggerOnScroll]);

  const getAnimationClass = () => {
    if (!isVisible) return 'animate-on-load';
    
    switch (animation) {
      case 'fadeInUp':
        return 'animate-fade-in-up';
      case 'fadeIn':
        return 'animate-fade-in';
      case 'slideInLeft':
        return 'animate-slide-in-left';
      case 'slideInRight':
        return 'animate-slide-in-right';
      case 'scaleIn':
        return 'animate-scale-in';
      default:
        return 'animate-fade-in-up';
    }
  };

  return (
    <div 
      ref={ref} 
      className={`${getAnimationClass()} ${className}`}
    >
      {children}
    </div>
  );
}

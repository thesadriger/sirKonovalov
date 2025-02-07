import { useEffect, useState } from 'react';

export const useLazyLoad = (ref) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsLoaded(true);
        observer.unobserve(entry.target);
      }
    }, {
      rootMargin: '200px 0px',
      threshold: 0.01
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return isLoaded;
}; 
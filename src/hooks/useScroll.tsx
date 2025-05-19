import { useState, useEffect } from 'react';

export const useScroll = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    
                    if (currentScrollY < lastScrollY || currentScrollY < 50) {
                        // Cuộn lên hoặc gần đầu trang
                        setIsVisible(true);
                    } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
                        // Cuộn xuống và đã cuộn quá 50px
                        setIsVisible(false);
                    }
                    
                    setLastScrollY(currentScrollY);
                    ticking = false;
                });
                
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return isVisible;
};
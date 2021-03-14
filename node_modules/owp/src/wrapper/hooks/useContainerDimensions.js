import { useEffect, useState } from 'react';

export default function useContainerDimensions(containerRef) {
    const getDimensions = () => {
        if (!containerRef.current) {
            return {
                width: null,
                height: null,
            };
        }

        return {
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,
        };
    };

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const handleResize = () => {
            setDimensions(getDimensions());
        };

        if (containerRef.current) {
            setDimensions(getDimensions());
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [containerRef]);

    return dimensions;
}

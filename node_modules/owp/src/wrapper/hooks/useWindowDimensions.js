import { useEffect, useState } from 'react';

export default function useWindowDimensions() {
    const hasWindow = typeof window !== 'undefined';

    function getWindowDimensions() {
        if (!hasWindow) {
            return {
                width: null,
                height: null,
            };
        }

        return {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    }

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        if (hasWindow) {
            function handleResize() {
                setWindowDimensions(getWindowDimensions());
            }

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [hasWindow]);

    return windowDimensions;
}

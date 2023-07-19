import { useEffect, useState } from "react";

const useDevice = () => {
    const [width, setWidth] = useState();
    const [isMobile, setIsMobile] = useState();

    useEffect(() => {
        if (window) {
            setWidth(window.innerWidth)
        }
    }, [])

    useEffect(() => {
        if (width) {
            const isMobile = width <= 768;
            setIsMobile(isMobile);
        }
    }, [width]);

    return [width, isMobile];
};

export { useDevice };

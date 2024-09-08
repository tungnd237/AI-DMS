import React, {useRef, useState} from 'react';
import '../../../css/slider.css';

const Carousel = ({children, windowSize = 100, completePercentage = 95}) => {
    const target = useRef(null);
    const [progress, setProgress] = useState(0);
    // const [showArrows, setShowArrows] = useState(true);

    const onNextClick = () => {
        target.current.scrollLeft += windowSize;
    };

    const onPreviousClick = () => {
        target.current.scrollLeft -= windowSize;
    };

    // const handleResize = () => {
    //     const element = target.current;
    //     if(element.scrollWidth === element.clientWidth) setShowArrows(false);
    //     else setShowArrows(true);
    // };

    // useEffect(() => {
    //     // debounce for the performance.
    //     handleResize();
    //     window.addEventListener('resize', handleResize);
    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     }
    // }, [target]);

    const onScroll = () => {
        if (!target.current) return;

        const element = target.current;
        const windowScroll = element.scrollLeft;
        const totalWidth = element.scrollWidth - element.clientWidth;
        if (windowScroll === 0) {
            return setProgress(0);
        }

        if (windowScroll >= totalWidth * (completePercentage / 100)) {
            return setProgress(100);
        }

        setProgress((windowScroll / totalWidth) * 100);
    };

    const atTheBeginning = () => progress === 0;

    const atTheEnd = () => progress === 100;

    return <div className="flex flex-row w-full items-center">
        <button onClick={onPreviousClick}
                               className={`${atTheBeginning() && 'hidden'} flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-full active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue`}>
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
        </button>
        <div onScroll={onScroll} className="overflow-x-auto whitespace-no-wrap slider flex-1" ref={target}
             style={{scrollBehavior: 'smooth'}}>
            {children}
        </div>
        <button onClick={onNextClick} hidden={progress === 100}
                               className={`${atTheEnd() && 'hidden'} flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-full active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue`}>
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
        </button>
    </div>
};

export default Carousel;

import { useEffect, useState } from "react";

const Button = ({ onClick, children }) => {
    return (
        <button
            onClick={() => onClick()}
            className='text-gray-700 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-4 py-2.5 shadow-lg'
        >
            {children}
        </button>
    );
};

const IconButton = ({ children, onClick }) => {
    return (
        <button className='p-1 text-neutral dark:text-white rounded-lg hover:bg-accent hover:text-accent-focus' onClick={onClick}>
            {children}
        </button>
    );
};

const GhostButton = ({ children, onClick }) => {
    return <button onClick={() => onClick()} className='btn btn-ghost normal-case text-xl'>{children}</button>;
};

const AnimateButton = ({ children, className, disabled, animatedClass, duration, name="" }) => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (animate) {
            const tout = setTimeout(() => {
                setAnimate(false);
            }, duration);

            return () => clearTimeout(tout);
        }

        return;
    }, [animate]);

    return (
        <button aria-label={name} disabled={disabled} onClick={() => setAnimate(true)} className={`${className} ${animate && animatedClass}`}>
            {children}
        </button>
    );
};

const AnimateSendButton = ({ children, disabled, name }) => {
    return (
        <AnimateButton
            className='w-full h-full btn btn-circle btn-neutral text-white outline-none md:shadow-md'
            animatedClass='rotate bg-base-300'
            duration={1000}
            disabled={disabled}
            name={name}
        >
            {children}
        </AnimateButton>
    );
};

const AnimateRegenerateButton = ({ onClick, children }) => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (animate) {
            const tout = setTimeout(() => {
                setAnimate(false);
                onClick();
            }, 1000);

            return () => clearTimeout(tout);
        }

        return;
    }, [animate]);

    const clickEvent = () => {
        setAnimate(true);
    };

    return (
        <button
            onClick={() => clickEvent()}
            className='min-w-[100px] text-gray-700 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-4 py-2.5 shadow-lg transition-all ease-in-out transform dark:text-gray-100 dark:bg-black dark:hover:bg-gray-800'
        >
            <div className='flex flex-row gap-2 justify-center items-center'>
                {!animate ? (
                    <>
                    {children}  
                    </>
                ) : (
                    <span className='loading loading-spinner loading-sm'></span>
                )}
            </div>
        </button>
    );
};

export { Button, IconButton, GhostButton, AnimateButton, AnimateSendButton, AnimateRegenerateButton };

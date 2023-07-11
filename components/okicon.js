const OkIcon = ({ color, width, height }) => {
    return (
        <svg fill={color} xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' viewBox='0 0 24 24' xmlSpace='preserve'  width={`${width}px`} height={`${height}px`}>
            <path d='M19.3,5.3L9,15.6l-4.3-4.3l-1.4,1.4l5,5L9,18.4l0.7-0.7l11-11L19.3,5.3z' />
            <rect fill="None" className='st0' />
        </svg>
    );
};

export default OkIcon
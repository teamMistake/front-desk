const Button = ({ onClickFunc, children }) => {
    return (
        <button
            onClick={() => onClickFunc()}
            className='text-gray-700 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-4 py-2.5 shadow-lg'
        >
            {children}
        </button>
    );
};

export { Button };

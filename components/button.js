const Button = ({onClickFunc, children}) => {
    return <button
        onClick={ () => onClickFunc() }
        className='text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 my-2'
    >
        {children}
    </button>;
}

export {Button}
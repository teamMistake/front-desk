const BottomSelectorUI = ({ title, children }) => {
    return (
        <div className='w-[90%] max-w-[640px] flex flex-col items-center rounded-md p-3 pb-1'>
            <div className='mb-2'>
                <span className='select-none text-2xl font-bold highlight dark:bg-none'>{title}</span>
            </div>
            <div className='join w-full flex justify-center'>{children}</div>
        </div>
    );
};

export default BottomSelectorUI;

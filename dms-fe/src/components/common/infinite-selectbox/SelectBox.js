import React, {useState} from 'react';

const SelectBox = ({children, selectedItem}) => {
    const [isOpen, setOpen] = useState(false);

    const closeMenu = (e) => {
        e.preventDefault();
        setOpen(false);
    };

    const style = {
        height: '100%',
        width: '100%',
        left: 0,
        top: 0,
        overflow: 'hidden',
        position: 'fixed'
    };
    return <div className="relative inline-block w-full">
        {isOpen && <div style={style} onClick={closeMenu}/>}
        <button type="button"
                className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 text-left cursor-default text-center bg-gray-200 focus:outline-none focus:bg-white focus:shadow-md text-gray-700 font-bold rounded-full"
                aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label" onClick={() => setOpen(isOpen => !isOpen)}
                style={{padding: '0.5rem'}}
        >
                <span className="flex items-center">
                    <span className="ml-3 block truncate">
                        {selectedItem ? selectedItem : 'Select Item'}
                    </span>
                </span>
                <span className="ml-3 absolute inset-y-0 right-0.5 flex items-center pr-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400"
                         xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd"
                        d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"/>
                    </svg>
                </span>
        </button>
        {
            isOpen && children
        }
    </div>
};

export default SelectBox;
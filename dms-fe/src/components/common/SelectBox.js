import React, {useState, useEffect} from 'react';

const SelectBox = ({onChange, items = [], initialIndex = -1}) => {
    const [isOpen, setOpen] = useState(false);
    const [selected, setSelected] = useState(initialIndex);
    const [previewItem, setPreviewItem] = useState(null);
    useEffect(() => {
        setPreviewItem(items[selected]);
    }, [items, selected]);

    const closeMenu = () => setOpen(false);

    const style = {
        height: '100%',
        width: '100%',
        left: 0,
        top: 0,
        overflow: 'hidden',
        position: 'fixed'
    };
    return <div className="m-2 relative inline-block">
        {isOpen && <div style={style} onClick={closeMenu}/>}
        <button type="button"
                className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 text-left cursor-default text-center bg-gray-200 focus:outline-none focus:bg-white focus:shadow-md text-gray-700 font-bold rounded-full"
                aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label" onClick={() => setOpen(isOpen => !isOpen)}>
                <span className="flex items-center">
                    <span className="ml-3 block truncate">
                        {previewItem ? previewItem : 'Batch number'}
                    </span>
                </span>
                <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
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
            isOpen && items.length > 0 &&<ul
                className="absolute mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm overflow-auto" style={{'max-height': '35vh'}}
                tabIndex="-1">
                {
                    items.map((item, index) => <li className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9"
                                          onClick={() => {
                                              onChange(item);
                                              setSelected(index);
                                              closeMenu();
                                          }}>
                        {item}
                    </li>)
                }
            </ul>
        }
    </div>
};

export default SelectBox;
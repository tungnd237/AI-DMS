import React from "react";

const   Checkbox = ({label, onToggle, name, isChecked}) => {
    return <>
        <label className="inline-flex items-center">
            <input type="checkbox"
                   name={name}
                   className="rounded bg-gray-200 border-transparent focus:border-transparent focus:bg-blue-200 text-blue-700 focus:ring-1 focus:ring-offset-2 focus:ring-white-500"
                   onClick={onToggle}
                   onChange={onToggle}
                   checked={isChecked}
            />
                <span className="ml-2">{label}</span>
        </label>
    </>;
};

export default Checkbox;
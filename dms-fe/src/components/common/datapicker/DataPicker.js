import DatePicker from "react-datepicker";
import React from "react";

const DataPickerWrapper = ({dropdownMode = 'select', selected, onChange, ...restProps}) => {
    const className = 'text-center m-2 bg-gray-200 focus:outline-none focus:bg-white focus:shadow-md text-gray-700 font-bold rounded-full';
    const injectedProps = {
        dropdownMode,
        selected,
        className,
        ...restProps
    };

    return <DatePicker {...injectedProps}/>;
};

export default DataPickerWrapper;
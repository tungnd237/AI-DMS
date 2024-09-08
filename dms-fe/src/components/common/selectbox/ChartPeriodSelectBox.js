import Select from "react-select";
import React, {useEffect, useRef, useState} from "react";
import {getModules} from "../../../service/ModuleService";
import {DataItemTypes} from "../../../constants/DataItemConstant";

const DataTypeSelectBox = ({onSelect, disabled}) => {
    const options = [
        { value: 'DAY', label: 'Last day' },
        { value: 'WEEK', label: 'Last 7 days' },
        { value: 'ONE_MONTH', label: 'Last 30 days' },
        { value: 'THREE_MONTH', label: 'Last 90 days' },
        { value: 'YEAR', label: 'Last year' },
    ]
    return (
        <label className="block">
            <span>Select Period </span>
            <Select
                name="period"
                placeholder="Period"
                isDisabled={disabled}
                defaultValue={options[3]}
                isSearchable={true}
                isClearable={false}
                options={options}
                onChange={(option) => onSelect(option)}
            />
        </label>
    )
}
export default DataTypeSelectBox;
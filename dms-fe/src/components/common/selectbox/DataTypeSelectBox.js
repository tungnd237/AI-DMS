import Select from "react-select";
import React, {useEffect, useRef, useState} from "react";
import {getModules} from "../../../service/ModuleService";
import {DataItemTypes} from "../../../constants/DataItemConstant";

const DataTypeSelectBox = ({onSelect}) => {
    const options = [
        { value: 'IMAGE', label: 'IMAGE' },
        { value: 'VIDEO', label: 'VIDEO' },
    ]
    return (
        <label className="block">
            <span>Select Type </span>
            <Select
                name="type"
                placeholder="Data Type"
                defaultValue={options[1]}
                isSearchable={true}
                isClearable={false}
                options={options}
                onChange={(option) => onSelect(option)}
            />
        </label>
    )
}
export default DataTypeSelectBox;
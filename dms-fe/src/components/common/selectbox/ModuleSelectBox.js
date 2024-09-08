import Select from "react-select";
import React, {useEffect, useRef, useState} from "react";
import {getModules} from "../../../service/ModuleService";

const ModuleSelectBox = ({onSelect}) => {
    const [modules, setModules] = useState([{"name": "phone_smoking_eating"}]);
    useEffect(() => {
        getModules({currentPage: 0, currentPageSize: 1000}).then((data) => {
            setModules(data.elements)
        });
    }, []);
    return (
        <label className="block">
            <span>Select Module </span>
            <Select
                name="module"
                placeholder="Module"
                defaultValue={modules[0]}
                isSearchable={true}
                isClearable={false}
                options={modules}
                getOptionLabel={(option) => `${option['name']}`}
                getOptionValue={(option) => `${option['name']}`}
                onChange={(option) => onSelect(option)}
            />
        </label>
    )
}
export default ModuleSelectBox;
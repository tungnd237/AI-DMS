import React, {useEffect, useRef, useState} from "react";
import SelectBox from "../../../common/infinite-selectbox/SelectBox";
import {DataItemStatus, DataItemTypes} from "../../../../constants/DataItemConstant";
import Input from "../../../common/form/input";
import SaveSearchResultModal from "../modal/SaveSearchResultModal";
import PreviewPicksModal from "../modal/PreviewPicksModal";
import Select from "react-select";
import DatePicker from "react-datepicker";
import {getModules} from "../../../../service/ModuleService";
import {toast} from "react-toastify";
import {Button, FormControlLabel, Radio, RadioGroup, Stack} from "@mui/material";
import MetadataSearchBox from "../../../common/searchbox/MetadataSearchBox";
import LoadingButton from '@mui/lab/LoadingButton';
import CreatableSelect from "react-select/creatable";
import "react-datepicker/dist/react-datepicker.css";

const DataItemManagementHeader = (
    {
        filter, setFilter, clearFilter, updateCurrentPage, searchDataItems, searchDataItemsAdvanced,
        isDownloading,
        executeDownload,
        totalElements,
    }) => {

    const onSearchItems = () => {
        if (!validate()) return;
        searchDataItems();
        updateCurrentPage(1);
    };

    const onClearFilter = () => {
        console.log("clear filter");
        clearFilter();
        updateCurrentPage(1);
    }

    const onClickDownload = () => {
        console.log(isDownloading)
        executeDownload();
    };

    const [openPreviewModal, setOpenPreviewModal] = useState(false);

    const [visible, setVisible] = useState(false);

    const [timeField, setTimeField] = useState("createdAt");
    const onSelectTimeFilter = (event) => {
        setTimeField(event.target.value);
        setFilter({...filter, timeField: event.target.value});
    }

    const [inputValue, setInputValue] = React.useState('');
    const createOption = (label) => ({
        label,
        value: label,
    });
    const createOptions = (tags) => tags.map(tag => ({label: tag, value: tag}));
    const handleCreateTag = (event) => {
        if (!inputValue) return;
        switch (event.key) {
            case 'Enter':
            case 'Tab':
                const tagOptions = [...createOptions(filter.tags), createOption(inputValue)];
                setInputValue('');
                setFilter({...filter, tags: [...new Set(tagOptions.map(tag => tag.value))]})

                event.preventDefault();
        }
    };


    const [modules, setModules] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const selectStatusRef = useRef();
    useEffect(() => {
        getModules({currentPage: 0, currentPageSize: 1000}).then((data) => {
            setModules(data.elements)
        });
    }, []);
    const onSelectModule = (option) => {
        if (option === null) { // clear module
            setStatuses([]);
            selectStatusRef.current.setValue(null);
            setFilter({
                ...filter,
                moduleStatus: null
            })
        } else {
            setStatuses(statusOptions)
            // selectStatusRef.current.setValue(statusOptions[0]);

            setFilter({
                ...filter,
                moduleStatus: {
                    ...filter.moduleStatus,
                    moduleId: option.id,
                    moduleName: option.name,
                }
            })
        }
    }
    const onSelectStatus = (option) => {
        setFilter({
            ...filter,
            moduleStatus: {
                ...filter.moduleStatus,
                status: option === null ? null : option.value,
            }
        })

    }
    const statusOptions = DataItemStatus.map(s => {
        return {value: s, label: s}
    });

    const validate = () => {
        if (filter.moduleStatus && filter.moduleStatus.moduleId !== null && !filter.moduleStatus.status) {
            toast.error("You have not selected status.");
            return false;
        }
        return true;
    }


    const onSaveSearch = () => {
        if (!validate()) return;
        setVisible(true);
    };


    return <div className="bg-white shadow-md rounded px-4 pt-6 mb-4 flex flex-col my-2">
        <div>
            {openPreviewModal &&
                <PreviewPicksModal visible={openPreviewModal} setOpenPreviewModal={setOpenPreviewModal}/>}
            {visible && <SaveSearchResultModal visible={visible} setVisible={setVisible} searchFilter={filter}
                                               totalElements={totalElements} />}
            <div className="md:flex mb-6">
                <div className="md:w-1/3 px-3 mb-6 md:mb-0">
                    <label>Start Time</label>
                    <DatePicker
                        selected={filter.startDate}
                        onChange={(date) => {
                            setFilter({
                                ...filter,
                                startDate: date
                            })
                        }}
                        showTimeSelect
                        showMonthDropdown
                        showYearDropdown
                        placeholderText="Click to select a date"
                        dateFormat="DD/MM/YYYY HH:mm:ss"
                        timeFormat="HH:mm:ss"
                        className="text-center m-2 bg-gray-200 focus:outline-none focus:bg-white focus:shadow-md text-gray-700 font-bold rounded-full"
                        dropdownMode={"scroll"}/>
                </div>
                <div className="md:w-1/3 px-3 mb-6 md:mb-0">
                    <label>End Time</label>
                    <DatePicker
                        selected={filter.endDate}
                        onChange={(date) => {
                            setFilter({
                                ...filter,
                                endDate: date
                            })
                        }}
                        showTimeSelect
                        showMonthDropdown
                        showYearDropdown
                        placeholderText="Click to select a date"
                        dateFormat="DD/MM/YYYY HH:mm:ss"
                        timeFormat="HH:mm:ss"
                        className="text-center m-2 bg-gray-200 focus:outline-none focus:bg-white focus:shadow-md text-gray-700 font-bold rounded-full"
                        dropdownMode={"scroll"}/>
                </div>
                <div className="md:w-1/3 px-3 mb-6 md:mb-0">
                    <RadioGroup
                        row
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue={timeField}
                        name="radio-buttons-group"
                        aria-disabled={"false"}
                        value={timeField}
                        onChange={onSelectTimeFilter}
                    >
                        <FormControlLabel value="createdAt" control={<Radio/>} label="Upload Date"/>
                        <FormControlLabel value="metadata.collectedTime" control={<Radio/>} label="Collect Date"/>
                    </RadioGroup>
                </div>
            </div>
            <div className="md:flex mb-6">
                <div className="md:w-1/3 px-3 mb-6 md:mb-0">
                    <label className="block">
                        <span>Select Module </span>
                        <Select
                            name="module"
                            placeholder="Module"
                            isSearchable={true}
                            isClearable={true}
                            options={modules}
                            getOptionLabel={(option) => `${option['name']}`}
                            getOptionValue={(option) => `${option['name']}`}
                            onChange={(option) => onSelectModule(option)}
                        />
                    </label>
                </div>
                <div className="md:w-1/3 px-3 mb-6 md:mb-0">
                    <label className="block">
                        <span>Select Status </span>
                        <Select
                            ref={selectStatusRef}
                            name="status"
                            placeholder="Status"
                            options={statuses}
                            defaultValue={statuses[0]}
                            onChange={(option) => onSelectStatus(option)}

                        />
                    </label>
                </div>
                <div className="md:w-1/3 px-3 mb-6 md:mb-0">
                    <label className="block">
                        <span>Tags</span>
                        <CreatableSelect
                            components={{DropdownIndicator: null,}}
                            isClearable
                            isMulti
                            menuIsOpen={false}
                            placeholder="Type something and press enter..."
                            value={createOptions(filter.tags)}
                            inputValue={inputValue}
                            onKeyDown={handleCreateTag}
                            onChange={(newValue) => {
                                console.log(newValue)
                                console.log(filter.tags)
                                setFilter({...filter, tags: [...new Set(newValue.map(tag => tag.value))]})
                            }
                            }
                            onInputChange={(newValue) => setInputValue(newValue)}
                        />
                    </label>
                </div>
            </div>
            <div className="md:flex mb-6">
                <div className="md:w-1/3 px-3 mb-6 md:mb-0">
                    <label className="block">
                        <span>Select Data Type </span>
                        <SelectBox selectedItem={filter.type}>
                            <ul
                                className="absolute mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm overflow-auto"
                                style={{'maxHeight': '35vh', zIndex: '10'}}
                                tabIndex="-1" role="listbox" aria-labelledby="listbox-label"
                                aria-activedescendant="listbox-option-3">
                                <li className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9"
                                    onClick={() => setFilter({
                                        ...filter,
                                        type: null
                                    })
                                    }
                                >
                                    Select Type
                                </li>
                                {
                                    DataItemTypes.map(type => {
                                            return <li key={type}
                                                       onClick={() => setFilter({...filter, type})}
                                                       className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9">
                                                {type}
                                            </li>
                                        }
                                    )
                                }
                            </ul>
                        </SelectBox>
                    </label>
                </div>
                <div className="md:w-1/3 px-3 mb-6 md:mb-0">
                    <label className="block">
                        <Input
                            label="Name and Location"
                            value={filter.location}
                            name="location"
                            readonly
                            onChange={(e) => setFilter({...filter, location: e.target.value})}
                        />
                    </label>
                </div>
                <div className="md:w-1/3 px-3 mb-6 md:mb-0">
                    <MetadataSearchBox label="Metadata Search Query"
                                       updateQuery={(value) => setFilter({...filter, searchQuery: value})}/>
                </div>
            </div>
            <div className="md:flex mt-10 mb-6 justify-end">
                <Stack direction="row" spacing={2}>
                    <LoadingButton
                        variant={"contained"}
                        onClick={() => onClickDownload()}
                        loading={isDownloading}
                    >
                        Download search
                    </LoadingButton>
                    <Button
                        variant={"contained"}
                        onClick={() => onSaveSearch()}
                    >
                        Save search
                    </Button>
                    <Button
                        disableRipple disableFocusRipple
                        onClick={() => onClearFilter()}
                        variant={"contained"}
                    >
                        Clear
                    </Button>
                    <Button
                        onClick={() => onSearchItems()}
                        variant={"contained"}
                    >
                        Search
                    </Button>
                </Stack>

            </div>
        </div>
    </div>
};

export default DataItemManagementHeader;
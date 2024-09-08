import React, {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import ChartPeriodSelectBox from "../../../common/selectbox/ChartPeriodSelectBox";
import {Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";

import Button from "@mui/material/Button";
import DataTypeSelectBox from "../../../common/selectbox/DataTypeSelectBox";
import MetadataSearchBox from "../../../common/searchbox/MetadataSearchBox";

const DashboardHeader = ({
                             duration = {},
                             timeField,
                             filterQuery,
                             updateDuration,
                             updateTimeField,
                             updateFilterQuery,
                             updateDataType,
                             applySearch,
                             getMetadataFieldList,
                             getMetadataValueList,
                         }) => {
    const {period, startTime, endTime} = duration;
    const convertedStartTime = startTime ? moment.unix(startTime) : undefined;
    const convertedEndTime = endTime ? moment.unix(endTime) : undefined;
    const [customPeriod, setCustomPeriod] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('THREE_MONTH');
    const [timePeriod, setTimePeriod] = useState({period: 'THREE_MONTH', startTime: 0, endTime: 0})
    const isAllowSearch = !customPeriod || ((timePeriod.startTime > 0) && (timePeriod.endTime > 0));

    useEffect(() => {
        updateDuration({...timePeriod})
    }, [timePeriod]);

    const onCheckCustomPeriod = (event) => {
        setCustomPeriod(event.target.checked);
            setTimePeriod({...timePeriod, period: event.target.checked ? null : selectedPeriod})
    }
    const onSelectTimeFilter = (event) => {
        updateTimeField(event.target.value);
    }

    const onSelectDataType = (option) => {
        updateDataType(option.value);
    }

    return (
        <div className="py-4 px-6">
            <FormLabel id="demo-radio-buttons-group-label">Time Filter</FormLabel>
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
            <MetadataSearchBox label="Filter Query" updateQuery={updateFilterQuery}/>

            <FormControl>
                <DataTypeSelectBox onSelect={onSelectDataType}/>
            </FormControl>
            <ChartPeriodSelectBox onSelect={(option) => {
                setSelectedPeriod(option.value);
                setTimePeriod({...timePeriod, period: option.value, startTime: null, endTime: null})
            }} disabled={customPeriod}/>

            <FormControlLabel control={<Checkbox
                checked={customPeriod}
                onChange={onCheckCustomPeriod}
            />} label="Custom period"/>
            <div className="my-6 w-full">
                <div className="w-1/3 inline-block">
                    <label>Start Time</label>
                    <DatePicker
                        disabled={!customPeriod}
                        selected={timePeriod.startTime ? moment.unix(timePeriod.startTime) : undefined}
                        onChange={(date) => {
                            setTimePeriod({...timePeriod, period: null, startTime: date ? date.unix() : undefined});
                        }}
                        showTimeSelect
                        showMonthDropdown
                        showYearDropdown
                        placeholderText="Click to select a date"
                        dateFormat="DD/MM/YYYY HH:mm:ss"
                        timeFormat="HH:mm:ss"
                        className="text-center m-2 bg-gray-200 focus:outline-none focus:bg-white focus:shadow-md text-gray-700 font-bold rounded-full"/>
                </div>
                <div className="w-1/3 inline-block">
                    <label>End Time</label>
                    <DatePicker
                        disabled={!customPeriod}
                        selected={timePeriod.endTime ? moment.unix(timePeriod.endTime) : undefined}
                        showTimeSelect
                        showMonthDropdown
                        showYearDropdown
                        placeholderText="Click to select a date"
                        onChange={date => setTimePeriod({
                            ...timePeriod,
                            period: null,
                            endTime: date ? date.unix() : undefined,
                        })}
                        dateFormat="DD/MM/YYYY HH:mm:ss"
                        timeFormat="HH:mm:ss"
                        className="text-center m-2 bg-gray-200 focus:outline-none focus:bg-white focus:shadow-md text-gray-700 font-bold rounded-full"/>
                </div>
            </div>
            <div className="my-6 w-full">
                <Button
                    variant={"contained"}
                    disabled={!isAllowSearch}
                    onClick={() => {
                        // updateDuration({...timePeriod});
                        applySearch();
                    }}
                >
                    Apply
                </Button>
            </div>
        </div>
    )
}

export default DashboardHeader;
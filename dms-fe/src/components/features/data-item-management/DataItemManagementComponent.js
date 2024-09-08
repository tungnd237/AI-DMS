import React, {useEffect, useState} from 'react';
import DataItemManagementView from './DataItemManagementView';
import {useDispatch, useSelector} from "react-redux";
import {
    fetchDataItemsBySearch,
    fetchDataItemsBySearchAdvanced,
    setAdvancedSearch,
    setCurrentPage
} from "../../../duck/slice/DataItemSlice";
import {downloadFile, executeDownloadItems} from "../../../service/DownloadService";
import moment from "moment";

const DataItemManagementComponent = () => {
    const dispatch = useDispatch();
    const updateCurrentPage = (newPageNumber) => {
        dispatch(setCurrentPage(newPageNumber - 1));
    };

    const updateAdvancedSearch = (s) => {
        dispatch(setAdvancedSearch(s));
    }


    const {
        dataItems,
        totalPages = 0,
        totalElements = 0,
        currentPage,
        currentPageSize,
        selectedItem,
    } = useSelector(state => state.dataItemState);
    const [isDownloading, setDownloadingState] = useState(false);
    const [percentage, setPercentage] = useState("0%");
    const [allowDownload, setAllowDownload] = useState(false);

    const initFilter = {
        location: "",
        type: null,
        tags: [],
        searchQuery: "",
        cameraType: "",
        collectedAt: "",
        startDate: moment().subtract({days: 7}),
        endDate: moment(),
        timeField: "createdAt",
        inferences: [],
        inferenceNames: [],
        inferenceSearchQuery: "",
        models: [],
        modelNames: [],
        annotated: false,
        moduleStatus: {
            moduleId: null,
            moduleName: null,
            status: null
        }
    };

    const [filter, setFilter] = useState(initFilter);


    useEffect(() => {
        dispatch(fetchDataItemsBySearch({
            ...filter,
            pageNumber: currentPage,
            pageSize: 10
        }));
        // dispatch(fetchDataItems({currentPage: currentPage, currentPageSize: 10}));
    }, [currentPage, currentPageSize, dispatch]);


    const searchDataItems = () => {
        dispatch(fetchDataItemsBySearch({
            ...filter,
            pageNumber: currentPage,
            pageSize: 10
        }));
    }

    const searchDataItemsAdvanced = () => {
        dispatch(fetchDataItemsBySearchAdvanced({
            ...filter,
            pageNumber: currentPage,
            pageSize: 10
        }));
    }

    const executeDownload = () => {
        setDownloadingState(true);
        setPercentage("0%");
        executeDownloadItems({
            ...filter
        }).then(({blob, headers}) => {

            let filename = new Date().toISOString() + ".zip";
            downloadFile(blob, filename);
        }).catch(error => {
            console.log("Download FileName error: ", error);
        })
            .finally(() => setDownloadingState(false));
    };


    const clearFilter = () => {
        setFilter(initFilter);
        setAllowDownload(false);
    }

    const injectedProps = {
        dataItems,
        totalPages,
        totalElements,
        currentPage,
        currentPageSize,
        updateCurrentPage,
        filter,
        setFilter,
        clearFilter,
        searchDataItems,
        searchDataItemsAdvanced,
        isDownloading,
        executeDownload,
        allowDownload,
        updateAdvancedSearch
    };
    return <DataItemManagementView {...injectedProps}/>
};

export default DataItemManagementComponent;
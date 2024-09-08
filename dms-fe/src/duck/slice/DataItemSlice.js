import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {createDataItem, getDataItems, searchDataItems, searchDataItemsAdvanced} from "../../service/DataItemService";

export const fetchDataItems = createAsyncThunk('data-item/fetch', getDataItems);

export const fetchDataItemsBySearch = createAsyncThunk('data-item/fetch-by-search', searchDataItems)
export const fetchDataItemsBySearchAdvanced = createAsyncThunk('data-item/fetch-by-search-advanced', searchDataItemsAdvanced)

export const dataItemSlice = createSlice({
    name: 'dataItemState',
    initialState: {
        selectedItem: {},
        dataItems: [],
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
        currentPageSize: 1,
        models: [],
        advancedSearch: false
    },
    reducers: {
        setCurrentPage: (state, {payload}) => {
            state.currentPage = payload;
        },
        setSelectedItem: (state, {payload}) => {
            state.selectedItem = payload;
        },
        setAdvancedSearch: (state, {payload}) => {
            state.advancedSearch = payload;
        },
    },
    extraReducers: {
        [fetchDataItems.fulfilled]: (state, {payload}) => {
            const {totalPages, elements, page, size, totalElements} = payload;
            state.dataItems = elements;
            state.totalPages = totalPages;
            state.totalElements = totalElements;
            state.currentPage = page;
            state.currentPageSize = size;
        },

        [fetchDataItemsBySearch.fulfilled]: (state, {payload}) => {
            const {totalPages, elements, page, size, totalElements, hasError} = payload;
            state.dataItems = elements;
            state.totalPages = totalPages;
            state.totalElements = totalElements;
            state.currentPage = page;
            state.currentPageSize = size;
        },

        [fetchDataItemsBySearchAdvanced.fulfilled]: (state, {payload}) => {
            const {totalPages, elements, page, size, totalElements} = payload;
            state.dataItems = elements;
            state.totalPages = totalPages;
            state.totalElements = totalElements;
            state.currentPage = page;
            state.currentPageSize = size;
        },

    }
});

export const {setCurrentPage, setAdvancedSearch} = dataItemSlice.actions;

export default dataItemSlice.reducer;
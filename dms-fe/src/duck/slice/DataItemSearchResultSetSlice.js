import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getSearchResultSet} from "../../service/DataItemService";

export const fetchResultSet = createAsyncThunk('workspaces/fetch', getSearchResultSet);

export const dataItemSearchResultSetSlice = createSlice({
    name: 'searchResultSetState',
    initialState: {
        selectedItem: {},
        resultSets: [],
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
        currentPageSize: 1,
    },
    reducers: {
        setCurrentPageRS: (state, {payload}) => {
            state.currentPage = payload;
        },
        setSelectedItem: (state, {payload}) => {
            state.selectedItem = payload;
        },
    },
    extraReducers: {
        [fetchResultSet.fulfilled]: (state, {payload}) => {
            const {totalPages, elements, page, size, totalElements} = payload;
            state.resultSets = elements;
            state.totalPages = totalPages;
            state.totalElements = totalElements;
            state.currentPage = page;
            state.size = size;
        },

    }
});

export const {setCurrentPageRS} = dataItemSearchResultSetSlice.actions;

export default dataItemSearchResultSetSlice.reducer;
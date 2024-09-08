import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getSearchResultSet, getWorkspaceDetails, getWorkspaceItems} from "../../service/DataItemService";

export const fetchWorkspaceDetails = createAsyncThunk('workspace-tasks/fetch', getWorkspaceDetails);

export const fetchWorkspaceItems = createAsyncThunk('workspace-items/fetch', getWorkspaceItems);

export const workspaceDetailsSlice = createSlice({
    name: 'workspaceDetailsState',
    initialState: {
        tasks: [],
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
        currentPageSize: 1,
    },
    reducers: {
        setCurrentPage: (state, {payload}) => {
            state.currentPage = payload;
        },
        setSelectedItem: (state, {payload}) => {
            state.selectedItem = payload;
        },
    },
    extraReducers: {
        [fetchWorkspaceDetails.fulfilled]: (state, {payload}) => {
            const {totalPages, elements, page, size, totalElements} = payload;
            state.tasks = elements;
            state.totalPages = totalPages;
            state.totalElements = totalElements;
            state.currentPage = page;
            state.size = size;
        },

    }
});

export const {setCurrentPage} = workspaceDetailsSlice.actions;

export default workspaceDetailsSlice.reducer;
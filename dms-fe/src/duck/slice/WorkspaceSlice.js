import {createSlice} from '@reduxjs/toolkit';

export const workspaceSlice = createSlice({
    name: 'workspaceState',
    initialState: {
        selectedWorkspace: {},
        workspaces: [],
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
        currentPageSize: 1,
        models: []
    },
    reducers: {
        setCurrentPage: (state, {payload}) => {
            state.currentPage = payload;
        },
    },

});

export const {setCurrentPage} = workspaceSlice.actions;

export default workspaceSlice.reducer;
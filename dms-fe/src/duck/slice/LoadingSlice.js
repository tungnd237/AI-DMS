import {createSlice} from '@reduxjs/toolkit';

const loadingStateSlice = createSlice({
    name: 'loading',
    initialState: {
        isLoading: false
    },
    reducers: {
        showLoader: state => {
            state.isLoading = true;
            return state;
        },
        hideLoader: state => {
            state.isLoading = false;
            return state;
        },
    }
});

export const { showLoader, hideLoader } = loadingStateSlice.actions;

export default loadingStateSlice.reducer
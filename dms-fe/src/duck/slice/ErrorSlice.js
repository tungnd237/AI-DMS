import {createSlice} from '@reduxjs/toolkit';

export const errorSlice = createSlice({
    name: 'errorState',
    initialState: {
        error: '',
        message: '',
        status: -1
    },
    reducers: {
        setError: (state, {payload}) => {
            const {error, message, status} = payload;
            state.error = error;
            state.message = message;
            state.status = status;
        },
    },
});

export const {setError} = errorSlice.actions;

export default errorSlice.reducer;
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {createModel, getModels, getModelsByModule} from "../../service/ModelService";

export const fetchModels = createAsyncThunk('model/fetch', getModels);

export const fetchModelsByModule = createAsyncThunk('model/fetch-by-module', getModelsByModule);

export const createANewModel = createAsyncThunk('model/create', createModel);

export const modelSlice = createSlice({
    name: 'modelState',
    initialState: {
        models: [],
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
        currentPageSize: 1,
    },
    reducers: {
        setCurrentPage: (state, {payload}) => {
            state.currentPage = payload;
        },
        cleanUp: (state) => {
            return {
                models: [],
                totalPages: 0,
                totalElements: 0,
                currentPage: 0,
                currentPageSize: 1,
            };
        }
    },
    extraReducers: {
        [fetchModels.fulfilled]: (state, {payload}) => {
            const {totalPages, elements, size, totalElements} = payload;
            state.models = elements;
            state.totalPages = totalPages;
            state.totalElements = totalElements;
            state.size = size;
        },

        [fetchModelsByModule.fulfilled]: (state, {payload}) => {
            console.log("New Model ", payload);
            state.models = payload;
        }
    }
});

export const {setCurrentPage, cleanUp} = modelSlice.actions;

export default modelSlice.reducer;
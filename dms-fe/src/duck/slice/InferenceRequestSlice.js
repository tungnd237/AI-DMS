import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
    getInferenceById,
    getInferenceItems,
    getInferenceRequests,
} from "../../service/InferenceRequestService";


export const fetchInferenceRequests = createAsyncThunk('inference-request/fetch', getInferenceRequests);

export const updateInferenceRequests = createAsyncThunk('inference-request/update-status', getInferenceRequests);

export const fetchInferenceDetails = createAsyncThunk('inference-request/details', getInferenceById);

export const fetchInferenceItems = createAsyncThunk('inference-request/items', getInferenceItems);

export const inferenceRequestSlice = createSlice({
    name: 'inference-request',
    initialState: {
        requests: [],
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
        currentPageSize: 10,
        models: [],
        executedInference: {},
        selectedInference: {
            id: "",
            name: "",
            items: [],
            itemPage: {}
        },
        dataProjects: [],
        results: [],
        evaluationData: {
            project: {},
            model: {},
        },
        metrics: []
    },
    reducers: {
        setCurrentPage: (state, {payload}) => {
            state.currentPage = payload;
        },
        setSelectedInferenceRequest: (state, {payload}) => {
            state.selectedInference = payload;
        },
        setDataProject: (state, {payload}) => {
            const {dataProjects} = payload;
            state.dataProjects = dataProjects;
        },
        setModels: (state, {payload}) => {
            state.models = payload;
        },
        setEvaluationData: (state, {payload}) => {
            state.evaluationData = payload;
        },
        cleanUp: (state) => {
            return {
                requests: [],
                totalPages: 0,
                totalElements: 0,
                currentPage: 0,
                currentPageSize: 1,
            };
        }
    },
    extraReducers: {
        [fetchInferenceRequests.fulfilled]: (state, {payload}) => {
            const {totalPages, elements, size, totalElements} = payload;
            state.requests = elements;
            state.totalPages = totalPages;
            state.totalElements = totalElements;
            state.size = size;
        },
        [updateInferenceRequests.fulfilled]: (state, {payload}) => {
            const {totalPages, elements, size, totalElements} = payload;
            state.requests = elements;
            state.totalPages = totalPages;
            state.totalElements = totalElements;
            state.size = size;
        },
        [fetchInferenceItems.fulfilled]: (state, {payload}) => {
            state.selectedInference.itemPage = payload;
        },
    }
});

export const {
    setCurrentPage,
    setSelectedInferenceRequest,
    setDataProject,
    setEvaluationData,
    cleanUp,
} = inferenceRequestSlice.actions;

export default inferenceRequestSlice.reducer;
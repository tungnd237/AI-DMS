import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
     fetchDataTypeStats,
     fetchModuleStats, fetchOddStats
} from '../../service/DashboardService'

export const fetchModuleStatsData = createAsyncThunk("dashboard/modules", fetchModuleStats);

export const fetchOddStatsData = createAsyncThunk("dashboard/odds", fetchOddStats);

export const fetchDataTypeStatsData = createAsyncThunk("dashboard/data-items", fetchDataTypeStats);

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        startTime: 0,
        endTime: 0,
        period: "THREE_MONTH",
        timeField: "createdAt",
        dataType: "VIDEO",
        filterQuery: "",
        loadingState: {
            modules: true,
            odds: true,
            dataItems: true
        },
        statistic: {
            moduleInfo: {
            },
            oddInfo: [],
            dataTypeInfo: [],
            bagInfo: {
                totalBagFile: 0,
                totalTimeRecorded: 0,
                size: {
                    totalSize: 0,
                    maxSize: 0,
                    minSize: 0
                }
            },
            imageInfo: {
                totalImages: 0,
                imagesAnnotated: 0,
            }
        },
        attributes: {
            nameClass: [],
            totalAnnotated: 0,
            distribution: []
        },
        models: [],
    },
    reducers: {
        setStartTime: (state, {payload}) => {
            state.startTime = payload;
        },
        setEndTime: (state, {payload}) => {
            state.endTime = payload;
        },
        setDuration: (state, {payload}) => {
            const {period, startTime, endTime} = payload;
            state.period = period;
            state.startTime = startTime;
            state.endTime = endTime;
        },
        setTimeField: (state, {payload}) => {
            state.timeField = payload;
        },
        setFilterQuery: (state, {payload}) => {
            state.filterQuery = payload;
        },
        setDataType: (state, {payload}) => {
            state.dataType = payload;
        },
        showChartLoader: (state, {payload}) => {
            state.loadingState[payload] = true;
        },
        hideChartLoader: (state, {payload}) => {
            state.loadingState[payload] = false;
        },
        cleanUp: (state => {
            state = {
                startTime: 0,
                endTime: 0,
                period: "THREE_MONTH",
                timeField: "createdAt",
                filterQuery: "",
                dataType: "VIDEO",
                loadingState: {
                    modules: true,
                    odds: true,
                    dataItems: true
                },
                statistic: {
                    moduleInfo: {},
                    oddInfo: [],
                    dataTypeInfo: [],
                    bagInfo: {
                        totalBagFile: 0,
                        totalTimeRecorded: 0,
                        size: {
                            totalSize: 0,
                            maxSize: 0,
                            minSize: 0
                        }
                    },
                    imageInfo: {
                        totalImages: 0,
                        imagesAnnotated: 0,
                    }
                },
                attributes: {
                    nameClass: [],
                    totalAnnotated: 0,
                    distribution: []
                },
                models: [],
            };
            return state;
        })
    },

    extraReducers: {
        [fetchModuleStatsData.fulfilled]: (state, {payload}) => {
            state.statistic.moduleInfo = payload
        },
        [fetchOddStatsData.fulfilled]: (state, {payload}) => {
            state.statistic.oddInfo = payload
        },
        [fetchDataTypeStatsData.fulfilled]: (state, {payload}) => {
            state.statistic.dataTypeInfo = payload
        },
     }
});

export const {setDuration, setTimeField, setFilterQuery, setDataType, showChartLoader, hideChartLoader, cleanUp} = dashboardSlice.actions;

export default dashboardSlice.reducer;
import {configureStore} from '@reduxjs/toolkit';
import loadingReducer, {hideLoader, showLoader} from './slice/LoadingSlice';
import workspaceReducer from './slice/WorkspaceSlice';
import dataItemReducer from './slice/DataItemSlice';
import searchResultSetReducer from './slice/DataItemSearchResultSetSlice'
import workspaceDetailsReducer from './slice/WorkspaceDetailsSlice'
import modelReducer from './slice/ModelSlice';
import dashboardReducer, {hideChartLoader, showChartLoader} from './slice/DashboardSlice';
import userReducer from './slice/UserSlice'
import inferenceRequestSlice from './slice/InferenceRequestSlice'
import labelReducer from './slice/LabelSlice';
import errorSlice, {setError} from "./slice/ErrorSlice";


const ignoreLoadingList = ["inference-request/update-status/pending"];

const dashboardLoadingList = ["dashboard/modules", "dashboard/odds", "dashboard/data-items"];

const loadingMiddleware = (store) => {
    const {dispatch} = store;
    return next => action => {
        if (ignoreLoadingList.indexOf(action.type) > -1) {
            dispatch(hideLoader());
            return next(action);
        }

        if (dashboardLoadingList.some(s => action.type.includes(s))) {
            let loading = false;
            let chart = "";
            if (action.type.endsWith('/pending')) {
                loading = true;
            } else if (action.type.endsWith('/fulfilled') || action.type.endsWith("/error") || action.type.endsWith("/rejected")) {
                loading = false;
            }
            if (action.type.includes("modules")) {
                chart = "modules";
            }
            if (action.type.includes("odds")) {
                chart = "odds";
            }
            if (action.type.includes("data-items")) {
                chart = "dataTypes";
            }
            if (loading) {
                dispatch(showChartLoader(chart));
            } else {
                dispatch(hideChartLoader(chart));
            }
        }
        if (action.type.endsWith('/pending')) {
            dispatch(showLoader());
        } else if (action.type.endsWith('/fulfilled') || action.type.endsWith("/error") || action.type.endsWith("/rejected")) {
            setTimeout(() => dispatch(hideLoader()), 750);
        }
        return next(action);
    }
};

const errorMiddleware = (store) => {
    const {dispatch} = store;
    return next => action => {
        if (ignoreLoadingList.indexOf(action.type) > -1) {
            return next(action);
        }
        if (action.type.endsWith("/error") || action.type.endsWith("/rejected")) {
            if (!action.payload) {
                let payload = {error: action.error.name, status: 0, message: action.error.message}
                dispatch(setError(payload));
            } else {
                dispatch(setError(action.payload));
            }
            dispatch(hideLoader());
        }
        return next(action);
    }
};

const store = configureStore({
    reducer: {
        loading: loadingReducer,
        workspaceState: workspaceReducer,
        dashboard: dashboardReducer,
        modelState: modelReducer,
        userState: userReducer,
        inferenceRequest: inferenceRequestSlice,
        labelState: labelReducer,
        dataItemState: dataItemReducer,
        searchResultSetState: searchResultSetReducer,
        workspaceDetailsState: workspaceDetailsReducer,
        errorState: errorSlice
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(loadingMiddleware, errorMiddleware)
});

export default store;
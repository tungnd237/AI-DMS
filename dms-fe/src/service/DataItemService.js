import {dmsApiClient} from './HttpClient'

export const getDataItems = async ({currentPage, currentPageSize}) => {
    const {data} = await dmsApiClient.get('/data-items', {
        params: {
            pageNumber: currentPage,
            pageSize: currentPageSize
        }
    });
    return data.data;
};

export const createDataItem = async ({request}) => {
    const {location, metadata, storageType, skipExistenceCheck} = request;

    const {data} = await dmsApiClient.post('/data-items', {
        location: location,
        metadata: metadata,
        storageType: storageType,
        skipExistenceCheck: skipExistenceCheck
    });
    return data.data;
};

export const searchDataItems = async (filter) => {
    const {
        type,
        tags,
        location,
        cameraType,
        startDate,
        endDate,
        searchQuery,
        annotated,
        pageNumber,
        pageSize,
        moduleStatus,
        timeField
    } = filter;
    let finalSearchQuery = searchQuery;
    if (cameraType) {
        let cameraQuery = "metadata.cameraType = \"" + cameraType + "\"";
        finalSearchQuery += ", " + cameraQuery;
    }
    const {data} = await dmsApiClient.post('/data-items/search', {
        type,
        tags,
        location,
        annotated,
        timeField,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        searchQuery: finalSearchQuery,
        moduleStatus: moduleStatus,
        pageNumber,
        pageSize
    });
    return data.data;
};

export const searchDataItemsAdvanced = async (filter, {rejectWithValue}) => {
    const {inferenceNames, inferenceSearchQuery, pageNumber, pageSize} = filter;
    try {
        const {data} = await dmsApiClient.post('/data-items/search/advanced', {
            inferenceNames: inferenceNames,
            inferenceMetadataQuery: inferenceSearchQuery,
            pageNumber,
            pageSize
        });
        console.log("response", data);

        if (data.status === 200 || data.status === 201 || data.status === 202) {
            return data.data;
        }
        return rejectWithValue(data);

    } catch (e) {
        console.log(e.response.data)
        console.log(e.response.status)

        return rejectWithValue(e.response.data)
    }
};


export const createWorkspace = async (createRequest) => {
    const {data} = await dmsApiClient.post('/workspaces', createRequest);
    return data.data;
}

export const saveSearch = async (filter) => {
    const {
        searchName,
        searchNotes,
        type,
        startDate,
        endDate,
        moduleStatus,
        searchFilter
    } = filter;
    let finalSearchQuery = searchFilter.searchQuery;
    if (searchFilter.cameraType) {
        let cameraQuery = "metadata.cameraType = \"" + searchFilter.cameraType + "\"";
        finalSearchQuery += ", " + cameraQuery;
    }
    console.log(finalSearchQuery);

    const {data} = await dmsApiClient.post('/data-items/search/save', {
        type: searchFilter.type,
        location: searchFilter.location,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        moduleStatus: moduleStatus,
        searchQuery: finalSearchQuery,
        searchResultName: searchName,
        notes: searchNotes
    });
    return data.data;
};

export const getSearchResultSet = async ({name, currentPage, currentPageSize}) => {
    const {data} = await dmsApiClient.post('/workspaces/search', {
        name: name,
        pageNumber: currentPage,
        pageSize: currentPageSize
    });
    return data.data;
};

let sendSearchUrl = ({searchId}) => `/workspaces/${searchId}/tasks`;
export const sendResultSetToCVAT = async ({
                                              searchId,
                                              name,
                                              projectId,
                                              segmentSize,
                                              imageQuality,
                                              prelabel,
                                              inference,
                                              modules
                                          }) => {
    const {data} = await dmsApiClient.post(sendSearchUrl({searchId}), {
        name: name,
        project_id: projectId,
        segment_size: segmentSize,
        image_quality: imageQuality,
        prelabel: prelabel,
        inference: inference,
        modules: modules
    });
    return data.data;
};

let workspaceDetailsUrl = ({workspaceId}) => `/workspaces/${workspaceId}/tasks`;
export const getWorkspaceDetails = async ({workspaceId, pageNumber, pageSize}) => {
    const {data} = await dmsApiClient.get(workspaceDetailsUrl({workspaceId}), {
        params: {
            pageNumber: pageNumber,
            pageSize: pageSize
        }
    });
    return data.data;
};

let workspaceItemsUrl = ({workspaceId}) => `/workspaces/${workspaceId}/items`;
export const getWorkspaceItems = async ({workspaceId, pageNumber, pageSize}) => {
    const {data} = await dmsApiClient.get(workspaceItemsUrl({workspaceId}), {
        params: {
            pageNumber: pageNumber,
            pageSize: pageSize
        }
    });
    return data.data;
};


let downloadPrelabelsUrl = ({
                                workspaceId,
                                inference
                            }) => `/workspaces/${workspaceId}/inferences/${inference}`;
export const downloadPrelabels = async ({workspaceId, inference}) => {
    const response = await dmsApiClient.get(downloadPrelabelsUrl({workspaceId, inference}), {
        responseType: 'blob'
    });
    return {blob: response.data, headers: response.headers};

};


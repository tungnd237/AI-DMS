import {dmsApiClient} from './HttpClient'

export const getInferenceRequests = async (filter) => {
    const {pageNumber, pageSize, startDate, endDate, modelIds, status} = filter;
    const {data} = await dmsApiClient.get('/inferences', {
        params: {
            startDate: startDate,
            endDate: endDate,
            modelIds: modelIds.toString(),
            status: status,
            pageNumber: pageNumber,
            pageSize: pageSize
        }
    });
    return data.data;
};

let inferenceDetailsUrl = ({inferenceId}) => `/inferences/${inferenceId}`;
export const getInferenceById = async (inferenceId) => {
    const {data} = await dmsApiClient.get(inferenceDetailsUrl({inferenceId}));
    return data.data;
};

let inferenceItemsUrl = ({inferenceId}) => `/inferences/${inferenceId}/items`;
export const getInferenceItems = async ({inferenceId, pageNumber, pageSize}) => {
    const {data} = await dmsApiClient.get(inferenceItemsUrl({inferenceId}),
        {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        }
    );
    return data.data;
};



import {dmsApiClient, httpClient} from './HttpClient'

export const getModules = async ({currentPage, currentPageSize}) => {
    const {data} = await dmsApiClient.get('/modules', {
        params: {
            pageNumber: currentPage,
            pageSize: currentPageSize
        }
    });
    return data.data;
};


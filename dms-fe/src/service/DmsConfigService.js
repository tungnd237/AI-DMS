import {dmsApiClient} from './HttpClient'


export const getModelTags = async (filter) => {
    const {data} = await dmsApiClient.get('/configs/model-tags', );
    return data.data;
};

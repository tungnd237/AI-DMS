import {modelServiceClient} from './HttpClient'

export const createModel = async ({
                                      modelName,
                                      modelVersion,
                                      modelType,
                                      isPublic, isGpu, isSdk,
                                      operatingSystem,
                                      cudaVersion, cudnnVersion,
                                      module,
                                      user,
                                      userInfo,
                                      url,
                                      ...properties
                                  }, file) => {
    await modelServiceClient.post('/models', {
        modelName: modelName,
        modelVersion: modelVersion,
        modelType: modelType.name,
        isPublic: isPublic,
        isGpu: isGpu,
        url: url
    });
};

export const getModels = async (filter) => {
    const {model, modelType, operatingSystem, pageNumber, pageSize, module, user, tag} = filter;
    const {data} = await modelServiceClient.get('/models', {
        params: {
            tag: tag,
            pageNumber: pageNumber,
            pageSize: pageSize
        }
        // modelName: model.modelName,
        // modelType: modelType.id,
        // operatingSystem: operatingSystem.id,
        // module: module.id,
        // user,
    });
    return data.data;
};

export const getModelsByModule = async (moduleId) => {
    const {data} = await modelServiceClient.get('/v1/models/modules/' + moduleId);
    return data.data;
};
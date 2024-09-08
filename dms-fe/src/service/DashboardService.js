import { dmsApiClient} from './HttpClient';

const fetchModuleStats = async ({type, period, startDate, endDate, timeField, filterQuery}) => {
    const {data} = await dmsApiClient.get('/stats/modules', {
        params: {
            type: type,
            period: period,
            startDate: startDate,
            endDate: endDate,
            timeField: timeField,
            filterQuery: filterQuery
        }
    });
    return data.data;
};

const fetchOddStats = async ({type, period, startDate, endDate, timeField, filterQuery}) => {
    const {data} = await dmsApiClient.get('/stats/odds', {
        params: {
            type: type,
            period: period,
            startDate: startDate,
            endDate: endDate,
            timeField: timeField,
            filterQuery: filterQuery

        }
    });
    return data.data;
};

const fetchDataTypeStats = async ({period, startDate, endDate, timeField, filterQuery, type}) => {
    const {data} = await dmsApiClient.get('/stats/data-items', {
        params: {
            period: period,
            startDate: startDate,
            endDate: endDate,
            timeField: timeField,
            filterQuery: filterQuery,
            type: type
        }
    });
    return data.data;
};

export {
    fetchModuleStats,
    fetchOddStats,
    fetchDataTypeStats
}
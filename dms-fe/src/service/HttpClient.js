import axios from 'axios';
import {toast} from "react-toastify";

const createAxiosResponseInterception = (axiosInstance) => {
    const interceptor = axiosInstance.interceptors.response.use(
        response => {
            //maybe process here
            return response;
        },
        error => {
            console.log(error)
            //do some global magic with error and pass back to caller
            const response = error.response;
            let errorCode = 0;
            let errorMessage = "Network error";
            if (response) {
                errorCode = response.data.status
                errorMessage = response.data.msg ? response.data.msg : "Unknown error"
            }
            toast.error(`${errorCode}: ${errorMessage}`)
            return Promise.reject(error);
        }
    );
}

const httpClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

const dmsApiClient = axios.create({
    baseURL: process.env.REACT_APP_DMS_DP_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

const modelServiceClient = axios.create({
    baseURL: process.env.REACT_APP_DMS_DP_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});


function setKeycloakToken(token) {
    httpClient.defaults.headers.common['Authorization'] = getBearerToken(token);
    modelServiceClient.defaults.headers.common['Authorization'] = getBearerToken(token);
    dmsApiClient.defaults.headers.common['Authorization'] = getBearerToken(token);

}

const getBearerToken = (token) => `Bearer ${token}`;

createAxiosResponseInterception(dmsApiClient);

export {
    httpClient,
    dmsApiClient,
    modelServiceClient,
    setKeycloakToken
};
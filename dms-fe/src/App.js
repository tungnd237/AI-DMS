import React, {useEffect} from "react";
import {BrowserRouter as Router} from "react-router-dom";
import {Provider, useDispatch} from 'react-redux'
import store from './duck/store';
import './css/sidebar.css';
import LoadingOverlay from "./components/common/loader/LoaderOverlay";
import AppSideBar from "./components/sidebar/Sidebar";
import AppRouteDeclaration from "./components/routes/AppRouteDeclaration";
import Keycloak from 'keycloak-js';
import {ReactKeycloakProvider, useKeycloak} from '@react-keycloak/web'
import {setKeycloakToken} from "./service/HttpClient";
import {ModalProvider} from "react-modal-hook";
import {ToastContainer} from 'react-toastify';
import ErrorHandler from "./components/ErrorHandler";
import axios from "axios";

const keycloak = Keycloak({
    url: process.env.REACT_APP_SSO_URL,
    realm: process.env.REACT_APP_SSO_REALM,
    clientId: process.env.REACT_APP_CLIENT_ID,
    onLoad: 'login-required',
});

function MainApp() {

    const dispatch = useDispatch();


    const {keycloak, initialized} = useKeycloak();

    useEffect(() => {
        if (keycloak.authenticated) {
            // dispatch(fetchAnnotationProject(null));
        }
    }, [keycloak.authenticated, dispatch]);

    if (!keycloak.authenticated || !initialized || !keycloak.token) {
        return <div
            className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"/>
            <h2 className="text-center text-white text-xl font-semibold">Loading...</h2>
            <p className="w-1/3 text-center text-white">This may take a few seconds, please don't close this page.</p>
        </div>;
    }


    setKeycloakToken(keycloak.token);

    return <div className="w-full flex overflow-auto h-auto">
        <LoadingOverlay/>
        <ErrorHandler/>
        <AppSideBar logout={keycloak.logout}/>
        <AppRouteDeclaration/>
        <ToastContainer autoClose={2000}/>
    </div>;
}

function App() {
    const initOptions = {onLoad: 'login-required'};

    const onKeycloakTokens = (keycloak) => {
        setKeycloakToken(keycloak.token);
    }

    axios.interceptors.response.use(
        response => {
            //maybe process here
            return response;
        },
        error => {
            //do some global magic with error and pass back to caller
            console.log("global error")
            return Promise.reject(error);
        }
    );

    return (
        <Provider store={store}>
            <ModalProvider>
                <ReactKeycloakProvider authClient={keycloak}
                                       initOptions={initOptions}
                                       onTokens={onKeycloakTokens}>
                    <Router>
                        <MainApp/>
                    </Router>
                </ReactKeycloakProvider>
            </ModalProvider>
        </Provider>
    );
}

export default App;

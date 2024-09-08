import React, {useEffect} from 'react';
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {setError} from "../duck/slice/ErrorSlice";

const ErrorMessage = ({error, message, status}) => (
    <div>
        <h1>{status}: {error}</h1>
        {message}
    </div>
)

const ErrorHandler = ({children}) => {
    const {
        error,
        message,
        status
    } = useSelector(state => state.errorState);
    const dispatch = useDispatch();

    useEffect(() => {
        toast.onChange(payload => {
            if (payload.status === "removed" && payload.type === toast.TYPE.ERROR) {
                dispatch(setError({status: -1}));
            }
        })
    }, [])
    return (status >= 0) && toast.error(ErrorMessage({error, message, status}));

};

export default ErrorHandler;

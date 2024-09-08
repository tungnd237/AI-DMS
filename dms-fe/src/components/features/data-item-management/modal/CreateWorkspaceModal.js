import React, {useState} from "react";
import Input from "../../../common/form/input";
import Button from "../../../common/button/Button";
import {useDispatch} from "react-redux";
import {hideLoader, showLoader} from '../../../../duck/slice/LoadingSlice';
import ModalWrapper from "../../../common/modal/Modal";
import {createWorkspace} from "../../../../service/DataItemService";
import {clearAll, getItems} from "../../../../service/CartService";


const CreateWorkspaceModal = ({visible, setVisible}) => {
    const dispatch = useDispatch();
    const initialState = {
        name: '',
        notes: '',
    };

    const [unsavedWorkspace, setUnsavedWorkspace] = useState({
        ...initialState,
    });

    const shouldEnableSaveButton = () => {
        return unsavedWorkspace.name;
    };

    const onChangeForm = (e) => {
        setUnsavedWorkspace({
            ...unsavedWorkspace,
            [e.target.name]: e.target.value
        });
    };

    const onSubmit = () => {
        dispatch(showLoader());
        getItems().then(items => {
            let itemIds = items.map(item => item.id);
            let createRequest = {
                ...unsavedWorkspace,
                input: itemIds
            }
            setVisible(false);
            createWorkspace(createRequest).finally(() => {
                clearAll();
                dispatch(hideLoader());

            });
            setUnsavedWorkspace({
                ...initialState
            });
        });

    };

    return (
        <ModalWrapper className="h-1/5 bg-gray-100"
                      isOpen={visible}>
            <header className="flex justify-end">
                <button
                    onClick={() => setVisible(false)}
                    className="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover: hover:text-gray-700">
                    <svg className="w-4 h-4"
                         fill="currentColor"
                         viewBox="0 0 20 20"
                         role="img" aria-hidden="true">
                        <path
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd" fillRule="evenodd"/>
                    </svg>
                </button>
            </header>
            <div className="bg-white shadow-md rounded px-4 pt-6 flex flex-col my-2 h-full">
                <div>
                    <div className="md:flex mb-6">
                        <div className="md:w-1/3 px-3 mb-6 md:mb-0">
                            <Input
                                label="Name"
                                placeHolder="Name"
                                name="name"
                                value={unsavedWorkspace.name}
                                onChange={onChangeForm}
                            />
                        </div>
                        <div className="md:w-1/3 px-3 mb-6 md:mb-0">
                            <Input
                                label="Notes"
                                placeHolder="Notes"
                                name="notes"
                                value={unsavedWorkspace.notes}
                                onChange={onChangeForm}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <footer
                className="py-4 my-4 flex-1 flex flex-col items-center justify-end px-6 py-3 -mx-6 -mb-4 space-y-4 sm:space-y-0 sm:space-x-6 sm:flex-row bg-gray-50 dark:bg-gray-800">
                <button
                    onClick={() => setVisible(false)}
                    className="mx-2 w-full px-5 py-3 text-sm font-medium leading-5 text-white text-gray-700 transition-colors duration-150 border border-gray-300 rounded-lg dark:text-gray-400 sm:px-4 sm:py-2 sm:w-auto active:bg-transparent hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:outline-none focus:shadow-outline-gray">
                    Cancel
                </button>
                <Button onClick={onSubmit} disabled={!shouldEnableSaveButton()}>Save</Button>
            </footer>
        </ModalWrapper>
    );
};

export default CreateWorkspaceModal;
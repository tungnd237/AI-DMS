import React, {useState} from "react";
import Input from "./form/input";
import Button from "./button/Button";

const Form = ({tags, createWorkspace}) => {
    const [newWorkspace, setNewWorkspace] = useState({
        workspaceName: '',
        modelName: '',
        modelVersion: '',
        testingSet: 100,
        trainingSet: 0,
        numberOfImages: '',
        attributes: []
    });

    const isEnabled = Object.keys(newWorkspace).filter(key => key !== 'testingSet'  && key !== 'trainingSet').every(key => newWorkspace[key] && newWorkspace[key].length > 0);

    const onChangeForm = (e) => {
        let updatedState;
        if(e.target.name === 'testingSet') {
            updatedState = {
                testingSet: e.target.value,
                trainingSet: 100 - parseInt(e.target.value)
            };
        } else if (e.target.name === 'trainingSet') {
            updatedState = {
                trainingSet: e.target.value,
                testingSet: 100 - parseInt(e.target.value)
            };
        } else {
            updatedState = {
                [e.target.name]: e.target.value
            };
        }
        setNewWorkspace({
            ...newWorkspace,
            ...updatedState
        });
    };

    const onTagSelected = (config) => {
        if(newWorkspace.attributes.includes(config.id)) {
            setNewWorkspace({
                ...newWorkspace,
                attributes: newWorkspace.attributes.filter(tag => tag !== config.id)
            })
        } else {
            setNewWorkspace({
                ...newWorkspace,
                attributes: [...newWorkspace.attributes, config.id]
            })
        }
    };

    const onSubmit = () => {
        createWorkspace(newWorkspace);
        setNewWorkspace({
            workspaceName: '',
            modelName: '',
            modelVersion: '',
            testingSet: 100,
            trainingSet: 0,
            numberOfImages: '',
            attributes: []
        });
    };

    const renderFilters = () => {
        return tags.map((config) => {
            let element;
            const isSelected = newWorkspace.attributes.includes(config.id);
            const className = `cursor-pointer ml-5 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 ${!isSelected ? 'bg-blue-200 text-blue-700': 'bg-green-200 text-green-700'} rounded-full`;
            element =(
                <div className={className}
                     onClick={() => onTagSelected(config)
                     }
                >
                    {config.name}
                </div>
            );
            return (
                <div role="none" key={config.id} className="inline-block">
                    {element}
                </div>
            );
        });
    };

    return <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
        <h1>Define Scenario</h1>
        <div className="mx-3 md:flex mb-6">
            <div className="md:w-1/3 px-3 mb-6 md:mb-0">
                <Input
                    label="Workspace Name"
                    placeHolder="Workspace Name"
                    name="workspaceName"
                    value={newWorkspace.workspaceName}
                    onChange={onChangeForm}
                />
            </div>
            <div className="md:w-1/3 px-3 mb-6 md:mb-0">
                <Input
                    label="Model Name"
                    placeHolder="Model Name"
                    name="modelName"
                    value={newWorkspace.modelName}
                    onChange={onChangeForm}
                />
            </div>
            <div className="md:w-1/3 px-3 mb-6 md:mb-0">
                <Input
                    label="Model Version"
                    placeHolder="Model Version"
                    name="modelVersion"
                    value={newWorkspace.modelVersion}
                    onChange={onChangeForm}
                />
            </div>
        </div>
        <div className="mx-3 md:flex mb-6">
            <div className="md:w-1/3 px-3 mb-6 md:mb-0">
                <Input
                    label="Testing Set (%)"
                    placeHolder="Testing Set"
                    name="testingSet"
                    inputModeSetting={{type: 'number'}}
                    value={newWorkspace.testingSet}
                    onChange={onChangeForm}
                />
            </div>
            <div className="md:w-1/3 px-3 mb-6 md:mb-0">
                <Input
                    label="Training Set (%)"
                    placeHolder="Training Set"
                    name="trainingSet"
                    inputModeSetting={{type: 'number'}}
                    value={newWorkspace.trainingSet}
                    onChange={onChangeForm}
                />
            </div>
            <div className="md:w-1/3 px-3 mb-6 md:mb-0">
                <Input
                    label="Number of Images"
                    placeHolder="Number of Images"
                    name="numberOfImages"
                    inputModeSetting={{type: 'number'}}
                    value={newWorkspace.numberOfImages}
                    onChange={onChangeForm}
                />
            </div>
        </div>
        <div className="-mx-3 md:flex mb-6 flex-wrap">
            {renderFilters()}
        </div>
        <div className="-mx-3 md:flex mb-6 justify-end">
            <Button onClick={onSubmit} disabled={!isEnabled}>Save</Button>
        </div>
    </div>
};

export default Form;
import React from 'react';

const Input = ({label, placeHolder, value, onChange, name, inputModeSetting = {type: 'text'}, disabled}) => {
    return <label className="block">
        <span className="text-gray-700">{label}</span>
        <input
               className="mx-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
               placeholder={placeHolder}
               value={value}
               name={name}
               disabled={disabled}
               onChange={onChange}
               {...inputModeSetting}
        />
    </label>
};

export default Input;
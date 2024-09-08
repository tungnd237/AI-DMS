import React from "react";

const Block = ({title, value, icon, className}) => {

    return (
        <div className={className}>
            <div style={{height: '50px'}}>
                <span className="md:text-sm lg:text-base text-gray-600">{title}</span>
            </div>
            <div className="flex flex-row">
                <div className="py-4">
                    {icon}
                </div>
                <span className="text-blue-800 md:text-2xl lg:text-3xl m-auto">{value}</span>
            </div>
        </div>
    )
}

export default Block
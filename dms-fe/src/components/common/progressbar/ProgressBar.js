import React from "react";

const ProgressBar = ({value}) => {
    return (
        <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between"><div>
                </div>
                    <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-600">
                            {value}
                        </span>
                    </div>
                </div>
            <div className="overflow-hidden h-3 mb-4 text-xs flex rounded bg-blue-100">
                <div style={{ width: value }}
                     className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600">
                </div>
            </div>
        </div>
    )
}

export default ProgressBar;
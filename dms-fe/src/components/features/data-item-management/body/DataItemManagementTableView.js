import React from "react";
import DynamicTableView from "../../../common/table/DynamicTableView";

const DataItemManagementTableView = ({columnConfigs, dataItems, columnVisibility, pageNumber, pageSize}) => {
    return (
        <div>
            <DynamicTableView elements={dataItems}
                              columnConfigs={columnConfigs}
                              columnVisibility={columnVisibility}
                              pageNumber={pageNumber}
                              pageSize={pageSize}/>
        </div>
    )
};

export default DataItemManagementTableView;
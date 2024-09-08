import {Navigate, Route, Routes} from "react-router-dom";
import React from "react";
import DashboardComponent from "../features/dashboard/DashboardComponent";
import DataItemManagementComponent from "../features/data-item-management/DataItemManagementComponent";

function AppRouteDeclaration() {
    return <div className="flex flex-col flex-1 w-4/5 border-l-4 h-auto overflow-auto p-6">
        <Routes>
            <Route exact path="/" element={<DashboardComponent/>}>
            </Route>
            <Route exact path="/data-items" element={<DataItemManagementComponent/>
            }>
            </Route>
            <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
    </div>;
}

export default AppRouteDeclaration;
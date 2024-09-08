import React from 'react'
import {NavLink, useLocation} from "react-router-dom";
import {useKeycloak} from "@react-keycloak/web";

const NavigationRoute = ({path, name, icon, roles}) => {
    const location = useLocation();
    const { keycloak } = useKeycloak();

    const isActive = location.pathname === path;
    const classNameDefault = "inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100";

    const isAuthorized = (roles) => {
        if (roles && roles.length === 0) {
            return true;
        }

        if (keycloak && roles) {
            return roles.some(r => {
                const realm =  keycloak.hasRealmRole(r);
                const resource = keycloak.hasResourceRole(r);
                return true;
                // return realm || resource;
            });
        }
        return false;
    }

    return <>
        {
            isAuthorized(roles) ? (
                <div className="relative px-4 py-3 cursor-pointer">
                    {isActive && <span className="absolute inset-y-0 left-0 w-1 bg-blue-500 rounded-tr-lg rounded-br-lg"
                                   aria-hidden="true"/>}
                    <NavLink
                        to={path}
                        className={`${classNameDefault} ${isActive ? 'text-gray-800' : ''}`}
                        href="#"
                    >
                        {icon}
                        <span className="ml-4">{name}</span>
                    </NavLink>
                </div>
            ) : <></>
        }
    </>
};

export default NavigationRoute;
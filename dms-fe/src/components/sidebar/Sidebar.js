import NavigationRoute from "../routes/NavigationRoute";
import React, {useEffect, useState} from "react";
import {useKeycloak} from "@react-keycloak/web";
import {useDispatch} from "react-redux";
import {setUser} from "../../duck/slice/UserSlice";
import {Roles} from '../../constants/RolesConstant';
import {useLiveQuery} from "dexie-react-hooks";
import {getCount} from "../../service/CartService";
import "../../css/cart.css"
import PreviewPicksModal from "../features/data-item-management/modal/PreviewPicksModal";
import IconButton from '@mui/material/IconButton';
import {Avatar, Badge, Tooltip} from "@mui/material";
import logo from "../../images/logo-vinai.png"
import DescriptionIcon from '@mui/icons-material/Description';
import BarChartIcon from '@mui/icons-material/BarChart';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import LogoutIcon from '@mui/icons-material/Logout';

function AppSideBar({logout}) {
    const dispatch = useDispatch();
    const [configurations, setConfigurations] = useState([]);
    const [userInfo = {
        id: "",
        name: "",
        email: ""
    }, setUserInfo] = useState({});
    const {name} = userInfo
    const {keycloak} = useKeycloak();

    useEffect(() => {
        keycloak.loadUserInfo().then(user => {
            setUserInfo(user);
            dispatch(setUser(user));
        });

        const configs = [
            {
                roles: [Roles.vinaiDev, Roles.vinaiTest, Roles.vinaiUser, Roles.vinaiAiEngineer, Roles.vincssAudit],
                path: '/',
                name: 'Dashboard',
                icon: <BarChartIcon/>
            },
            {
                roles: [Roles.vinaiDev, Roles.vinaiTest, Roles.vinaiAiEngineer],
                path: '/data-items',
                name: 'Explore Data Items',
                icon: <FindInPageIcon/>
            },
        ];

        setConfigurations(configs);
    }, [keycloak, dispatch]);

    const [openPreviewModal, setOpenPreviewModal] = useState(false);
    const openPreviewPicksModal = (item) => {
        setOpenPreviewModal(true);
    };


    return <div id="sidebar"
                className="hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0 text-gray-500 h-screen">
        <div className="mt-2">
            <div className="my-2 md:my-0">
                <img className="p-8" alt=""
                     src={logo}/>
            </div>
            <div className="my-2 md:my-0">
                <div className="text-center py-4 px-2 flex flex-row">
                    <div className="flex text-center justify-items-center">
                        <Avatar>{name?.charAt(0).toUpperCase()}</Avatar>
                    </div>
                    <div className="text-left text-sm m-auto">
                        <p className="py-2 text-blue-800 font-bold">{name}</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
                <div className="flex relative px-4 py-3 cursor-pointer ">
                    <Tooltip title="Item Box">
                        <IconButton onClick={() => openPreviewPicksModal()}>
                            <Badge badgeContent={useLiveQuery(() => getCount())} color="primary" showZero>
                                <DescriptionIcon fontSize={"large"}/>
                            </Badge>
                        </IconButton>
                    </Tooltip>

                </div>
            </div>

            {
                configurations.map((conf) =>
                    <NavigationRoute key={conf.path}
                                     path={conf.path}
                                     name={conf.name}
                                     roles={conf.roles}
                                     icon={conf.icon}/>
                )
            }
            <div
                className="flex relative px-4 py-3 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100"
                onClick={logout}>
                <LogoutIcon/>
                <button
                    className="inline-flex items-center ml-4 w-full text-sm font-semibold transition-colors duration-150">
                    Sign out
                </button>
            </div>
        </div>
        {openPreviewModal &&
            <PreviewPicksModal visible={openPreviewModal} setOpenPreviewModal={setOpenPreviewModal}/>}
    </div>
}

export default AppSideBar;
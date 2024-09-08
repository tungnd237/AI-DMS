import React, {useEffect, useState} from 'react';
import Pagination from '../../common/pagination/Pagination';
import DataItemManagementHeader from "./header/DataItemManagementHeader";
import {DataItemTypes, ModuleStatus} from "../../../constants/DataItemConstant";

import ReactTooltip from 'react-tooltip'
import '../../../css/tooltip/tooltip.css';
import {addItemBulk} from "../../../service/CartService";
import ReactJson from "react-json-view";
import ImageModal from "../../image/ImageModal";
import moment from "moment";
import {Button, Chip, IconButton, Stack, Tooltip} from "@mui/material";
import LabeledImage from "../../image/labled-image/LabaledImage";
import {getAllPredictionsLabels} from "../../../utils/Utils";
import InventoryIcon from '@mui/icons-material/Inventory';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import PreviewIcon from '@mui/icons-material/Preview';
import thumbnail from "../../../images/thumbnail_na.jpg"
import TableConfigMenu from "../../common/TableConfigMenu";
import DataItemManagementTableView from "./body/DataItemManagementTableView";
import DataItemGridView from "./body/DataItemGridView";

const DataItemManagementView = (
    {
        dataItems,
        totalPages,
        totalElements,
        currentPage,
        currentPageSize,
        updateCurrentPage,
        filter,
        setFilter,
        clearFilter,
        searchDataItems,
        searchDataItemsAdvanced,
        isDownloading,
        percentage,
        executeDownload,
        allowDownload,
        updateAdvancedSearch
    }) => {
    const headerProps = {
        filter,
        setFilter,
        clearFilter,
        updateCurrentPage,
        searchDataItems,
        searchDataItemsAdvanced,
        isDownloading,
        percentage,
        executeDownload,
        allowDownload,
        totalElements,
        updateAdvancedSearch
    }

    const [enableGridView, setEnableGridView] = useState(true);

    const [imageModalObj, setImageModalObj] = useState({show: false});

    const handleCardClick = (item, e, src) => {
        e.preventDefault();
        setImageModalObj({...item, show: true, src});
    };

    const closeImageModal = (e) => {
        e.preventDefault();
        setImageModalObj({show: false});
    };

    const [pickState, setPickState] = useState(
        {
            checkedAll: false,
            tempPickedState: {},
            picked: []
            // items: JSON.parse(localStorage.getItem("items")) || []
        }
    );

    useEffect(() => {
        const currentTempPickedState = pickState.tempPickedState;
        let tempPickedState = {}
        dataItems.forEach((item) => {
            tempPickedState[item.id] = Object.assign({}, item);
            tempPickedState[item.id].selected = false;
        })

        setPickState({
            ...pickState,
            checkedAll: false,
            tempPickedState: {...currentTempPickedState, ...tempPickedState}
        });
    }, [dataItems])

    const toggleCheckAll = (e) => {
        let newTempPickedState = pickState.tempPickedState;
        // iterate through current page
        dataItems.forEach((item) => {
            newTempPickedState[item.id] = Object.assign({}, item);
            newTempPickedState[item.id].selected = e.target.checked;
        })
        setPickState({
            checkedAll: e.target.checked,
            tempPickedState: newTempPickedState,
            picked: Object.entries(newTempPickedState).filter(([k, v]) => v.selected === true).map(([k, v]) => v)
        });
    }

    const toggleItem = (e, row) => {
        // set item
        let newTempPickedState = Object.assign({}, pickState.tempPickedState);
        let item = Object.assign({}, pickState.tempPickedState[row.id] || row);
        item.selected = e.target.checked;
        newTempPickedState[row.id] = item

        // set checkedAll
        let pickedList = Object.entries(newTempPickedState).filter(([k, v]) => v.selected === true).map(([k, v]) => v)
        setPickState({
            checkedAll: pickedList.length === currentPageSize,
            tempPickedState: newTempPickedState,
            picked: pickedList
        })
    }

    const addPicksToCart = () => {
        let picks = pickState.picked;
        if (picks.length > 0)
            addItemBulk(picks).then(r => {
                // clear state
                setPickState({
                    checkedAll: false,
                    picked: [],
                    tempPickedState: []
                })
            })

    }

    const isItemPicked = (itemId) => {
        return pickState.tempPickedState[itemId] && pickState.tempPickedState[itemId].selected === true
    }

    const [columnVisibility, setColumnVisibility] = useState(new Array(15).fill(true));

    useEffect(() => {
        const localVisibility = window.localStorage.getItem("data-item-column-view");
        const visibility = JSON.parse(localVisibility) || new Array(15).fill(true);
        setColumnVisibility(visibility);
    }, []);

    useEffect(() => {
        window.localStorage.setItem("data-item-column-view", JSON.stringify(columnVisibility));
    }, [columnVisibility]);

    const header = <DataItemManagementHeader {...headerProps}/>;
    const columnConfigs = React.useMemo(() => [
        {
            Header: x => {
                return (
                    <input
                        id="masterCheck"
                        type="checkbox"
                        className="checkbox"
                        checked={pickState.checkedAll === true}
                        onChange={toggleCheckAll}
                    />
                );
            },
            id: "checkbox",
            width: 50,
            accessor: (item) => {
                return (
                    <input
                        type="checkbox"
                        className="checkbox"
                        checked={pickState.tempPickedState.hasOwnProperty(item.id) && pickState.tempPickedState[item.id].selected === true}
                        onChange={(e) => toggleItem(e, item)}
                    />
                );
            },
        },
        {
            Header: 'ID',
            id: 'id',
            accessor: 'id',
            maxWidth: 100,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            direction: 'rtl',
            overflow: 'hidden',
        },

        {
            Header: 'Name',
            id: 'name',
            accessor: (row) => {
                return (
                    <Tooltip title={row.location} placement="bottom-start">
                        <span>{row.name}</span>
                    </Tooltip>
                )
            },
            maxWidth: 200,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
        },
        {
            Header: 'Created At',
            id: 'createdAt',
            accessor: (originalRow) => moment.unix(originalRow.createdAt / 1e3).format('DD MMM YYYY hh:mm a'),
        },
        {
            Header: 'Collected At',
            id: 'collectedAt',
            accessor: (originalRow) => moment.unix(originalRow.metadata.collectedTime).format('DD MMM YYYY hh:mm a'),
        },
        {
            Header: 'Preview',
            id: 'preview',
            maxWidth: 500,
            minWidth: 300,
            accessor: (data) => {
                if (data.type === DataItemTypes[0]) {
                    let annotations = getAllPredictionsLabels(data);
                    return (
                        <div
                            onClick={(e) =>
                                handleCardClick(
                                    data,
                                    e,
                                    data.url
                                )
                            }
                            className="cursor-pointer"
                        >
                            <LabeledImage
                                src={data.url}
                                annotations={annotations}
                                colorSchemes={[]}
                                resolution={{width: data.metadata.width, height: data.metadata.height}}
                            />
                        </div>)
                } else {
                    return <div>
                        <img
                            src={data.thumbnailUrl || thumbnail}
                            alt={"Preview"}/>
                    </div>
                }
            }
        },
        {
            Header: 'Tags',
            id: 'tags',
            width: 150,
            minWidth: 150,
            accessor: (data) => {
                return (
                    <Stack direction="row" spacing={1} useflexgap={"true"} flexWrap="wrap">
                        {
                            data.tags.map((tag) => {
                                return (
                                    <Chip
                                        label={tag} color={"secondary"} size="small" key={tag}
                                    />
                                )
                            })
                        }
                    </Stack>
                )
            }
        },
        {
            Header: 'Status',
            id: 'status',
            width: 50,
            accessor: (data) => {
                return data.moduleStatus.map(ms => {
                    let color = "primary";
                    if (ms.status === ModuleStatus.ANNOTATING)
                        color = "default"
                    return (
                        <Tooltip title={ms.status} key={"a" + ms.moduleName}>
                            <Chip label={ms.moduleName} color={color} size="small" key={ms.moduleName}/>
                        </Tooltip>
                    )
                })
            }
        },
        {
            Header: 'Type',
            id: 'type',
            accessor: 'type'
        },

        {
            Header: 'Origin',
            id: 'origin',
            accessor: 'metadata.origin',
            maxWidth: 200,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            Cell: (row) => {
                /* Add data-tip */
                return (
                    <div>
                        <span data-tip={row.value}>{row.value}</span>
                        <ReactTooltip place="top"
                                      className={"custom-react-tooltip"}
                                      delayHide={500}
                                      delayShow={500}
                                      delayUpdate={500}
                        />
                    </div>
                );
            }
        },
        {
            Header: 'Metadata',
            id: "metadata",
            maxWidth: 200,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            accessor: data => {
                return <ReactJson src={data.metadata} collapsed={true} displayDataTypes={false} indentWidth={2}
                                  name={null}
                                  style={{fontSize: '10px'}}
                />

            }

        },
        {
            Header: 'Inferences',
            id: "inferences",
            maxWidth: 300,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            accessor: data => {
                let inferences = data.inferences || {}
                let metadataOnly = Object.fromEntries(
                    Object.entries(inferences).map(([k, v]) => [k, v.metadata]
                    ))
                return <ReactJson collapsed={true} src={metadataOnly}
                                  style={{fontSize: '10px'}} displayDataTypes={false} indentWidth={2} name={null}/>
                // return JSON.stringify(data.metadata)
            }

        },
        {
            Header: 'Annotations',
            id: "annotations",
            maxWidth: 300,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            accessor: data => {
                return <ReactJson src={data.annotations} collapsed={true} displayDataTypes={false} indentWidth={2}
                                  name={null}
                                  style={{fontSize: '10px'}}
                />

            }
        },
        {
            Header: 'Action',
            id: 'action',
            width: 200,
            minWidth: 100,
            accessor: (data) => {
                let isVideo = data.type === DataItemTypes[1] || data.type === DataItemTypes[2]
                return <div className="grid grid-cols-4 gap-1/3">
                    <Tooltip title="Right click to play">
                        <IconButton
                            href={data.url}
                            onClick={e => {
                                e.preventDefault();
                            }}
                            disabled={!isVideo}
                        >
                            <PreviewIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Browse">
                        <IconButton
                            href={data.url}
                            onClick={e => {
                                e.preventDefault();
                            }}
                        >
                            <FolderOpenIcon/>
                        </IconButton>
                    </Tooltip>
                </div>
            }
        }
    ], [pickState]);
    const body = <div className="w-full overflow-x-auto rounded-lg shadow-xs">
        <div>
            <h2 className="text-xl font-semibold leading-tight">Found {totalElements} item(s)</h2>
        </div>
        <div className="md:flex mt-5 mb-5 justify-end">
            <Stack direction="row" spacing={2}>
                <Tooltip title={"Click to add picked items to box"}>
                    <span>
                    <Button variant="contained" startIcon={<InventoryIcon/>}
                            disabled={pickState.picked.length === 0}
                            onClick={addPicksToCart}
                    >
                        {pickState.picked.length} Picked
                    </Button>
                        </span>
                </Tooltip>
                <TableConfigMenu columnList={columnConfigs.map(col => col.Header).slice(1)}
                                 columnVisibility={columnVisibility}
                                 setColumnVisibility={setColumnVisibility}
                                 enableGridView={enableGridView}
                                 setEnableGridView={setEnableGridView}
                />
            </Stack>
        </div>

        {enableGridView ?
            <DataItemGridView items={dataItems} pageSize={currentPageSize} currentPage={currentPage}
                              setCurrentPage={updateCurrentPage}
                              totalPages={totalPages}
                              colorSchemes={[]}
                              toggleItem={toggleItem}
            />
            :
            <DataItemManagementTableView
                columnConfigs={columnConfigs}
                dataItems={dataItems}
                columnVisibility={columnVisibility}
            />
        }
        <Pagination currentPage={currentPage + 1} setCurrentPage={updateCurrentPage}
                    totalElement={totalElements}
                    totalPages={totalPages} pageSize={currentPageSize}/>
        {imageModalObj && <ImageModal handleClose={closeImageModal} modalObj={imageModalObj} colorSchemes={[]}/>}
    </div>;

    const injectedProps = {header, body};
    return (
        <div className="px-4">
            <header>
                {header}
            </header>
            <div className="py-8">
                {body}
            </div>
        </div>
    )
};

export default DataItemManagementView;
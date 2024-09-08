import React, {useEffect, useState} from "react";
import ModalWrapper from "../../../common/modal/Modal";
import ItemCardGridView from "../ItemCardGridView";
import {clearAll, getItems} from "../../../../service/CartService";
import CreateWorkspaceModal from "./CreateWorkspaceModal";
import Button from "@mui/material/Button";
import {Stack} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";

const PreviewPicksModal = ({visible, setOpenPreviewModal}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPage, setItemPage] = useState([])
    const [totalPages, setTotalPages] = useState(0)
    const [openCreateWorkspaceModal, setOpenCreateWorkspaceModal] = useState(false);

    const reset = () => {
        setCurrentPage(1);
        setItemPage([]);
        setTotalPages(0);
    }
    const openWorkspaceModal = () => {
        setOpenCreateWorkspaceModal(true);
    }
    const onClearAll = () => {
        clearAll().then(
            () => reset()
        );
    }

    useEffect(() => {
            // console.log(currentPage);
            getItems().then(items => {
                setItemPage(items.slice(currentPage * 10 - 10, currentPage * 10));
                setTotalPages(Math.floor(items.length / 10) + 1);
            })
        }, [currentPage, itemPage]
    );

    return (
        <ModalWrapper className="h-1/5 bg-gray-100"
                      isOpen={visible}>
            <header className="flex justify-end mb-5">
                <Stack direction="row" spacing={2}>
                    <Button variant={"contained"} onClick={() => onClearAll()}>Clear all</Button>
                    <Button variant={"contained"} onClick={() => openWorkspaceModal()}>Create workspace</Button>
                    <IconButton aria-label="delete" size="small"
                                onClick={() => {
                                    reset();
                                    setOpenPreviewModal(false);
                                }}
                    >
                        <CloseIcon fontSize="inherit"/>
                    </IconButton>
                </Stack>
            </header>
            <body>
            <ItemCardGridView currentPage={currentPage} setCurrentPage={setCurrentPage} items={itemPage}
                              totalPages={totalPages} colorSchemes={[]}/>
            </body>

            <footer>
            </footer>
            {openCreateWorkspaceModal &&
                <CreateWorkspaceModal visible={openCreateWorkspaceModal} setVisible={setOpenCreateWorkspaceModal}/>}

        </ModalWrapper>
    );
};

export default PreviewPicksModal;
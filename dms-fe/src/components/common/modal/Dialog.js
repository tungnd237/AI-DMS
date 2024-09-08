import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import ModalWrapper from "./Modal";

const ConfirmDialog = ({isOpen, handleClose, handleConfirm, title, content}) => {
    return <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            {title}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {content}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>No</Button>
            <Button onClick={handleConfirm} autoFocus>
                Yes
            </Button>
        </DialogActions>
    </Dialog>
}

export default ConfirmDialog;
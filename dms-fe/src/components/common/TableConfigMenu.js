import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TuneIcon from '@mui/icons-material/Tune';
import {Checkbox, Divider, FormControlLabel, ListItemIcon, ListItemText, MenuList, Switch} from "@mui/material";
import {useState} from "react";

const TableConfigMenu = ({columnList, columnVisibility, setColumnVisibility, enableGridView, setEnableGridView}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const onToggleCheck = (event, colIndex) => {
        const nextVisibility = columnVisibility.map((col, index) => {
            if (index === colIndex) return event.target.checked;
            return col;
        })
        setColumnVisibility(nextVisibility);
    };

    const handleSwitchGridView = (event) => {
        setEnableGridView(event.target.checked);
    }

    return (
        <div>
            <Button
                variant="contained" startIcon={<TuneIcon/>}
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                View
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuList dense>
                    <MenuItem>
                        <FormControlLabel control={<Switch checked={enableGridView} onChange={handleSwitchGridView} />} label="Grid view" />
                    </MenuItem>
                    <Divider/>
                    {
                        columnList.map((col, index) => {
                            return (
                                <MenuItem key={`table_col_${index}`}>
                                    <ListItemIcon>
                                        <Checkbox checked={columnVisibility[index]} onClick={(event) => onToggleCheck(event, index)}/>
                                    </ListItemIcon>
                                    {col}
                                </MenuItem>
                            )
                        })
                    }
                </MenuList>
            </Menu>
        </div>
    );

}
export default TableConfigMenu;
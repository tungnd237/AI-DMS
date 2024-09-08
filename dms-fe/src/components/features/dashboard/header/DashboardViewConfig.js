import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TuneIcon from '@mui/icons-material/Tune';
import {
    Box,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    ListItemIcon,
    MenuList,
    Radio,
    RadioGroup,
    Slider,
    Typography
} from "@mui/material";

const DashboardViewConfig = ({
                                 chartVisibility,
                                 setChartVisibility,
                                 pieDisplayValue,
                                 setPieDisplayValue,
                                 chartGridSize,
                                 setChartGridSize
                             }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const onToggleCheck = (event, index) => {
        const nextVisibility = chartVisibility.map((chart, i) => {
            if (index === i) return {...chart, visible: event.target.checked}
            return {...chart};
        })
        setChartVisibility(nextVisibility);
    };

    const onToggleAll = (event) => {
        const nextVisibility = chartVisibility.map((chart, i) => {
            return {...chart, visible: event.target.checked};
        });
        setChartVisibility(nextVisibility);
    }

    const checkedAll = () => {
        return chartVisibility.filter(chart => !chart.visible).length === 0;
    }

    const onSliderChange = (event, value) => {
        setChartGridSize(value);
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
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">
                                <Typography variant={"body2"}>
                                    Display Options
                                </Typography>
                            </FormLabel>
                            <RadioGroup
                                value={pieDisplayValue}
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                onChange={(event) => setPieDisplayValue(event.target.value)}
                            >
                                <FormControlLabel value="p" control={<Radio/>}
                                                  label={<Typography variant={"body2"}>Percentage</Typography>}/>
                                <FormControlLabel value="v" control={<Radio/>}
                                                  label={<Typography variant={"body2"}>Value</Typography>}/>
                                <FormControlLabel value="b" control={<Radio/>}
                                                  label={<Typography variant={"body2"}>Both</Typography>}/>
                            </RadioGroup>
                        </FormControl>
                    </MenuItem>
                    <Divider/>
                    <MenuItem>
                        <Box sx={{width: 150}}>

                            <FormControl>
                                <FormLabel id="demo-row-radio-group-label">
                                    <Typography variant={"body2"}>
                                        Grid Size
                                    </Typography>
                                </FormLabel>
                            </FormControl>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item lg>
                                    <Slider
                                        value={chartGridSize}
                                        onChange={onSliderChange}
                                        size={"small"}
                                        aria-label="Grid size"
                                        defaultValue={3}
                                        valueLabelDisplay="auto"
                                        step={1}
                                        marks
                                        min={3}
                                        max={6}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </MenuItem>
                    <Divider/>
                    <MenuItem>
                        <ListItemIcon>
                            <Checkbox checked={checkedAll()} onClick={onToggleAll}/>
                        </ListItemIcon>
                        Toggle All
                    </MenuItem>
                    {
                        chartVisibility.map((chart, index) => {
                            return (
                                <MenuItem>
                                    <ListItemIcon>
                                        <Checkbox checked={chart.visible}
                                                  onClick={(event) => onToggleCheck(event, index)}/>
                                    </ListItemIcon>
                                    {chart.name}
                                </MenuItem>
                            )
                        })
                    }
                </MenuList>
            </Menu>
        </div>
    );

}
export default DashboardViewConfig;
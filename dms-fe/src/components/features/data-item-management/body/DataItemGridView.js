import React, {useState} from "react";
import {
    Avatar,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Checkbox,
    Chip,
    Drawer,
    IconButton,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";
import {getAllPredictionsLabels} from "../../../../utils/Utils";
import LabeledImage from "../../../image/labled-image/LabaledImage";
import thumbnail from "../../../../images/thumbnail_na.jpg"
import InfoIcon from '@mui/icons-material/Info';
import ImageIcon from '@mui/icons-material/Image';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import moment from "moment";
import ReactJson from "react-json-view";
import {DataItemType, ModuleStatus} from "../../../../constants/DataItemConstant";
import PreviewIcon from "@mui/icons-material/Preview";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import {white} from "tailwindcss/colors";
import {blue} from "@mui/material/colors";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import VideocamIcon from '@mui/icons-material/Videocam';
import LandscapeIcon from '@mui/icons-material/Landscape';

const DataItemGridView = ({
                              items,
                              colorSchemes,
                              toggleItem
                          }) => {
    const [openItemInfo, setOpenItemInfo] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const onOpenItemInfo = (event, item) => {
        setSelectedItem(item);
        setOpenItemInfo(true);
    }

    const makeDrawerContent = (item) => {
        if (!item) return;
        return (
            <Card sx={{width: 450}} elevation={0}>
                <CardHeader
                    sx={{
                        display: "flex",
                        overflow: "hidden",
                        "& .MuiCardHeader-content": {
                            overflow: "hidden"
                        }
                    }}
                    title={item.name}
                    titleTypographyProps={{noWrap: true}}
                    avatar={
                        <Avatar>
                            {item.type === "IMAGE" ? <LandscapeIcon fontSize={"large"}/> :
                                <VideocamIcon fontSize={"large"}/>}
                        </Avatar>
                    }
                    action={
                        <CardActions disableSpacing>
                            <Tooltip title="Right click to play">
                                <IconButton
                                    href={item.url}
                                    onClick={e => {
                                        e.preventDefault();
                                    }}
                                    disabled={item.type !== DataItemType.VIDEO}
                                    color={"primary"}
                                >
                                    <PreviewIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Browse">
                                <IconButton
                                    href={item.url}
                                    onClick={e => {
                                        e.preventDefault();
                                    }}
                                    color={"primary"}
                                >
                                    <FolderOpenIcon/>
                                </IconButton>
                            </Tooltip>
                        </CardActions>
                    }
                />
                <CardContent style={{
                    overflowY: "auto",
                    maxHeight: "100%",
                    display: "flex",
                    flexGrow: 1,
                    flexDirection: "column"
                }}>
                    <TableContainer>
                        <Table aria-label="simple table">
                            <TableBody>
                                <TableRow key={"created-at"}>
                                    <TableCell variant="head" scope="row">
                                        Created At
                                    </TableCell>
                                    <TableCell>{moment.unix(item.createdAt / 1e3).format('DD MMM YYYY hh:mm a')}</TableCell>
                                </TableRow>
                                <TableRow key={"collected-at"}>
                                    <TableCell variant="head" scope="row">
                                        Collected At
                                    </TableCell>
                                    <TableCell>{moment.unix(item.metadata.collectedTime).format('DD MMM YYYY hh:mm a')}</TableCell>
                                </TableRow>
                                <TableRow key={"origin"}>
                                    <TableCell variant="head" scope="row">
                                        Origin
                                    </TableCell>
                                    <TableCell>{item.origin}</TableCell>
                                </TableRow>
                                <TableRow key={"location"}>
                                    <TableCell variant="head" scope="row">
                                        Location
                                    </TableCell>
                                    <TableCell>
                                              <span
                                                  style={{
                                                      display: "inline-block",
                                                      width: "250px",
                                                      wordWrap: "break-word"
                                                  }}

                                              >
                                            {item.location}
                                                      </span>

                                    </TableCell>
                                </TableRow>
                                <TableRow key={"tags"}>
                                    <TableCell variant="head" scope="row">
                                        Tags
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} useflexgap={"true"} flexWrap="wrap">
                                            {
                                                item.tags.map((tag) => {
                                                    return (
                                                        <Chip
                                                            label={tag} color={"secondary"} size="small" key={tag}
                                                        />
                                                    )
                                                })
                                            }
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Status</TableCell>
                                    <TableCell>
                                        {item.moduleStatus.map(ms => {
                                            let color = "primary";
                                            if (ms.status === ModuleStatus.ANNOTATING)
                                                color = "default"
                                            return (
                                                <Tooltip title={ms.status} key={"a" + ms.moduleName}>
                                                    <Chip label={ms.moduleName} color={color} size="small"
                                                          key={ms.moduleName}/>
                                                </Tooltip>
                                            )
                                        })}
                                    </TableCell>
                                </TableRow>
                                <TableRow key={"metadata"}>
                                    <TableCell variant="head" scope="row">
                                        Metadata
                                    </TableCell>
                                    <TableCell>
                                        <ReactJson src={item.metadata} collapsed={true} displayDataTypes={false}
                                                   indentWidth={2}
                                                   name={null}
                                                   style={{fontSize: '10px'}}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow key={"annotations"}>
                                    <TableCell variant="head" scope="row">
                                        Annotations
                                    </TableCell>
                                    <TableCell>
                                        <ReactJson src={item.annotations} collapsed={true} displayDataTypes={false}
                                                   indentWidth={2}
                                                   name={null}
                                                   style={{fontSize: '10px'}}/>
                                    </TableCell>
                                </TableRow>
                                <TableRow key={"inferences"}>
                                    <TableCell variant="head" scope="row">
                                        Inferences
                                    </TableCell>
                                    <TableCell>
                                        <ReactJson collapsed={true}
                                                   src={
                                                       Object.fromEntries(
                                                           Object.entries(item.inferences || {}).map(([k, v]) => [k, v.metadata]))
                                                   }
                                                   style={{fontSize: '10px'}} displayDataTypes={false}
                                                   indentWidth={2} name={null}/>

                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>

            </Card>
        )
    }

    return (
        <React.Fragment>
            <ImageList cols={4}>
                {items.map((item) => {
                    let annotations = getAllPredictionsLabels(item);
                    return (
                        <ImageListItem key={item.id}>
                            <LabeledImage
                                src={(item.type === "IMAGE" ? item.url : item.thumbnailUrl) || thumbnail}
                                annotations={annotations}
                                colorSchemes={colorSchemes}
                                resolution={{width: item.metadata.width || 1920, height: item.metadata.height || 1208}}
                            />
                            <ImageListItemBar
                                sx={{
                                    background:
                                        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                        'rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 70%)',
                                }}
                                title={item.type === DataItemType.VIDEO ? <VideoFileIcon/> : <ImageIcon/>}
                                position="top"
                                actionIcon={
                                    <Checkbox
                                        icon={<StarBorderIcon sx={{color: white}}/>}
                                        checkedIcon={<StarIcon sx={{color: blue}}/>}
                                        defaultChecked={false}
                                        onChange={(e) => toggleItem(e, item)}

                                    />
                                }
                                actionPosition="right"
                            />
                            <ImageListItemBar
                                title={
                                    <Stack direction="row" alignItems="left" gap={1}>
                                        <Typography variant="body1">{item.id}</Typography>
                                    </Stack>

                                }
                                subtitle={item.name}
                                actionIcon={
                                    <IconButton
                                        sx={{color: 'rgba(255, 255, 255, 0.54)'}}
                                        aria-label={`info about ${item.title}`}
                                        onClick={(event) => onOpenItemInfo(event, item)}
                                    >
                                        <InfoIcon/>
                                    </IconButton>
                                }
                            />
                        </ImageListItem>
                    )
                })}
            </ImageList>
            <Drawer
                anchor={"right"}
                open={openItemInfo}
                onClose={() => setOpenItemInfo(false)}
            >
                {makeDrawerContent(selectedItem)}
            </Drawer>
        </React.Fragment>
    );
}
export default DataItemGridView;
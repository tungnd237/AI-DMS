import React, {useEffect, useMemo, useRef, useState} from "react";
import DashboardHeader from "./header/DashboardHeader";
import {
    cleanUp,
    fetchDataTypeStatsData,
    fetchModuleStatsData,
    fetchOddStatsData,
    setDataType,
    setDuration,
    setFilterQuery,
    setTimeField
} from "../../../duck/slice/DashboardSlice";
import {useDispatch, useSelector} from "react-redux";
import {
    Box, Card, CardContent, CardHeader,
    CircularProgress,
    Divider,
    FormControl,
    FormControlLabel, FormLabel,
    Grid,
    Paper, Radio, RadioGroup,
    Stack,
    Switch,
    Typography
} from "@mui/material";
import ModuleSelectBox from "../../common/selectbox/ModuleSelectBox";
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import {scaleOrdinal} from "d3-scale";
import {schemeCategory10} from "d3-scale-chromatic";
import Block from "../../common/block/Block";
import VideoFileIcon from '@mui/icons-material/VideoFile';
import PhotoIcon from '@mui/icons-material/Photo';
import {CustomTooltip} from "../../../utils/ChartUtils";
import {fetchOddStats} from "../../../service/DashboardService";
import {v4 as uuidv4} from 'uuid';
import Button from "@mui/material/Button";
import * as htmlToImage from 'html-to-image';
import DownloadIcon from '@mui/icons-material/Download';
import PersonIcon from '@mui/icons-material/Person';
import DashboardViewConfig from "./header/DashboardViewConfig";

const DashboardComponent = () => {
    const dispatch = useDispatch();
    const {
        period, startTime, endTime, timeField, filterQuery, dataType,
        statistic, models = [],
        loadingState,
        attributes,
    } = useSelector(state => state.dashboard);

    useEffect(() => () => {
        dispatch(cleanUp());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchModuleStatsData({type: dataType, period: period, timeField: timeField}));
        dispatch(fetchOddStatsData({type: "VIDEO", period: period, timeField: timeField}))
        dispatch(fetchDataTypeStatsData({
            period: period,
            startDate: null,
            endDate: null,
            timeField: timeField,
            type: dataType
        }));

    }, []);

    const updateDuration = duration => {
        dispatch(setDuration(duration));
    };

    const updateTimeField = timeField => {
        dispatch(setTimeField(timeField));
    };

    const updateFilterQuery = filterQuery => {
        dispatch(setFilterQuery(filterQuery));
    };

    const updateDataType = dataType => {
        dispatch(setDataType(dataType));
    };

    const applySearch = () => {
        let startDate = null, endDate = null;
        if (!period) {
            startDate = new Date(startTime * 1e3).toISOString();
            endDate = new Date(endTime * 1e3).toISOString();
        }
        dispatch(fetchDataTypeStatsData({
            period: period,
            startDate: startDate,
            endDate: endDate,
            timeField: timeField,
            filterQuery: filterQuery,
            type: dataType
        }));
        dispatch(fetchModuleStatsData({
            type: dataType,
            period: period,
            startDate: startDate,
            endDate: endDate,
            timeField: timeField,
            filterQuery: filterQuery
        }));
        dispatch(fetchOddStatsData({
            type: dataType,
            period: period,
            startDate: startDate,
            endDate: endDate,
            timeField: timeField,
            filterQuery: filterQuery,
        }));

    };

    const [module, setModule] = React.useState("phone_smoking_eating");
    const onSelectModule = (option) => {
        setModule(option.name);
    }

    const injectedProps = {
        duration: {period, startTime, endTime},
        timeField,
        filterQuery,
        updateDuration,
        updateTimeField,
        updateFilterQuery,
        updateDataType,
        applySearch,
    };

    const getCountOfType = (type) => {
        const stat = statistic.dataTypeInfo.find(s => s.name === type);
        return stat ? stat.count : 0
    }

    const colors = scaleOrdinal(schemeCategory10).range();
    const [piePercent, setPiePercent] = React.useState({});
    const [pieDisplayValue, setPieDisplayValue] = React.useState("p");
    const onPieEnter = (data, index, e) => {
        const pieId = e.target.id;
        piePercent[pieId] = data.percent;
        setPiePercent({
            ...piePercent
        })

    };

    const [chartVisibility, setChartVisibility] = useState([]);
    useEffect(() => {
        const visibility = window.sessionStorage.getItem("chart-view");
        setChartVisibility(JSON.parse(visibility));
    }, []);
    useEffect(() => {
        window.localStorage.setItem("chart-view", JSON.stringify(chartVisibility));
    }, [chartVisibility]);
    useEffect(() => {
        const nextVisibility = statistic.oddInfo.map(odd => {
            return {...odd, visible: true}
        });
        setChartVisibility(nextVisibility);
    }, [statistic]);

    const displayLine = (item) => {
        if (pieDisplayValue === "p") {
            return `${item.name} (${item.percent}%)`
        }
        if (pieDisplayValue === "v") {
            return `${item.name} (${item.count})`
        }
        return `${item.name} (${item.count} - ${item.percent}%)`
    }

    const [chartGridSize, setChartGridSize] = useState(4);

    const makeGridOfOdds = (oddStats) => {
        const hiddenCharts = chartVisibility.filter(chart => !chart.visible).map(chart => chart.id);
        return oddStats.filter(os => !hiddenCharts.includes(os.id)).map((os) => {
                const sum = os.stats.reduce((partialSum, s) => partialSum + s.count, 0);

                const stats = os.stats.map(st => {
                    return {...st, percent: (st.count * 100 / sum).toFixed(2)};
                })
                return (
                    <Grid key={`grid-${os.id}`} item xs={12/chartGridSize}>
                        <span className="font-bold">{os.name}</span>
                        <ResponsiveContainer height={300}>
                            <PieChart width={600} height={600} style={{maxWidth: '790px', height: '100%'}}>
                                <Legend iconSize={12} layout="vertical" verticalAlign="top" align="right"
                                        wrapperStyle={{fontSize: "14px"}}
                                        payload={
                                            stats.map(
                                                (item, index) => ({
                                                    id: item.name,
                                                    type: "square",
                                                    value: displayLine(item),
                                                    color: colors[index % colors.length]
                                                })
                                            )
                                        }
                                />
                                <Pie
                                    id={os.id}
                                    data={os.stats}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    fill="#3176dc"
                                    dataKey="count"
                                    nameKey="name"
                                    animationDuration={1000}
                                    onMouseEnter={onPieEnter}
                                >
                                    {os.stats.map((entry, index) => (
                                        <Cell key={`${os.id}-${index}`} fill={colors[index]}/>
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip percent={piePercent[os.id] || 0}/>}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </Grid>
                )
            }
        )

    }

    const ODDChartRef = useRef(null);

    const downloadODDCharts = async () => {
        const dataUrl = await htmlToImage.toJpeg(ODDChartRef.current, {backgroundColor: "white"});

        // download image
        const link = document.createElement('a');
        link.download = "odd.jpeg";
        link.href = dataUrl;
        link.click();
    }

    return (
        <div className="bg-gray-100">
            <div className="bg-white">
                <DashboardHeader {...injectedProps}/>
            </div>
            <div className="py-6 text-center text-blue-800 font-bold text-lg w-full">
                <span className="text-xl">Overview</span>
            </div>
            <Grid container spacing={1}>
                <Grid item xs={2}>
                    <Block title="Videos"
                           value={getCountOfType("VIDEO").toLocaleString()}
                           className="mx-4 py-4 px-6 bg-white flex flex-col"
                           icon={
                               <VideoFileIcon sx={{fontSize: 40}}/>
                           }/>
                </Grid>
                <Grid item xs={2}>
                    <Block title="Images"
                           className="mx-4 py-4 px-6 bg-white flex flex-col"
                           value={getCountOfType("IMAGE").toLocaleString()}
                           icon={
                               <PhotoIcon sx={{fontSize: 40}}/>
                           }/>
                </Grid>
                <Grid item xs={2}>
                    <Block title="Users"
                           className="mx-4 py-4 px-6 bg-white flex flex-col"
                           value={getCountOfType("user").toLocaleString()}
                           icon={
                               <PersonIcon sx={{fontSize: 40}}/>
                           }/>
                </Grid>

                <Grid item xs={6} sm={6} sx={{ pr: 2, pl: 2, pb: 4 }}>
                    {loadingState.modules ? (
                        <CircularProgress
                            size={68}
                            sx={{
                                position: 'relative',
                                top: -6,
                                left: -6,
                                zIndex: 1,
                            }}
                        />
                    ) : (
                        <Card elevation={0}>
                            <CardHeader
                                title={<Typography variant={"h6"}>Annotation Status</Typography>}
                                subheader={<ModuleSelectBox onSelect={onSelectModule}/>}
                            />
                            <CardContent>

                                <ResponsiveContainer height={300}>
                                    <PieChart width={600} height={600} style={{maxWidth: '790px', height: '100%'}}>
                                        <Legend layout="vertical" verticalAlign="top" align="right"/>
                                        <Pie
                                            id="module-status-chart"
                                            data={statistic.moduleInfo[module] || []}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            fill="#3176dc"
                                            dataKey="count"
                                            nameKey="name"
                                            animationDuration={1000}
                                            onMouseEnter={onPieEnter}
                                        >
                                            {(statistic.moduleInfo[module] || []).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={colors[index]}/>
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            content={<CustomTooltip percent={piePercent["module-status-chart"] || 0}/>}/>

                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>

                        </Card>
                    )
                    }
                </Grid>
            </Grid>
            <Divider/>
            <Paper elevation={0}>
                <div className="py-6 text-center text-blue-800 font-bold text-lg w-full">
                    <span className="text-xl">ODD Distribution</span>
                </div>
                {loadingState.odds ?
                    <CircularProgress
                        size={68}
                        sx={{
                            position: 'relative',
                            top: -6,
                            left: -6,
                            zIndex: 1,
                        }}
                    /> :
                    <>
                        <div className="md:flex mt-10 mb-6 justify-end">
                            <Stack direction="row" spacing={2} item xs={6}>
                                <Button variant={"contained"} onClick={downloadODDCharts} startIcon={<DownloadIcon/>}>
                                    Download as JPEG
                                </Button>
                                <DashboardViewConfig chartVisibility={chartVisibility}
                                                     setChartVisibility={setChartVisibility}
                                                     pieDisplayValue={pieDisplayValue}
                                                     setPieDisplayValue={setPieDisplayValue}
                                                     chartGridSize={chartGridSize}
                                                     setChartGridSize={setChartGridSize}
                                />
                            </Stack>
                        </div>

                        <Grid container spacing={3} id="odd-charts" ref={ODDChartRef}>
                            {makeGridOfOdds(statistic.oddInfo)}
                        </Grid>
                    </>


                }

            </Paper>


        </div>
    )
}

export default DashboardComponent;
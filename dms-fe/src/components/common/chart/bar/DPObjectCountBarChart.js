import React from 'react';
import {
    ResponsiveContainer,
    Legend,
    Tooltip,
    Bar,
    YAxis,
    XAxis,
    CartesianGrid,
    BarChart,
} from 'recharts';

function DPObjectCountBarChart(props){
    const {data, title} = props;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const { numFrames, numObject } = payload[0].payload;
            return (
                <div className="bg-gray-100 px-3 py-3">
                    <p className="desc">Annotated: {numObject}</p>
                    <p className="intro text-purple-500">Total Images: {numFrames}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="flex flex-col w-full h-full">
            <div className="px-6 py-4 text-left text-lg w-full bg-gray-100 my-4">
                <span>{title}</span>
            </div>
            <div className="flex flex-row w-full" style={{height: '750px'}}>
                <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="numObject"
                                   padding={{ left: 10, right: 10 }}
                                   label={{position: 'bottom'}}
                                   name="Number of Objects"/>
                            <YAxis yAxisId="left"
                                   orientation="left"
                                   label={{ value: 'Images', angle: -90, position: 'insideLeft' }}
                                   stroke="black"
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="top"
                                    height={50}
                                    iconType="square"/>
                            <Bar dataKey="numFrames"
                                 yAxisId="left"
                                 fill="#8884d8"
                                 name="Total Images"
                                 animationDuration={2000}
                                 background={{ fill: '#eee' }}
                                 label={{ position: 'top' }}/>
                        </BarChart>
                    </ResponsiveContainer>
            </div>
        </div>

    );
}

export default DPObjectCountBarChart;
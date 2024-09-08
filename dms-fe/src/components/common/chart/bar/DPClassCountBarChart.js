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

function DPClassCountBarChart(props){
    const {data, title} = props;
    return (
        <div className="flex flex-col w-full h-full">
            <div className="px-6 py-6 text-left text-lg w-full bg-gray-100 my-4">
                <span>{title}</span>
            </div>
            <div className="flex flex-row w-full" style={{height: '750px'}}>
                <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="className"
                                   angle={-60}
                                   textAnchor="end"
                                   interval={0}
                                   fontSize={14}
                                   height={100}
                                   name="Total Annotated">
                            </XAxis>
                            <YAxis yAxisId="left"
                                   orientation="left"
                                   stroke="black" />
                            <Tooltip/>
                            <Legend verticalAlign="top"
                                    height={50}
                                    iconType="square"/>
                            <Bar dataKey="count"
                                 yAxisId="left"
                                 fill="#8884d8"
                                 name="Total Annotated"
                                 animationDuration={2000}
                                 background={{ fill: '#eee' }}
                                 padding={{ left: 50, right: 50 }}
                                 label={{ position: 'top' }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
            </div>
        </div>

    );
}

export default DPClassCountBarChart;
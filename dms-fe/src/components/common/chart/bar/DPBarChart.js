import React from 'react';
import {
    ResponsiveContainer,
    Legend,
    Tooltip,
    Bar,
    BarChart,
    YAxis,
    XAxis,
    CartesianGrid
} from 'recharts';

function DPBarChart(props) {
    const { data, title, showAttribute} = props;

    const showModelDetail = (e) => {
        showAttribute(e.name);
    }

    const onBarChartClick = (e) => {
        console.log(e);
    }

    return (
        <div className="flex flex-col w-full h-full">
            <div className="py-6 text-center text-blue-800 font-bold text-lg w-full">
                <span>{title}</span>
            </div>
            <div className="flex flex-row w-full" style={{height: '550px'}}>
                <ResponsiveContainer className="w-full h-full" width="100%" height="100%">
                    <BarChart width={500}
                              onClick={onBarChartClick}
                              height={300}
                              data={data}
                              margin={{
                                  top: 20, right: 20, left: 20, bottom: 20,
                              }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name"/>
                        <YAxis yAxisId="left" orientation="left" stroke="#3176dc" />
                        <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" barSize={25}
                             label={{ position: 'top' }}
                             dataKey="totalImages"
                             name="Total Images"
                             fill="#3176dc"
                             className="cursor-pointer"
                             onClick={showModelDetail}
                             animationDuration={2000}>
                        </Bar>
                        <Bar yAxisId="right" barSize={25}
                             label={{ position: 'top' }}
                             dataKey="totalAnnotated"
                             name="Total Annotated"
                             fill="#8884d8"
                             className="cursor-pointer"
                             onClick={showModelDetail}
                             animationDuration={2000}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

    );
}

export default DPBarChart;
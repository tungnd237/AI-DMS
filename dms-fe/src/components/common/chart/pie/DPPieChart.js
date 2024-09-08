import React from 'react';
import {PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip} from 'recharts';
import { schemeCategory10 } from 'd3-scale-chromatic';
import {scaleOrdinal} from "d3-scale";

const colors = scaleOrdinal(schemeCategory10).range();

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

function DPPieChart(props) {
    const { data, title } = props;
    const { distribution } = data

    return (
        <div className="flex flex-col w-full">
            <div className="py-6 text-center text-blue-800 font-bold text-lg w-full">
                <span>{title}</span>
            </div>
            <div className="flex flex-row w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={600} height={600} style={{maxWidth: '790px', height: '100%'}}>
                        <Legend layout="vertical" verticalAlign="top" align="right" />
                        <Pie
                            data={distribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            fill="#3176dc"
                            dataKey="value"
                            animationDuration={2000}
                        >
                            {distribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default DPPieChart;
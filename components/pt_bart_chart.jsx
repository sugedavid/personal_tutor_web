// BarChart.js
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const PtBarChart = ({ data }) => {
  return (
    <ResponsiveContainer width='50%' height={300}>
      <BarChart
        data={data}
        width={10}
        margin={{ top: 60, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='type' tick={{ fontSize: 14 }} />
        <YAxis tick={{ fontSize: 14 }} />
        <Tooltip />
        <Legend name='Total Amount' />
        <Bar barSize={20} dataKey='Amount' fill='#9F7AEA' />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PtBarChart;

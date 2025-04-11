import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { time: '2023-08-01', value: 400 },
  { time: '2023-08-02', value: 300 },
  { time: '2023-08-03', value: 200 },
  { time: '2023-08-04', value: 278 },
  { time: '2023-08-05', value: 189 },
];

const RechartsExample = () => (
  <LineChart width={600} height={300} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="time" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="value" stroke="#8884d8" />
  </LineChart>
);

export default RechartsExample; 
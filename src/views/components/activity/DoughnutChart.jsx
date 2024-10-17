import React, { memo } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
const data = [
	{ name: 'Group A', value: 50 },
	{ name: 'Group B', value: 16.67 },
	{ name: 'Group C', value: 16.67 },
	{ name: 'Group D', value: 12.5 },
	{ name: 'Group E', value: 4.17 },
];

const COLORS = ['#FF6384', '#FFCE56', '#FF9F40', '#36A2EB', '#9966FF'];

const DoughnutChart = () => {
	return (
		<PieChart width={400} height={400} className="circularChart">
			<Pie
				data={data}
				cx={200}
				cy={200}
				innerRadius={80}
				outerRadius={140}
				fill="#8884d8"
				paddingAngle={1}
				dataKey="value"
				label={true}
			>
				{data.map((entry, index) => (
					<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
				))}
			</Pie>
			<Tooltip />
		</PieChart>
	);
};

export default memo(DoughnutChart);

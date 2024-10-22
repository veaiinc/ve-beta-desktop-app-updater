import React, { memo } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#FF6384', '#FFCE56', '#FF9F40', '#36A2EB', '#9966FF'];

const DoughnutChart = ({ statsData }) => {
	return (
		<PieChart width={390} height={300} className="ringChart">
			<Pie
				data={statsData}
				// cx={200}
				// cy={200}
				innerRadius={100}
				outerRadius={140}
				fill="#8884d8"
				paddingAngle={1}
				dataKey="percentage"
				label={true}
			>
				{statsData.map((entry, index) => (
					<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
				))}
			</Pie>
			<Tooltip />
		</PieChart>
	);
};

export default memo(DoughnutChart);

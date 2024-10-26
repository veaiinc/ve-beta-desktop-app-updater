import React, { memo } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#FF6384', '#FFCE56', '#FF9F40', '#36A2EB', '#9966FF'];

const DoughnutChart = ({ statsData, scrollClass = '', title }) => {
	const dataKey = title === 'Interactions' ? 'totalInteractionsCount' : 'duration';
	return (
		<PieChart width={390} height={300} className={`ringChart ${scrollClass}`}>
			<Pie
				data={statsData}
				// cx={200}
				// cy={200}
				innerRadius={100}
				outerRadius={140}
				fill="#8884d8"
				paddingAngle={1}
				dataKey={dataKey}
				label={true}
			>
				{statsData?.map((entry, index) => (
					<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
				))}
			</Pie>
			{/* <Tooltip /> */}
		</PieChart>
	);
};

export default memo(DoughnutChart);

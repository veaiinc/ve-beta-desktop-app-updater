import React, { memo } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const DoughnutChart = ({ scrollClass = '', statsData, title, COLORS }) => {
	const renderCustomizedLabel = ({ payload }) => {
		return `${JSON.stringify(payload.percentage)} %`;
	};

	return (
		<PieChart width={390} height={300} className={`ringChart ${scrollClass}`}>
			<Pie
				data={statsData}
				cx={170}
				cy={150}
				innerRadius={100}
				outerRadius={130}
				fill="#8884d8"
				paddingAngle={1}
				// dataKey={dataKey}
				dataKey="percentage"
				label={renderCustomizedLabel}
				animationDuration={400}
				animationEasing="ease-in-out"
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

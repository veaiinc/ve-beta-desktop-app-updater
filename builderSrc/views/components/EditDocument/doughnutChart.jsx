import React, { memo } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const DoughnutChart = ({ scrollClass = '', statsData, title, COLORS, showToolTip = true }) => {
	const renderCustomizedLabel = ({ payload }) => {
		return `${JSON.stringify(payload.percentage)} %`;
	};

	const contentStyle = {
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		backdropFilter: 'blur(10px)',
		padding: '5px',
		borderRadius: '8px',
	};

	const labelStyle = {
		color: 'white',
	};

	// Default data for empty state - shows a full ring
	const defaultData = [
		{
			percentage: 100,
			name: 'No Data',
		},
	];

	const isValidStatsData = Array.isArray(statsData) && statsData?.length > 0;
	const chartData = isValidStatsData ? statsData : defaultData;
	const chartColors = isValidStatsData ? COLORS : ['#2A2A2A'];

	return (
		<PieChart width={390} height={300} className={`ringChart ${scrollClass}`}>
			<Pie
				data={chartData}
				cx={192}
				cy={150}
				innerRadius={85}
				outerRadius={125}
				fill="#8884d8"
				paddingAngle={isValidStatsData ? 1 : 0}
				dataKey="percentage"
				label={isValidStatsData ? renderCustomizedLabel : null}
				animationDuration={400}
				animationEasing="ease-in-out"
			>
				{chartData.map((entry, index) => (
					<Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
				))}
			</Pie>
			{showToolTip && isValidStatsData && (
				<Tooltip contentStyle={contentStyle} itemStyle={labelStyle} />
			)}
		</PieChart>
	);
};

export default memo(DoughnutChart);

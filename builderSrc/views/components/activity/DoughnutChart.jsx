import React, { memo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
	const RADIAN = Math.PI / 180;
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	return (
		<text
			x={x}
			y={y}
			fill="white"
			textAnchor={x > cx ? 'start' : 'end'}
			dominantBaseline="central"
		>
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	);
};

const defaultTooltipStyle = {
	backgroundColor: 'var(--card)',
	border: '1px solid var(--stroke)',
	borderRadius: '4px',
	padding: '8px',
	color: 'var(--primary-font)',
	fontSize: '12px',
	fontFamily: 'var(--primary-font-family)',
};

const defaultLabelStyle = {
	fill: 'var(--primary-font)',
	fontSize: '12px',
	fontFamily: 'var(--primary-font-family)',
};

const DoughnutChart = ({ statsData, title, COLORS, showToolTip = true }) => {
	const hasValidStats = statsData && statsData.length > 0;

	// If no valid stats, show a full ring
	const data = hasValidStats
		? statsData.map((item) => ({
				name: item.moduleType || item.interactionType || 'Unknown',
				value: title === 'Time Spent' ? item.duration : item.totalInteractionsCount,
		  }))
		: [{ name: 'No Data', value: 100 }];

	return (
		<ResponsiveContainer width="100%" height={300}>
			<PieChart>
				<Pie
					data={data}
					cx="50%"
					cy="50%"
					labelLine={false}
					label={renderCustomizedLabel}
					outerRadius={80}
					fill="#8884d8"
					dataKey="value"
					animationDuration={1000}
					animationBegin={0}
				>
					{data.map((entry, index) => (
						<Cell
							key={`cell-${index}`}
							fill={hasValidStats ? COLORS[index % COLORS.length] : '#262626'}
						/>
					))}
				</Pie>
				{showToolTip && (
					<Tooltip
						contentStyle={defaultTooltipStyle}
						labelStyle={defaultLabelStyle}
						formatter={(value, name) => [
							title === 'Time Spent' ? `${Math.floor(value / 1000)}s` : value,
							name,
						]}
					/>
				)}
			</PieChart>
		</ResponsiveContainer>
	);
};

export default memo(DoughnutChart);

import React, { memo, useCallback, useEffect, useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { RiArrowDropDownLine } from 'react-icons/ri';

import {
	Chart as ChartJS,
	LineElement,
	PointElement,
	LinearScale,
	TimeScale,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { DatePicker, Select } from 'antd';
import moment from 'moment';
import '../../../assets/scss/forms/formAnalytics.scss';
import { ReactComponent as UpDownArrow } from '../../../assets/svg/my_templates/up-down-arrow.svg';
import { CalendarOutlined } from '@ant-design/icons'; // Import Ant Design calendar icon

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend);

const { RangePicker } = DatePicker;
const { Option } = Select;

// Mock data for testing
const mockSummaryData = {
	formResponseSummary: {
		submissionTypes: [
			{ type: 'Submissions', count: 0 },
			{ type: 'Partial', count: 0 },
		],
		devices: [
			{ device: 'Desktop', count: 0 },
			{ device: 'Tablet', count: 0 },
			{ device: 'Mobile', count: 0 },
		],
		countries: [
			{ country: 'India', count: 0 },
			{ country: 'United States', count: 0 },
			{ country: 'Thailand', count: 0 },
			{ country: 'Indonesia', count: 0 },
			{ country: 'Vietnam', count: 0 },
		],
	},
};

const mockAnalyticsData = {
	formResponseAnalytics: [
		{ date: '2025-02-24', submissions: 500 },
		{ date: '2025-02-25', submissions: 600 },
		{ date: '2025-02-26', submissions: 800 },
		{ date: '2025-02-27', submissions: 1200 },
		{ date: '2025-02-28', submissions: 900 },
		{ date: '2025-03-01', submissions: 700 },
		{ date: '2025-03-02', submissions: 600 },
	],
};

const FormAnalytics = ({ formId }) => {
	const [dateRange, setDateRange] = useState([moment().subtract(30, 'days'), moment()]);
	const [selectedPeriod, setSelectedPeriod] = useState('Last 30 Days');
	const [summaryError, setSummaryError] = useState(null);
	const [analyticsError, setAnalyticsError] = useState(null);

	const startDate = dateRange[0].format('YYYY-MM-DD');
	const endDate = dateRange[1].format('YYYY-MM-DD');

	const summaryData = mockSummaryData;
	const analyticsData = mockAnalyticsData;
	const summaryLoading = false;
	const analyticsLoading = false;

	const chartData = useMemo(() => {
		if (!analyticsData?.formResponseAnalytics) return { labels: [], datasets: [] };

		const labels = analyticsData.formResponseAnalytics.map((item) => item.date);
		const data = analyticsData.formResponseAnalytics.map((item) => item.submissions);

		return {
			labels,
			datasets: [
				{
					label: 'Submissions',
					data,
					borderColor: '#fff',
					backgroundColor: (context) => {
						const chart = context.chart;
						const { ctx, chartArea } = chart;
						if (!chartArea) return null;
						const gradient = ctx.createLinearGradient(
							0,
							chartArea.bottom,
							0,
							chartArea.top,
						);
						gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
						gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
						return gradient;
					},
					fill: true,
					tension: 0.4,
				},
			],
		};
	}, [analyticsData]);

	const chartOptions = {
		scales: {
			x: {
				type: 'time',
				time: {
					unit: 'day',
				},
				grid: {
					display: false,
				},
				ticks: {
					color: '#fff',
				},
			},
			y: {
				beginAtZero: true,
				ticks: {
					color: '#fff',
					callback: (value) => {
						if (value >= 1000) return `${value / 1000}K`;
						return value;
					},
				},
				grid: {
					color: 'rgba(255, 255, 255, 0.1)',
				},
			},
		},
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				backgroundColor: '#333',
				titleColor: '#fff',
				bodyColor: '#fff',
			},
		},
		maintainAspectRatio: false,
	};

	const handleDateRangeChange = useCallback((dates) => {
		if (dates) {
			setDateRange(dates);
			setSelectedPeriod('Custom');
		}
	}, []);

	const handlePeriodChange = useCallback((value) => {
		setSelectedPeriod(value);
		switch (value) {
			case 'Last 7 Days':
				setDateRange([moment().subtract(7, 'days'), moment()]);
				break;
			case 'Last 30 Days':
				setDateRange([moment().subtract(30, 'days'), moment()]);
				break;
			case 'Last 90 Days':
				setDateRange([moment().subtract(90, 'days'), moment()]);
				break;
			default:
				break;
		}
	}, []);

	if (summaryError || analyticsError) {
		return (
			<div className="form-analytics">
				<div className="error-container p-4 bg-red-900/20 rounded-lg">
					<h3 className="text-red-500 font-semibold mb-2">Error Loading Analytics</h3>
					{summaryError && (
						<p className="text-red-400 mb-2">Summary Error: {summaryError.message}</p>
					)}
					{analyticsError && (
						<p className="text-red-400">Analytics Error: {analyticsError.message}</p>
					)}
					<button
						onClick={() => {
							setSummaryError(null);
							setAnalyticsError(null);
						}}
						className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="form-analytics">
			<div className="analytics-content">
				<div className="submissions-section">
					<div className="submissions-header">
						<h3>Submissions</h3>
						<div className="date-filter">
							<Select
								value={selectedPeriod}
								onChange={handlePeriodChange}
								suffixIcon={
									<RiArrowDropDownLine
										style={{ color: '#ffff', height: '35px', width: '25px' }}
									/>
								}
							>
								<Option value="Last 7 Days">Last 7 Days</Option>
								<Option value="Last 30 Days">Last 30 Days</Option>
								<Option value="Last 90 Days">Last 90 Days</Option>
								<Option value="Custom">Custom</Option>
							</Select>
							<RangePicker
								suffixIcon={<CalendarOutlined style={{ color: '#fff' }} />}
								value={dateRange}
								onChange={handleDateRangeChange}
								format="MMM D"
								allowClear={false}
							/>
						</div>
					</div>
					<div className="submissions-graph">
						{analyticsLoading ? (
							<p>Loading...</p>
						) : (
							<div style={{ height: '300px' }}>
								<Line data={chartData} options={chartOptions} />
							</div>
						)}
					</div>
				</div>

				<div className="filters-section">
					<div className="filter-group">
						<h4>Submission Type</h4>
						{summaryLoading ? (
							<p>Loading...</p>
						) : (
							summaryData?.formResponseSummary?.submissionTypes?.map((type) => (
								<div key={type.type} className="filter-item">
									<span>{type.type}</span>
									<span>{type.count}</span>
								</div>
							))
						)}
					</div>

					<div className="filter-group">
						<h4>Devices</h4>
						{summaryLoading ? (
							<p>Loading...</p>
						) : (
							summaryData?.formResponseSummary?.devices?.map((device) => (
								<div key={device.device} className="filter-item">
									<span>{device.device}</span>
									<span>{device.count}</span>
								</div>
							))
						)}
					</div>

					<div className="filter-group">
						<h4>Countries</h4>
						{summaryLoading ? (
							<p>Loading...</p>
						) : (
							summaryData?.formResponseSummary?.countries?.map((country) => (
								<div key={country.country} className="filter-item">
									<span>{country.country}</span>
									<span>{country.count}</span>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(FormAnalytics);

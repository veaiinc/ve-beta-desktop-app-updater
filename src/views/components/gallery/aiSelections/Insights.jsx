import React from 'react';
import '../../../../assets/scss/gallery/insights.scss';
import Table from './Table';
import { ReactComponent as DownloadIcon } from '../../../../assets/svg/gallery/download2.svg';
import { ReactComponent as SearchIcon } from '../../../../assets/svg/workflow/search.svg';
import { ReactComponent as FilterIcon } from '../../../../assets/svg/chat/filter.svg';
const tableData = [
	{
		name: 'John Doe',
		email: 'john.doe@example.com',
		mobileNumber: '+1 234-567-8901',
		registerStage: 'Completed',
		date: '2024-03-20',
	},
	{
		name: 'Jane Smith',
		email: 'jane.smith@example.com',
		mobileNumber: '+1 345-678-9012',
		registerStage: 'Pending',
		date: '2024-03-19',
	},
	{
		name: 'Mike Johnson',
		email: 'mike.j@example.com',
		mobileNumber: '+1 456-789-0123',
		registerStage: 'In Progress',
		date: '2024-03-18',
	},
	{
		name: 'Sarah Williams',
		email: 'sarah.w@example.com',
		mobileNumber: '+1 567-890-1234',
		registerStage: 'Completed',
		date: '2024-03-17',
	},
	{
		name: 'Robert Brown',
		email: 'robert.b@example.com',
		mobileNumber: '+1 678-901-2345',
		registerStage: 'Pending',
		date: '2024-03-16',
	},
	{
		name: 'John Doe',
		email: 'john.doe@example.com',
		mobileNumber: '+1 234-567-8901',
		registerStage: 'Completed',
		date: '2024-03-20',
	},
	{
		name: 'Jane Smith',
		email: 'jane.smith@example.com',
		mobileNumber: '+1 345-678-9012',
		registerStage: 'Pending',
		date: '2024-03-19',
	},
	{
		name: 'Mike Johnson',
		email: 'mike.j@example.com',
		mobileNumber: '+1 456-789-0123',
		registerStage: 'In Progress',
		date: '2024-03-18',
	},
	{
		name: 'Sarah Williams',
		email: 'sarah.w@example.com',
		mobileNumber: '+1 567-890-1234',
		registerStage: 'Completed',
		date: '2024-03-17',
	},
	{
		name: 'Robert Brown',
		email: 'robert.b@example.com',
		mobileNumber: '+1 678-901-2345',
		registerStage: 'Pending',
		date: '2024-03-16',
	},
];

const Insights = () => {
	const data = [
		{
			name: 'Number of images',
			count: 999,
		},
		{
			name: 'People',
			count: 999,
		},
		{
			name: 'Storage',
			count: 72.5,
		},
	];
	const details = [
		{
			name: 'All Views',
			number: 33,
		},
		{
			name: 'Face Scan',
			number: 22,
		},
		{
			name: 'Guest views',
			number: 11,
		},
		{
			name: 'Client views',
			number: 11,
		},
	];
	return (
		<div className="insightsContainer">
			<div className="insightsData">
				{data.map((ele, index) => (
					<div key={index} className="insightsData-item">
						<p className="itemName">{ele.name}</p>
						<p className="count">
							{ele.count}
							{ele.name === 'Storage' && <span>GB</span>}
						</p>
					</div>
				))}
			</div>
			<div className="insightsHeader">
				<div className="heading">
					<p>Client gallery views</p>
					<p className="subHeading">People who open with gallery link</p>
				</div>
				<div className="insightsHeader-icons">
					<p>
						<SearchIcon />
					</p>
					<p>
						<FilterIcon />
					</p>
					<p>
						<DownloadIcon />
					</p>
				</div>
			</div>
			<div className="insightsDetails">
				{details.map((ele, index) => (
					<div key={index} className="insightsDetails-item">
						<p className="itemName">{ele.name}</p>
						<p className="count">{ele.number}</p>
					</div>
				))}
			</div>
			<Table tableData={tableData} thead={'Register Stage'} />
		</div>
	);
};

export default Insights;

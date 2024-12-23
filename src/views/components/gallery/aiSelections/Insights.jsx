import React, { useContext, useEffect, useState, useCallback } from 'react';
import '../../../../assets/scss/gallery/insights.scss';
import { message } from 'antd';
import Table from './Table';
import { ReactComponent as DownloadIcon } from '../../../../assets/svg/gallery/download2.svg';
import { ReactComponent as SearchIcon } from '../../../../assets/svg/workflow/search.svg';
import { ReactComponent as FilterIcon } from '../../../../assets/svg/chat/filter.svg';
import MainPopup from '../../modalsV2/gallery/RenameGallery';
import Context from '../../../../context/context';
import { ReactComponent as CloseIcon } from '../../../../assets/svg/sidebar/CrossSvg.svg';
import { useInView } from 'react-intersection-observer';
import { debounce } from 'lodash';
const filterOptions = ['Today', 'Last Week', 'Last Month', 'Last Year'];

const Insights = () => {
	const {
		galleryInfo: {
			tenantAlbums,
			aiFace,
			preRegisteredUsers,
			insightsVisitors,
			getInsightVisitors,
			getAiFace,
			getAiFaceCount,
		},
	} = useContext(Context);
	const [showFilter, setShowFilter] = useState(false);
	const [selectedFilter, setSelectedFilter] = useState('All Time');
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState('');
	const [showSearchBar, setShowSearchBar] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [date, setDate] = useState('');
	const ITEMS_PER_PAGE = 20;

	const { ref, inView } = useInView({
		threshold: 0.5,
	});

	const loadMore = async () => {
		if (inView && !isLoading && insightsVisitors?.hasNextPage) {
			setIsLoading(true);
			const pathname = window.location.pathname;
			const galleryId = pathname.split('/galleries/')[1];
			const nextPage = currentPage + 1;
			const dateRange = calculateDateRange(selectedFilter);

			await getInsightVisitors(galleryId, nextPage, ITEMS_PER_PAGE, searchQuery, dateRange);
			setCurrentPage(nextPage);
			setIsLoading(false);
		}
	};

	const calculateDateRange = (filter) => {
		const now = new Date();
		const endDate = new Date(now.setHours(23, 59, 59, 999));
		let startDate;

		switch (filter) {
			case 'Today':
				startDate = new Date();
				startDate.setHours(0, 0, 0, 0);
				break;

			case 'Last Week':
				startDate = new Date();
				startDate.setDate(startDate.getDate() - 7);
				startDate.setHours(0, 0, 0, 0);
				break;

			case 'Last Month':
				startDate = new Date();
				startDate.setMonth(startDate.getMonth() - 1);
				startDate.setHours(0, 0, 0, 0);
				break;

			case 'Last Year':
				startDate = new Date();
				startDate.setFullYear(startDate.getFullYear() - 1);
				startDate.setHours(0, 0, 0, 0);
				break;

			case 'Custom Date':
				startDate = new Date(date);
				startDate.setHours(0, 0, 0, 0);
				endDate.setTime(startDate.getTime());
				endDate.setHours(23, 59, 59, 999);
				break;

			default:
				startDate = new Date(2000, 0, 1);
				startDate.setHours(0, 0, 0, 0);
		}

		return {
			startDate: Math.floor(startDate.getTime() / 1000),
			endDate: Math.floor(endDate.getTime() / 1000),
		};
	};

	useEffect(() => {
		const pathname = window.location.pathname;
		const galleryId = pathname.split('/galleries/')[1];
		if (galleryId) {
			if (!aiFace) {
				getAiFace?.(galleryId, 1, 40, true);
			}
			setCurrentPage(1);
			const dateRange = calculateDateRange(selectedFilter);
			// Always fetch data when filter/search changes or when resetting to show all data
			getInsightVisitors(galleryId, 1, ITEMS_PER_PAGE, searchQuery, dateRange);
		}
	}, [searchQuery, selectedFilter]);

	useEffect(() => {
		loadMore();
	}, [inView, isLoading, currentPage, insightsVisitors?.hasNextPage]);

	const downloadCSV = (data) => {
		if (!data || data.length === 0) {
			message.error('No data available to download');
			return;
		}
		const headerMapping = {
			name: 'Name',
			email: 'Email',
			mobileNumber: 'Mobile Number',
			visitorRole: 'Login Type',
			date: 'Date and Time',
		};
		const csvRows = [];
		const headers = Object.keys(headerMapping);

		csvRows.push(Object.values(headerMapping).join(','));
		for (const row of data) {
			const values = headers.map((header) =>
				JSON.stringify(row[header], (key, value) => (value === null ? '' : value)),
			);
			csvRows.push(values.join(','));
		}

		const csvString = csvRows.join('\n');
		const blob = new Blob([csvString], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.setAttribute('hidden', '');
		a.setAttribute('href', url);
		a.setAttribute('download', 'insights.csv');
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	const visitorData =
		insightsVisitors?.docs?.map((visitor) => {
			const date = new Date(visitor.createdAt * 1000);
			const formattedDate = date.toLocaleString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				hour12: true,
			});

			return {
				email: visitor.email || '-',
				name: `${visitor.firstName} ${visitor.lastName}`,
				mobileNumber: visitor.phoneNumber || '-',
				registerStage: visitor.category || '-',
				visitorRole: visitor.visitorRole || '-',
				date: formattedDate,
				galleryTitle: visitor.galleryTitle || '-',
			};
		}) || [];

	const bytesToGigabytes = (bytes) => {
		const bytesPerGB = 1024 ** 3;
		return (bytes / bytesPerGB).toFixed(2);
	};

	const data = [
		{
			name: 'Number of images',
			count: tenantAlbums?.storageDetails?.imagesCountWithVersions,
		},
		{
			name: 'People',
			count: aiFace?.numberOfFaces || 0,
		},
		{
			name: 'Storage',
			count: bytesToGigabytes(tenantAlbums?.storageDetails?.storage),
		},
	];

	const details = [
		{
			name: 'All Views',
			number: visitorData.length || 0,
		},
		{
			name: 'Face Scan',
			number: visitorData.filter((visitor) => visitor.visitorRole === 'face').length || 0,
		},
		{
			name: 'Guest views',
			number: visitorData.filter((visitor) => visitor.visitorRole === 'guest').length || 0,
		},
		{
			name: 'Client views',
			number: visitorData.filter((visitor) => visitor.visitorRole === 'master').length || 0,
		},
	];

	const debouncedSearch = useCallback(
		debounce((value) => {
			setSearchQuery(value);
		}, 200),
		[],
	);

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
					{showSearchBar ? (
						<div className="search-container">
							<input
								type="text"
								placeholder=""
								value={searchQuery}
								onChange={(e) => debouncedSearch(e.target.value)}
								className="search-bar"
							/>
							<p
								onClick={() => {
									debouncedSearch('');
									setShowSearchBar(!showSearchBar);
								}}
							>
								<CloseIcon />
							</p>
						</div>
					) : (
						<p onClick={() => setShowSearchBar(!showSearchBar)}>
							<SearchIcon />
						</p>
					)}
					<p onClick={() => downloadCSV(visitorData)}>
						<DownloadIcon />
					</p>
					<p className="filter-container" onClick={() => setShowFilter(!showFilter)}>
						<FilterIcon />

						{showFilter && (
							<div className="filter-dropdown">
								<div className="filter-option">Filter by</div>
								<hr
									style={{
										width: '100%',
										border: '1px solid rgba(255, 255, 255, 0.1)',
									}}
								/>
								{filterOptions.map((option, index) => (
									<div
										key={index}
										className="filter-option"
										onClick={() => {
											setSelectedFilter(option);
											setShowFilter(false);
										}}
									>
										{option}
									</div>
								))}
								<hr
									style={{
										width: '100%',
										border: '1px solid rgba(255, 255, 255, 0.1)',
									}}
								/>
								<div
									className="filter-option"
									onClick={() => setShowDatePicker(!showDatePicker)}
								>
									Custom Date
								</div>
							</div>
						)}
					</p>
					<MainPopup
						open={showDatePicker}
						onClose={() => setShowDatePicker(false)}
						heading="Custom Date"
						inputType="date"
						placeholder="Select Date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						onSubmit={() => {
							setSelectedFilter('Custom Date');
							setShowDatePicker(false);
						}}
					/>
				</div>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginRight: '10px',
				}}
			>
				<div className="insightsDetails">
					{details.map((ele, index) => (
						<div key={index} className="insightsDetails-item">
							<p className="itemName">{ele.name}</p>
							<p className="count">{ele.number}</p>
						</div>
					))}
				</div>
				<div className="filtersDiv">
					{selectedFilter !== 'All Time' && (
						<div
							className="selected-filter"
							style={{
								display: 'flex',
								flexDirection: 'row',
								width: '215px',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<div style={{ color: '#fff', display: 'flex', alignItems: 'center' }}>
								Filtered By
							</div>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									border: '1px solid rgba(255, 255, 255, 0.1)',
									borderRadius: '16px',
									padding: '10px',
								}}
							>
								<span style={{ color: '#fff' }}>{selectedFilter}</span>
								<CloseIcon
									onClick={() => setSelectedFilter('All Time')}
									style={{
										cursor: 'pointer',
										width: '12px',
										height: '12px',
										marginLeft: '8px',
									}}
								/>
							</div>
						</div>
					)}
				</div>
			</div>
			<div ref={ref}>
				<Table tableData={visitorData} thead={'Category'} />
			</div>
		</div>
	);
};

export default Insights;

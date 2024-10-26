import React, { memo, useState, useCallback } from 'react';
import '../../../assets/scss/sales/activity/activityComponents.scss';
import { ReactComponent as DotSvg } from '../../../assets/svg/activity/dot.svg';
import { ReactComponent as DownSvg } from '../../../assets/svg/activity/down.svg';
import { ReactComponent as RightSvg } from '../../../assets/svg/activity/right.svg';
import { ReactComponent as GallerySvg } from '../../../assets/svg/activity/galleryIcon.svg';
import DoughnutChart from '../../components/activity/DoughnutChart.jsx';

const dummyData = [
	{ label: 'Proposal', timeSpent: '00:12:34', percentage: '50%' },
	{ label: 'Proposal Summary', timeSpent: '00:12:34', percentage: '12.5%' },
	{ label: 'Invoice', timeSpent: '00:08:23', percentage: '4.17%' },
	{ label: 'Contract', timeSpent: '00:04:21', percentage: '16.67%' },
	{ label: 'Thank You', timeSpent: '00:04:21', percentage: '16.67%' },
];

const dummyLabelData = [
	{
		label: 'Header Block',
		timeSpent: '00:12:34',
		percentage: '25%',
	},
	{
		label: 'Text Block',
		timeSpent: '00:12:34',
		percentage: '12.5%',
	},
	{
		label: 'Image Block',
		timeSpent: '00:12:34',
		percentage: '4.1%',
	},
	{
		label: 'List Block',
		timeSpent: '00:12:34',
		percentage: '16%',
	},
	{
		label: 'Gallery Block',
		timeSpent: '00:12:34',
		percentage: '12%',
	},
	{
		label: 'Magazine Block',
		timeSpent: '00:12:34',
		percentage: '12.7%',
	},
	{
		label: 'Testimonial Block',
		timeSpent: '00:12:34',
		percentage: '3.5%',
	},
	{
		label: 'Service Block',
		timeSpent: '00:12:34',
		percentage: '5%',
	},
	{
		label: 'Event Block',
		timeSpent: '00:12:34',
		percentage: '9%',
	},
];

const ActivityMetrics = ({ title, labelsData, labelItemsData }) => {
	// console.log('labelsData: ' + JSON.stringify(labelsData, null, 2));
	// console.log('labelItemsData: ' + JSON.stringify(labelItemsData, null, 2));
	const [info, setInfo] = useState({
		isLabelSelected: true,
		activeLabelItem: null,
	});

	const handleShowLabels = () => {
		setInfo((prevState) => ({
			...prevState,
			isLabelSelected: !prevState.isLabelSelected,
		}));
	};

	const handleActivelable = useCallback((selectedLabel, section) => {
		console.log('Label Data ===>', selectedLabel);
		setInfo((prevState) => ({
			...prevState,
			activeLabelItem: selectedLabel,
			isLabelSelected: false,
		}));

		// Scroll to the chart view
		const scrollClass = section === 'Time Spent' ? `.timeSpentChart` : `.interactionChart`;

		const chartElement = document.querySelector(scrollClass);

		if (chartElement) {
			chartElement.scrollIntoView({ behavior: 'smooth' });
		}
	}, []);

	const formatedLabelStats = dummyData.map((item) => {
		const { label, percentage, ...rest } = item;
		return {
			name: label,
			percentage: parseFloat(percentage),
			...rest,
		};
	});

	const formatedLabelItemStats = dummyLabelData.map((item) => {
		const { label, percentage, ...rest } = item;
		return {
			name: label,
			percentage: parseFloat(percentage),
			...rest,
		};
	});

	// Function to transform labelItemsData for InteractionChart
	const transformLabelItemsData = (data) => {
		return data.map((item) => {
			// Check if the item has 'totalCount' (specific to InteractionDetail)
			if (item.hasOwnProperty('totalCount')) {
				// Rename 'totalCount' to 'totalInteractionsCount'
				const { totalCount, ...rest } = item;
				return {
					...rest,
					totalInteractionsCount: totalCount,
				};
			}
			// If 'totalCount' does not exist, return the item unchanged
			return item;
		});
	};

	return (
		<div className="activityMetricsContainer">
			<div className="metricsTitle">{title}</div>

			<div className="metricsContentWrapper">
				<div className="metricsContentContainer">
					<div className="metricsLablesWrapper">
						<div className="headerWrapper">
							<span>Label</span>
							<span>{title}</span>
							<span>%</span>
						</div>

						{info?.isLabelSelected ? (
							//LablesItewmRows ==>
							<div className="lablesContainer">
								{!labelsData || labelsData === 0 ? (
									// Fallback UI when labelsData is empty
									<div className="lableItemRow">
										<div className="nameLable">
											<div className="dot">
												<DotSvg />
											</div>
											<div>N/A</div>
										</div>
										<div className="metricsLables">
											<div>N/A</div>{' '}
											<div className="percentageWithArrow">
												<span className="percentageValue">N/A</span>{' '}
												<span className="downArrow">
													<DownSvg />
												</span>
											</div>
										</div>
									</div>
								) : (
									// Render the data when labelsData is not empty
									labelsData?.map((item, index) => (
										<div
											key={index}
											className="lableItemRow"
											onClick={() => handleActivelable(item, title)}
										>
											<div className="nameLable">
												<div className="dot">
													<DotSvg />
												</div>
												<div>{item?.moduleType || 'Label Name'}</div>
											</div>
											<div className="metricsLables">
												<div>
													{title === 'Interactions'
														? item?.totalInteractionsCount
														: item?.duration}
												</div>

												<div className="percentageWithArrow">
													<span className="percentageValue">
														{item?.percentage || '%'}
													</span>
													<span className="downArrow">
														<DownSvg />
													</span>
												</div>
											</div>
										</div>
									))
								)}
							</div>
						) : (
							// Render selected Label Data

							<div className="lablesContainer">
								{
									//SelectedLabel ==>

									<div
										onClick={handleShowLabels}
										className="lableItemRow selectedLabelItem"
									>
										<div className="nameLable">
											{info?.activeLabelItem?.moduleType}
										</div>
										<div className="metricsLables">
											<div>
												{title === 'Interactions'
													? info?.activeLabelItem?.totalInteractionsCount
													: info?.activeLabelItem?.duration}
											</div>
											<div className="percentageWithArrow">
												<span className="percentageValue">
													{info?.activeLabelItem?.percentage || '%'}
												</span>
												<span className="rightArrow">
													<RightSvg />
												</span>
											</div>
										</div>
									</div>
								}
								{!labelItemsData || labelItemsData.length === 0 ? (
									// Fallback UI when labelItemsData is empty
									<div className="lableItemRow">
										<div className="nameLable">
											<div className="dot">
												<DotSvg />
											</div>
											<div className="selectedBlockSvg">
												<GallerySvg />
											</div>
											<div>N/A</div> {/* Display N/A for content */}
										</div>
										<div className="metricsLables">
											<div>N/A</div>{' '}
											{/* Display N/A for duration or totalCount */}
											<div className="percentageWithArrow">
												<span className="percentageValue">N/A</span>{' '}
												{/* Display N/A for percentage */}
											</div>
										</div>
									</div>
								) : (
									// Render the Internal Data when labelItemsData is not empty
									labelItemsData
										.filter(
											(item) =>
												item?.moduleType ===
												info?.activeLabelItem?.moduleType,
										)
										.map((item, index) => (
											<div key={index} className="lableItemRow">
												<div className="nameLable">
													<div className="dot">
														<DotSvg />
													</div>
													<div className="selectedBlockSvg">
														<GallerySvg />
													</div>
													<div>{item?.content}</div>
												</div>
												<div className="metricsLables">
													<div>{item?.duration || item?.totalCount}</div>
													<div className="percentageWithArrow">
														<span className="percentageValue">
															{item?.percentage || '%'}
														</span>
													</div>
												</div>
											</div>
										))
								)}
							</div>
						)}
					</div>

					<div className="metricsChartWrapper">
						<DoughnutChart
							scrollClass={
								title === 'Interactions' ? 'interactionChart' : 'timeSpentChart'
							}
							statsData={
								info?.isLabelSelected
									? labelsData
									: transformLabelItemsData(labelItemsData)
							}
							title={title}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(ActivityMetrics);

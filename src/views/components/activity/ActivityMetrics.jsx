import React, { memo, useState, useCallback } from 'react';
import '../../../assets/scss/sales/activity/activityComponents.scss';
import { ReactComponent as DownSvg } from '../../../assets/svg/activity/down.svg';
import { ReactComponent as RightSvg } from '../../../assets/svg/activity/right.svg';
import DotSvg from '../../../assets/svg/activity/DotSvg.jsx';
import { ReactComponent as GallerySvg } from '../../../assets/svg/activity/galleryIcon.svg';
import DoughnutChart from '../../components/activity/DoughnutChart.jsx';
import Skeleton from 'react-loading-skeleton';
import Spinner from '../loaders/Spinner.jsx';

const ActivityMetrics = ({ title, labelsData, labelItemsData }) => {
	// console.log('labelsData: ' + JSON.stringify(labelsData, null, 2));
	// console.log('labelItemsData: ' + JSON.stringify(labelItemsData, null, 2));
	const [info, setInfo] = useState({
		isLabelSelected: true,
		activeLabelItem: null,
		COLORS: ['#FFCE56', '#FF9F40', '#36A2EB', '#9966FF', '#FF6384'],
	});

	const handleShowLabels = () => {
		setInfo((prevState) => ({
			...prevState,
			isLabelSelected: !prevState.isLabelSelected,
		}));
	};

	const handleActivelable = useCallback((selectedLabel, section) => {
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

	// Function to transform labelItemsData for InteractionChart
	const transformLabelItemsData = (data) => {
		const selectedlabelitems = data.filter(
			(item) => item.moduleType === info?.activeLabelItem?.moduleType,
		);

		return selectedlabelitems.map((item) =>
			item.hasOwnProperty('totalCount')
				? { ...item, totalInteractionsCount: item.totalCount }
				: item,
		);
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
								{!labelsData || labelsData === 0
									? // Fallback UI when labelsData is empty
									  [{}, {}, {}].map((ele, index) => (
											<Skeleton
												height={'59px'}
												style={{ borderRadius: '16px' }}
												key={index}
											/>
									  ))
									: // Render the data when labelsData is not empty
									  labelsData?.map((item, index) => (
											<div
												key={index}
												className="lableItemRow"
												onClick={() => handleActivelable(item, title)}
											>
												<div className="nameLable">
													<div className="dot">
														<DotSvg
															fill={
																info?.COLORS[
																	index % info.COLORS.length
																]
															}
														/>
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
									  ))}
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
								{!labelItemsData || labelItemsData.length === 0
									? // Fallback UI when labelItemsData is empty
									  [{}, {}, {}].map((ele, index) => (
											<Skeleton
												height={'59px'}
												style={{ borderRadius: '16px' }}
												key={index}
											/>
									  ))
									: // Render the Internal Data when labelItemsData is not empty
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
															<DotSvg
																fill={
																	info?.COLORS[
																		index % info.COLORS.length
																	]
																}
															/>
														</div>
														<div className="selectedBlockSvg">
															<GallerySvg />
														</div>
														<div>{item?.content}</div>
													</div>
													<div className="metricsLables">
														<div>
															{item?.duration || item?.totalCount}
														</div>
														<div className="percentageWithArrow">
															<span className="percentageValue">
																{item?.percentage || '%'}
															</span>
														</div>
													</div>
												</div>
											))}
							</div>
						)}
					</div>

					<div className="metricsChartWrapper">
						{!labelsData || !labelsData ? (
							<Spinner width={'50px'} height={'50px'} />
						) : (
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
								COLORS={info?.COLORS}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(ActivityMetrics);

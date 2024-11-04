import React, { memo, useState, useCallback, useEffect } from 'react';
import '../../../assets/scss/sales/activity/activityComponents.scss';
import { ReactComponent as DownSvg } from '../../../assets/svg/activity/down.svg';
import { ReactComponent as RightSvg } from '../../../assets/svg/activity/right.svg';
import DotSvg from '../../../assets/svg/activity/DotSvg.jsx';
import { ReactComponent as GallerySvg } from '../../../assets/svg/activity/galleryIcon.svg';
import { ReactComponent as HeaderSvg } from '../../../assets/svg/activity/header.svg';
import { ReactComponent as TextSvg } from '../../../assets/svg/activity/text.svg';
import { ReactComponent as ImageSvg } from '../../../assets/svg/activity/image.svg';
import { ReactComponent as ListSvg } from '../../../assets/svg/activity/list.svg';
import { ReactComponent as TestimonialSvg } from '../../../assets/svg/activity/testimonial.svg';
import { ReactComponent as LinkInteractionSvg } from '../../../assets/svg/activity/linkInteraction.svg';
import { ReactComponent as BlockUnfoldSvg } from '../../../assets/svg/activity/blockUnfold.svg';
import { ReactComponent as QuoteChangedSvg } from '../../../assets/svg/activity/money.svg';
import { ReactComponent as ButtonInteractionSvg } from '../../../assets/svg/activity/buttonIteraction.svg';
import DoughnutChart from '../../components/activity/DoughnutChart.jsx';
import Skeleton from 'react-loading-skeleton';
import Spinner from '../loaders/Spinner.jsx';

const ActivityMetrics = ({ title, labelsData, labelItemsData, formatTime }) => {
	const [info, setInfo] = useState({
		isLabelSelected: true,
		activeLabelItem: null,
		labelsData: [],
		labelItemsData: [],
		COLORS: [
			'#FFCE56',
			'#FF9F40',
			'#36A2EB',
			'#9966FF',
			'#FF6384',
			'#a34f72',
			'#3e8cd2',
			'#f2c94c',
			'#e7638c',
			'#61c56a',
		],
	});

	useEffect(() => {
		// Function to determine the total based on title
		const calculateTotal = (data, field) =>
			data?.reduce((total, item) => total + (item[field] || 0), 0);

		// Calculate total for labelsData based on title
		const labelsTotal =
			title === 'Time Spent'
				? calculateTotal(labelsData, 'duration')
				: calculateTotal(labelsData, 'totalInteractionsCount');

		// Add percentages to labelsData items based on title
		const labelsDataWithPercentages = labelsData?.map((item) => ({
			...item,
			percentage:
				title === 'Time Spent'
					? Number(((item.duration / labelsTotal) * 100).toFixed(2))
					: Number(((item.totalInteractionsCount / labelsTotal) * 100).toFixed(2)),
		}));

		// Calculate total for labelItemsData based on title
		const labelItemsTotal =
			title === 'Time Spent'
				? calculateTotal(labelItemsData, 'duration')
				: calculateTotal(labelItemsData, 'totalCount');

		// Add percentages to labelItemsData items based on title
		const labelItemsDataWithPercentages = labelItemsData?.map((item) => ({
			...item,
			percentage:
				title === 'Time Spent'
					? Number(((item.duration / labelItemsTotal) * 100).toFixed(2))
					: Number(((item.totalCount / labelItemsTotal) * 100).toFixed(2)),
		}));

		// Update state with calculated data
		setInfo((prevState) => ({
			...prevState,
			labelsData: labelsDataWithPercentages,
			labelItemsData: labelItemsDataWithPercentages,
		}));
	}, [title, labelsData, labelItemsData]);

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

	const labelsItemIconMapper = {
		text: <TextSvg />,
		image: <GallerySvg />,
		header: <HeaderSvg />,
		list: <ListSvg />,
		video: <ImageSvg />,
		gallery: <GallerySvg />,
		testimonial: <TestimonialSvg />,
		buttonInteraction: <ButtonInteractionSvg />,
		linkInteraction: <LinkInteractionSvg />,
		blockUnfolded: <BlockUnfoldSvg />,
		quoteChanged: <QuoteChangedSvg />,
		moduleNavigation: <ButtonInteractionSvg />,
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
								{!info?.labelsData || info?.labelsData.length === 0
									? // Fallback UI when labelsData is empty
									  [{}, {}, {}].map((ele, index) => (
											<Skeleton
												height={'59px'}
												style={{ borderRadius: '16px' }}
												key={index}
											/>
									  ))
									: // Render the data when labelsData is not empty
									  info?.labelsData?.map((item, index) => (
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
															: formatTime(item?.duration)}
													</div>

													<div className="percentageWithArrow">
														<span className="percentageValue">
															{`${item?.percentage} %` || '%'}
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
													{`${info?.activeLabelItem?.percentage} %`}
												</span>
												<span className="rightArrow">
													<RightSvg />
												</span>
											</div>
										</div>
									</div>
								}
								{!info?.labelItemsData || info?.labelItemsData.length === 0
									? // Fallback UI when labelItemsData is empty
									  [{}, {}, {}].map((ele, index) => (
											<Skeleton
												height={'59px'}
												style={{ borderRadius: '16px' }}
												key={index}
											/>
									  ))
									: // Render the Internal Data when labelItemsData is not empty
									  info?.labelItemsData
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
															{labelsItemIconMapper[
																item.sectionType
															] ||
																labelsItemIconMapper[
																	item.interactionType
																] || <TestimonialSvg />}
														</div>
														<div>{item?.content}</div>
													</div>
													<div className="metricsLables">
														<div>
															{item?.duration || item?.totalCount}
														</div>
														<div className="percentageWithArrow">
															<span className="percentageValue">
																{`${item?.percentage} %`}
															</span>
														</div>
													</div>
												</div>
											))}
							</div>
						)}
					</div>

					<div className="metricsChartWrapper">
						{!info?.labelsData || !info?.labelsData ? (
							<Spinner width={'50px'} height={'50px'} />
						) : (
							<DoughnutChart
								scrollClass={
									title === 'Interactions' ? 'interactionChart' : 'timeSpentChart'
								}
								statsData={
									info?.isLabelSelected
										? info?.labelsData
										: transformLabelItemsData(info?.labelItemsData)
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

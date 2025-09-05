import React, { memo, useState, useEffect } from 'react';
import '../../../assets/scss/document/documentAnalytics.scss';
// import DoughnutChart from '../../components/activity/DoughnutChart.jsx';
import { ReactComponent as DownSvg } from '../../../assets/svg/document/down.svg';
import { ReactComponent as RightSvg } from '../../../assets/svg/document/right.svg';
import { ReactComponent as DotSvg } from '../../../assets/svg/document/dot.svg';
import { ReactComponent as GallerySvg } from '../../../assets/svg/document/gallery.svg';
import { ReactComponent as HeaderSvg } from '../../../assets/svg/document/header.svg';
import { ReactComponent as TextSvg } from '../../../assets/svg/document/text.svg';
import { ReactComponent as ImageSvg } from '../../../assets/svg/document/image.svg';
import { ReactComponent as ListSvg } from '../../../assets/svg/document/list.svg';
import { ReactComponent as TestimonialSvg } from '../../../assets/svg/document/testimonial.svg';
import { ReactComponent as LinkInteractionSvg } from '../../../assets/svg/document/linkInteraction.svg';
import { ReactComponent as BlockUnfoldSvg } from '../../../assets/svg/document/blockUnfold.svg';
import { ReactComponent as QuoteChangedSvg } from '../../../assets/svg/document/quoteChanged.svg';
import { ReactComponent as ButtonInteractionSvg } from '../../../assets/svg/document/buttonInteraction.svg';
import DoughnutChart from './doughnutChart';
import Skeleton from 'react-loading-skeleton';
import Spinner from '../loaders/Spinner.jsx';

const SessionMetric = ({
	title,
	labelsData,
	labelItemsData,
	loading,
	formatTime,
	showChartToolTip = true,
}) => {
	const [info, setInfo] = useState({
		isLabelSelected: false,
		activeLabelItem: null,
		labelsData: null,
		labelItemsData: null,
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
		setInfo((prevInfo) => ({
			...prevInfo,
			isLabelSelected: !prevInfo.isLabelSelected,
		}));
	};

	const handleActivelable = (label) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			activeLabelItem: label,
		}));
	};

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
		<div className="sessionDetailsWrapper">
			<div className="sessionChartContainer">
				{loading ? (
					<div className="spinnerWrapper">
						<Spinner width={'50px'} height={'50px'} />
					</div>
				) : (
					<DoughnutChart
						scrollClass={
							title === 'Interactions' ? 'interactionChart' : 'timeSpentChart'
						}
						statsData={
							!info?.isLabelSelected
								? info?.labelsData?.map(item => ({
									name: item.moduleType,
									percentage: item.percentage
								}))
								: transformLabelItemsData(info?.labelItemsData)?.map(item => ({
									name: item.content,
									percentage: item.percentage
								}))
						}
						title={title}
						COLORS={info?.COLORS}
						showToolTip={showChartToolTip}
					/>
				)}
			</div>

			<div className="sessionLablesContainer">
				{/* <div className="headerContainer">
					<span>Label</span>
					<span>{title}</span>
					<span>%</span>
				</div> */}

				{!info?.isLabelSelected ? (
					//LablesItewmRows ==>
					<div className="lablesContainer">
						{loading ? (
							// Fallback UI when labelsData is empty
							[{}, {}, {}].map((ele, index) => (
								<Skeleton
									height={'59px'}
									style={{ borderRadius: '16px' }}
									key={index}
								/>
							))
						) : info?.labelsData?.length === 0 || !info?.labelsData ? (
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									backgroundColor: 'var(--card)',
									color: 'var(--primary-font)',
									height: '55px',
									borderRadius: '8px',
									fontWeight: 'bold',
								}}
							>
								Data not available at the moment ...
							</div>
						) : (
							// Render the data when labelsData is not empty
							info?.labelsData?.map((item, index) => (
								<div
									key={index}
									className="lableItemRow"
									onClick={() => {
										handleActivelable(item);
										handleShowLabels();
									}}
								>
									<div className="nameLable">
										<div className="dot">
											<DotSvg
												fill={info?.COLORS[index % info.COLORS.length]}
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
											<div className="downArrow">
												<DownSvg />
											</div>
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
								<div className="nameLable">{info?.activeLabelItem.moduleType}</div>
								<div className="metricsLables" style={{ color: 'white' }}>
									<div>
										{title === 'Interactions'
											? info?.activeLabelItem?.totalInteractionsCount
											: formatTime(info?.activeLabelItem?.duration)}
									</div>
									<div className="percentageWithArrow">
										<span
											className="percentageValue"
											style={{ color: 'white' }}
										>
											{`${info?.activeLabelItem?.percentage} %`}
										</span>
										<div className="rightArrow">
											<RightSvg />
										</div>
									</div>
								</div>
							</div>
						}
						<div className="labelItemRowContainer">
							{loading ? (
								// Fallback UI when labelItemsData is empty
								[{}, {}, {}].map((ele, index) => (
									<Skeleton
										height={'59px'}
										style={{ borderRadius: '16px' }}
										key={index}
									/>
								))
							) : info?.labelItemsData?.length === 0 ? (
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										backgroundColor: '#262626',
										height: '55px',
										borderRadius: '8px',
										fontWeight: 'bold',
									}}
								>
									Data not available at the moment ...
								</div>
							) : (
								// Render the Internal Data when labelItemsData is not empty
								info?.labelItemsData
									?.filter(
										(item) =>
											item?.moduleType === info?.activeLabelItem?.moduleType,
									)
									?.map((item, index) => (
										<div key={index} className="lableItemRow">
											<div className="nameLable">
												<div className="dot">
													<DotSvg
														fill={
															info?.COLORS[index % info.COLORS.length]
														}
													/>
												</div>
												<div className="selectedBlockSvg">
													{labelsItemIconMapper[item.sectionType] ||
														labelsItemIconMapper[
															item.interactionType
														] || <TestimonialSvg />}
												</div>
												<div>{item.content}</div>
											</div>
											<div className="metricsLables">
												<div>
													{title === 'Interactions'
														? item?.totalCount
														: formatTime(item?.duration)}
												</div>
												<div className="percentageWithArrow">
													<span className="percentageValue">
														{`${item?.percentage} %`}
													</span>
												</div>
											</div>
										</div>
									))
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(SessionMetric);

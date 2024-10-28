import React, { memo, useState } from 'react';
import '../../../assets/scss/sales/activity/modalSessionComponents.scss';
import DoughnutChart from '../../components/activity/DoughnutChart.jsx';
import { ReactComponent as DotSvg } from '../../../assets/svg/activity/dot.svg';
import { ReactComponent as DownSvg } from '../../../assets/svg/activity/down.svg';
import { ReactComponent as RightSvg } from '../../../assets/svg/activity/right.svg';
import { ReactComponent as GallerySvg } from '../../../assets/svg/activity/galleryIcon.svg';
import Skeleton from 'react-loading-skeleton';
import Spinner from '../loaders/Spinner.jsx';

const SessionMetric = ({ title, labelsData, labelItemsData }) => {
	const [info, setInfo] = useState({
		isLabelSelected: true,
		activeLabelItem: null,
	});

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
	return (
		<div className="sessionDetailsWrapper">
			<div className="sessionChartContainer">
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
					/>
				)}
			</div>

			<div className="sessionLablesContainer">
				<div className="headerContainer">
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
							  labelsData.map((item, index) => (
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
												<div className="downArrow">
													<DownSvg />
												</div>
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
								<div className="nameLable">{info?.activeLabelItem.moduleType}</div>
								<div className="metricsLables">
									<div>
										{title === 'Interactions'
											? info?.activeLabelItem?.totalInteractionsCount
											: info?.activeLabelItem?.duration}
									</div>
									<div className="percentageWithArrow">
										<span className="percentageValue">
											{info?.activeLabelItem.percentage || '%'}
										</span>
										<div className="rightArrow">
											<RightSvg />
										</div>
									</div>
								</div>
							</div>
						}
						<div className="labelItemRowContainer">
							{!labelItemsData || labelItemsData?.length === 0
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
														<DotSvg />
													</div>
													<div className="selectedBlockSvg">
														<GallerySvg />
													</div>
													<div>{item.content}</div>
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
										))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(SessionMetric);

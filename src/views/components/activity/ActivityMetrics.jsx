import React, { memo, useState } from 'react';
import { ReactComponent as DotSvg } from '../../../assets/svg/activity/dot.svg';
import { ReactComponent as DownSvg } from '../../../assets/svg/activity/down.svg';
import { ReactComponent as RightSvg } from '../../../assets/svg/activity/right.svg';
import { ReactComponent as GallerySvg } from '../../../assets/svg/activity/galleryIcon.svg';

import DoughnutChart from '../../components/activity/DoughnutChart.jsx';

const ActivityMetrics = (props) => {
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

	const [isLabelItemSelected, setLabelItemSelected] = useState(true);
	const [activeLabelItem, setactiveLabelItem] = useState(null);

	const handleShowLabels = () => {
		if (!isLabelItemSelected) {
			setLabelItemSelected(true);
			return;
		}
		setLabelItemSelected(false);
	};

	const handleActivelable = (label) => {
		setactiveLabelItem(label);
	};

	return (
		<div className="activityMetricsContainer">
			<div className="metricsTitle">{props.title}</div>

			<div className="metricsContentWrapper">
				<div className="metricsContentContainer">
					<div className="metricsLablesWrapper">
						<div className="headerWrapper">
							<span>Label</span>
							<span>Time Spent</span>
							<span>%</span>
						</div>

						{isLabelItemSelected ? (
							//LablesItewmRows ==>
							<div className="lablesContainer">
								{dummyData.map((item, index) => (
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
												<DotSvg dotColor="#FFAB6F" />
											</div>
											<div>{item.label}</div>
										</div>
										<div className="metricsLables">
											<div>{item.timeSpent}</div>
											<div className="percentageWithArrow">
												<span className="percentageValue">
													{item.percentage}
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
										<div className="nameLable">{activeLabelItem.label}</div>
										<div className="metricsLables">
											<div>{activeLabelItem.timeSpent}</div>
											<div className="percentageWithArrow">
												<span className="percentageValue">
													{activeLabelItem.percentage}
												</span>
												<span className="rightArrow">
													<RightSvg />
												</span>
											</div>
										</div>
									</div>
								}
								{dummyLabelData.map((item, index) => (
									//Internal Data of Label ==>

									<div key={index} className="lableItemRow">
										<div className="nameLable">
											<div className="dot">
												<DotSvg dotColor="#FFAB6F" />
											</div>
											<div className="selectedBlockSvg">
												<GallerySvg />
											</div>
											<div>{item.label}</div>
										</div>
										<div className="metricsLables">
											<div>{item.timeSpent}</div>
											<div className="percentageWithArrow">
												<span className="percentageValue">
													{item.percentage}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					<div className="metricsChartWrapper">
						<DoughnutChart />
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(ActivityMetrics);

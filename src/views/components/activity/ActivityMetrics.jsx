import React, { memo } from 'react';
import { ReactComponent as DotSvg } from '../../../assets/svg/activity/dot.svg';
import { ReactComponent as DownSvg } from '../../../assets/svg/activity/down.svg';

const ActivityMetrics = (props) => {
	const dummyData = [
		{ label: 'Proposal', timeSpent: '00:12:34', percentage: '50%' },
		{ label: 'Proposal Summary', timeSpent: '00:12:34', percentage: '12.5%' },
		{ label: 'Invoice', timeSpent: '00:08:23', percentage: '4.17%' },
		{ label: 'Contract', timeSpent: '00:04:21', percentage: '16.67%' },
		{ label: 'Thank You', timeSpent: '00:04:21', percentage: '16.67%' },
		{ label: 'Proposal', timeSpent: '00:12:34', percentage: '50%' },
		{ label: 'Proposal Summary', timeSpent: '00:12:34', percentage: '12.5%' },
		{ label: 'Invoice', timeSpent: '00:08:23', percentage: '4.17%' },
	];
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

						<div className="lablesContainer">
							{dummyData.map((item, index) => (
								<div key={index} className="lableItemRow">
									<div className="nameLable">
										<div className="dot">
											{/* Color passing not working for svg  */}
											<DotSvg dotColor="#FFAB6F" />
										</div>
										<div>{item.label}</div>
									</div>
									<div className="metricsLables">
										<div>{item.timeSpent}</div>
										{/* <div>{item.percentage}</div> */}
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
					</div>

					<div className="metricsChartWrapper">{/* Donut chart would be here */}</div>
				</div>
			</div>
		</div>
	);
};

export default memo(ActivityMetrics);

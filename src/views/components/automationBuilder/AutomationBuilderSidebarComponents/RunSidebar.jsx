import React, { useContext, useEffect, useState } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/runSidebar.scss';
import { ReactComponent as Tick } from '../../../../assets/svg/workflow/Tick.svg';
import HeaderComponent from './HeaderComponent';
import { Tooltip } from 'antd';
import Context from '../../../../context/context';
import Skeleton from 'react-loading-skeleton';
import moment from 'moment';

const tooltipStyles = {
	body: {
		minWidth: 'fit-content',
	},
};

const formatExecutionTime = (createdAt, completedAt) => {
	if (!createdAt || !completedAt) return 'Not available';

	const duration = moment.duration(moment.unix(completedAt).diff(moment.unix(createdAt)));
	const hours = duration.hours();
	const minutes = duration.minutes();
	const seconds = duration.seconds();

	let formattedTime = [];
	if (hours > 0) formattedTime.push(`${hours} hr`);
	if (minutes > 0) formattedTime.push(`${minutes} min`);
	if (seconds > 0 || formattedTime.length === 0) formattedTime.push(`${seconds} sec`);

	return formattedTime.join(' ');
};

const RunSidebar = ({ automationId, onClose }) => {
	const {
		automationBuilder: { executionHistory, getExecutionHistory },
	} = useContext(Context);

	const [info, setInfo] = useState({
		loading: true,
		error: null,
	});

	const automationHistory = executionHistory?.[automationId];
	const executionHistoryData = automationHistory?.data || [];
	const executionHistoryEmpty = executionHistoryData.length === 0 && !info.loading;

	// Initial fetch
	useEffect(() => {
		setInfo((prev) => ({ ...prev, loading: true }));
		getExecutionHistory(automationId, { page: 1, limit: 1000 }).finally(() =>
			setInfo((prev) => ({ ...prev, loading: false })),
		);
	}, [automationId]);

	return (
		<div className="run-sidebar">
			<HeaderComponent heading="Run history" onBack={onClose} />
			<div className="run-sidebar-content">
				<div className="run-sidebar-execution-container" id="runSidebarScrollableDiv">
					{info.loading ? (
						[{}, {}, {}, {}, {}].map((_, index) => (
							<div key={index} style={{ width: '100%' }}>
								<Skeleton
									width="100%"
									height="38px"
									borderRadius={'12px'}
									padding={'6px'}
									baseColor="var(--stroke-hover)"
									highlightColor="#7a7e85"
								/>
							</div>
						))
					) : info.error ? (
						<span className="error-message">{info.error}</span>
					) : executionHistoryEmpty ? (
						<span className="error-message">No runs found</span>
					) : (
						<div className="execution-list">
							{executionHistoryData.map((item, index) => (
								<Tooltip
									key={item?._id || index}
									title={
										<div className="run-sidebar-tooltip">
											<div className="run-sidebar-tooltip-container">
												<div className="run-sidebar-tooltip-item">
													<span className="run-sidebar-tooltip-item-title">
														Status
													</span>
													<span className="run-sidebar-tooltip-item-value">
														{item?.status}
													</span>
												</div>
												<div className="run-sidebar-tooltip-item">
													<span className="run-sidebar-tooltip-item-title">
														Runtime
													</span>
													<span className="run-sidebar-tooltip-item-value">
														{formatExecutionTime(
															item?.createdAt,
															item?.completedAt,
														)}
													</span>
												</div>
												<div className="run-sidebar-tooltip-item">
													<span className="run-sidebar-tooltip-item-title">
														Triggered
													</span>
													<span className="run-sidebar-tooltip-item-value">
														{item?.createdAt
															? moment
																	.unix(item?.createdAt)
																	?.format('DD MMM, YYYY hh:mm A')
															: 'Not available'}
													</span>
												</div>
												<div className="run-sidebar-tooltip-item">
													<span className="run-sidebar-tooltip-item-title">
														Completed
													</span>
													<span className="run-sidebar-tooltip-item-value">
														{item?.completedAt
															? moment
																	.unix(item?.completedAt)
																	?.format('DD MMM, YYYY hh:mm A')
															: 'Not available'}
													</span>
												</div>
												<div className="run-sidebar-tooltip-item">
													<span className="run-sidebar-tooltip-item-title">
														Credits used
													</span>
													<span className="run-sidebar-tooltip-item-value">
														0
													</span>
												</div>
											</div>
										</div>
									}
									placement="left"
									arrow={false}
									color="transparent"
									styles={tooltipStyles}
								>
									<div className="execution-item">
										<div className="execution-item-status">
											<Tick height={20} width={20} className="tick-icon" />
										</div>
										<div className="execution-item-title">Run {index + 1}</div>
										<div className="execution-item-date">
											{item?.createdAt
												? moment.unix(item?.createdAt).fromNow()
												: 'Not available'}
										</div>
									</div>
								</Tooltip>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default RunSidebar;

import React, { useContext, useEffect, useState } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/runSidebar.scss';
import { ReactComponent as Tick } from '../../../../assets/svg/workflow/Tick.svg';

import HeaderComponent from './HeaderComponent';
import { Tooltip } from 'antd';
import Context from '../../../../context/context';
import Skeleton from 'react-loading-skeleton';

const RunSidebar = ({ automationId, onClose }) => {
	const {
		automationBuilder: { executionHistory, getExecutionHistory },
	} = useContext(Context);

	const [info, setInfo] = useState({
		executionHistory: executionHistory,
		error: '',
		loading: true,
	});

	useEffect(() => {
		getExecutionHistory(automationId);
	}, []);

	useEffect(() => {
		if (executionHistory) {
			if (executionHistory?.data) {
				setInfo((prev) => ({
					...prev,
					executionHistory: executionHistory?.data?.data,
					error: null,
					loading: false,
				}));
			} else if (executionHistory?.error) {
				setInfo((prev) => ({
					...prev,
					error: executionHistory?.error,
					loading: false,
				}));
			}
		}
	}, [executionHistory]);

	return (
		<div className="run-sidebar">
			<HeaderComponent heading="Run history" onBack={onClose} />
			<div className="run-sidebar-content">
				<div className="run-sidebar-execution-container">
					{info?.loading ? (
						[{}, {}, {}, {}, {}]?.map((_, index) => (
							<div key={index} style={{ width: '100%' }}>
								<Skeleton
									width="100%"
									height="38px"
									borderRadius={0}
									baseColor="#202123"
									highlightColor="#7a7e85"
								/>
							</div>
						))
					) : info?.error ? (
						<span className="error-message">{info?.error}</span>
					) : info?.executionHistory?.length > 0 ? (
						info?.executionHistory?.map((item, index) => (
							<Tooltip
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
													30s
												</span>
											</div>
											<div className="run-sidebar-tooltip-item">
												<span className="run-sidebar-tooltip-item-title">
													Triggered
												</span>
												<span className="run-sidebar-tooltip-item-value">
													14 Feb, 2025 at 12:30 PM
												</span>
											</div>
											<div className="run-sidebar-tooltip-item">
												<span className="run-sidebar-tooltip-item-title">
													Completed
												</span>
												<span className="run-sidebar-tooltip-item-value">
													14 Feb, 2025 at 12:30 PM
												</span>
											</div>
											<div className="run-sidebar-tooltip-item">
												<span className="run-sidebar-tooltip-item-title">
													Credits used
												</span>
												<span className="run-sidebar-tooltip-item-value">
													5
												</span>
											</div>
										</div>
									</div>
								}
								placement="left"
								arrow={false}
								color="transparent"
								overlayStyle={{
									minWidth: 'fit-content',
								}}
							>
								<div className="execution-item" key={item?._id}>
									<div className="execution-item-status">
										<Tick height={20} width={20} className="tick-icon" />
									</div>
									<div className="execution-item-title">Run {index + 1}</div>
									<div className="execution-item-date">10 mins ago</div>
								</div>
							</Tooltip>
						))
					) : (
						<span className="error-message">No runs found</span>
					)}
				</div>
				{/* <div className="run-sidebar-overview-container">
					<div className="stats-container">
						<span className="stats-container-value">1</span>
						<span className="stats-container-title">Completed</span>
					</div>
					<div className="stats-container">
						<span className="stats-container-value">0</span>
						<span className="stats-container-title">Failed</span>
					</div>
					<div className="stats-container">
						<span className="stats-container-value">0</span>
						<span className="stats-container-title">In Progress</span>
					</div>
					<div className="stats-container">
						<span className="stats-container-value">10s</span>
						<span className="stats-container-title">Avg runtime</span>
					</div>
					<div className="credits-container">
						<div className="credits-inner-container">
							<span className="credits-inner-container-value">2</span>
							<span className="credits-inner-container-details">
								{`2 credits used / `}
								<span className="credits-inner-container-details-remaining">
									{`10,000 Left`}
								</span>
							</span>
						</div>
					</div>
				</div> */}
			</div>
		</div>
	);
};

export default RunSidebar;

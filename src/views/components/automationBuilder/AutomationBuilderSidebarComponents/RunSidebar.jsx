import React from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/runSidebar.scss';
import { ReactComponent as Tick } from '../../../../assets/svg/workflow/Tick.svg';

import HeaderComponent from './HeaderComponent';
import { Tooltip } from 'antd';

const RunSidebar = () => {
	return (
		<div className="run-sidebar">
			<HeaderComponent heading="Run history" />
			<div className="run-sidebar-content">
				<div className="run-sidebar-execution-container">
					{[1, 2, 3, 4].map((item) => (
						<Tooltip
							title={
								<div className="run-sidebar-tooltip">
									<div className="run-sidebar-tooltip-container">
										<div className="run-sidebar-tooltip-item">
											<span className="run-sidebar-tooltip-item-title">
												Status
											</span>
											<span className="run-sidebar-tooltip-item-value">
												Completed
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
							<div className="execution-item">
								<div className="execution-item-status">
									<Tick height={20} width={20} className="tick-icon" />
								</div>
								<div className="execution-item-title">Run 1</div>
								<div className="execution-item-date">10 mins ago</div>
							</div>
						</Tooltip>
					))}
				</div>
				<div className="run-sidebar-overview-container">
					<div className="stats-container">
						<span className="stats-container-value">10</span>
						<span className="stats-container-title">Completed</span>
					</div>
					<div className="stats-container">
						<span className="stats-container-value">10</span>
						<span className="stats-container-title">Failed</span>
					</div>
					<div className="stats-container">
						<span className="stats-container-value">10</span>
						<span className="stats-container-title">In Progress</span>
					</div>
					<div className="stats-container">
						<span className="stats-container-value">10</span>
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
				</div>
			</div>
		</div>
	);
};

export default RunSidebar;

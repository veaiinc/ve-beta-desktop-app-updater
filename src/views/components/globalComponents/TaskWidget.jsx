import React, { memo } from 'react';
import '../../../assets/scss/globalComponents/taskWidget.scss';
import { ReactComponent as DownArrowIcon } from '../../../assets/svg/chat/downArrow.svg';
import { ReactComponent as FiltersIcon } from '../../../assets/svg/tasks/filterLines.svg';
import { ReactComponent as PlusIcon } from '../../../assets/svg/calendar/plus.svg';

const taskOptions = [
	{
		id: 1,
		title: 'UI/UX Design review',
		name: 'Avinash',
		status: 'On Going',
	},
	{
		id: 2,
		title: 'Product review call',
		name: 'Lindsey Aminoff',
		status: 'On Going',
	},
	{
		id: 3,
		title: 'Client Meeting: Branding & Visual Identity',
		name: 'Hanna Dokidis',
		status: 'On Going',
	},
	{
		id: 4,
		title: 'Design Team- Standup Call',
		name: 'Jaylon Aminoff',
		status: 'Overdue',
	},
];
const TaskWidget = ({ width, height }) => {
	return (
		<div className="taskWidgetContainer" style={{ width: width, height: height }}>
			<div className="taskWidgetBody">
				<div className="taskWidgetBodyHeader">
					<div className="taskWidgetBodyHeaderLeft">
						<span className="taskWidgetDay">4</span>
						<span className="taskWidgetRemainder">Reminder</span>
					</div>
					<div className="taskWidgetBodyHeaderRight">
						<div className="taskWidgetDaysFilter">
							<span>Today</span>
							<DownArrowIcon />
						</div>
						<FiltersIcon />
					</div>
				</div>
				<div className="taskWidgetBodyContainer">
					{taskOptions.map((eachOption) => (
						<>
							{eachOption?.status !== 'On Going' && (
								<div className="taskWidgetStatusContainer">
									<div className="taskWidgetStatusTitle">
										{eachOption?.status}
									</div>
									<hr className="taskWidgetHr" />
								</div>
							)}
							<div className="taskWidgetOption">
								<div className="taskWidgetSelectOption"></div>
								<div className="taskWidgetOptionDetails">
									<div className="taskWidgetOptionTitle">{eachOption?.title}</div>
									<div className="taskWidgetOptionName">{eachOption?.name}</div>
								</div>
							</div>
						</>
					))}
				</div>
			</div>
			<div className="taskWidgetFooter">
				<div className="taskWidgetFooterTitle">View Task</div>
				<PlusIcon />
			</div>
		</div>
	);
};

export default memo(TaskWidget);

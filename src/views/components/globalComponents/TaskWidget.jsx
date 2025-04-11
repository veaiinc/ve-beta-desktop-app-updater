import React, { memo } from 'react';
import '../../../assets/scss/globalComponents/taskWidget.scss';
import { ReactComponent as DownArrowIcon } from '../../../assets/svg/chat/downArrow.svg';
import { ReactComponent as FiltersIcon } from '../../../assets/svg/tasks/filterLines.svg';
import { ReactComponent as PlusIcon } from '../../../assets/svg/calendar/plus.svg';
import { ReactComponent as AutomationIcon } from '../../../assets/svg/contacts/automation.svg';
import { ReactComponent as DeepSearchIcon } from '../../../assets/svg/contacts/deepsearch.svg';
import { ReactComponent as TaskSuggestionIcon } from '../../../assets/svg/contacts/tasksuggestion.svg';
const autoSuggestOptions = [
	{
		id: 1,
		title: 'Brandon Rhiel Madsen',
		suggestion: 'New Message Received',
		type: 'automation',
	},
	{
		id: 2,
		title: 'Brandon Rhiel Madsen',
		suggestion: 'New Message Received',
		type: 'deepsearch',
	},
	{
		id: 3,
		title: 'Brandon Rhiel Madsen',
		suggestion: 'New Message Received',
		type: 'tasksuggestion',
	},
	{
		id: 4,
		title: 'Brandon Rhiel Madsen',
		suggestion: 'New Message Received',
		type: 'automation',
	},
];
const iconMap = {
	automation: <AutomationIcon />,
	deepsearch: <DeepSearchIcon />,
	tasksuggestion: <TaskSuggestionIcon />,
};
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
		<div className="task-main-container" style={{ width: width }}>
			<div className="taskWidgetContainer">
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
										<div className="taskWidgetOptionTitle">
											{eachOption?.title}
										</div>
										<div className="taskWidgetOptionName">
											{eachOption?.name}
										</div>
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
			<div className="taskWidgetSection2">
				{autoSuggestOptions.map((item) => (
					<div className="taskWidgetSection2Item">
						<div className="taskWidgetSection2ItemContainer">
							{iconMap[item.type]}
							<div className="taskWidgetSection2ItemTitle">
								{item.type.charAt(0).toUpperCase() + item.type.slice(1)}
							</div>
						</div>
						<div className="taskWidgetSection2ItemSubtitle">{item.suggestion}</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(TaskWidget);

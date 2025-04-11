import React from 'react';
import '../../../assets/scss/globalComponents/calenderWidget.scss';
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
const meetOptions = [
	{ id: 1, startTime: '10:00 AM', endTime: '10:30 AM', title: 'Design Team- Standup Call' },
	{ id: 2, startTime: '11:30 AM', endTime: '11:50 AM', title: 'UI/UX Design review' },
	{ id: 3, startTime: '11:45 AM', endTime: '12:00 PM', title: 'Product review call' },
	{ id: 4, startTime: '12:30 PM', endTime: '1:00 PM', title: 'Photography Concept Planning' },
];
const CalenderWidget = ({ width, height }) => {
	return (
		<div className="calender-main-container" style={{ width: width }}>
			<div className="calenderWidgetContainer">
				<div className="calenderWidgetMain">
					<div className="calenderWidgetDateContainer">
						<div className="calenderWidgetDateContainerDayContainer">
							<div className="calenderWidgetDateContainerDay">Monday</div>
							<div className="calenderWidgetDateContainerDate">22</div>
						</div>
					</div>
					<div className="calenderWidgetMainContent">
						<div className="calenderWidgetMainContentTitleContainer">
							<div className="calenderWidgetMain">
								<div className="calenderWidgetMainContentMeetTitle">
									Design Team- Standup Call
								</div>
								<div className="calenderWidgetMainContentMeetTime">
									10:00 AM - 10:30 AM
								</div>
							</div>
						</div>
						<div className="calenderWidgetMainContentDate">
							{meetOptions.map((meet) => (
								<div className="calenderWidgetMainContentDateMeet">
									<div className="calenderWidgetMainContentDateMeetTime">
										<span className="calenderWidgetMainContentTime">
											{meet.startTime}
										</span>
										<span className="calenderWidgetMainLine"></span>
									</div>
									<div className="meetingDetails">
										<div className="meetingDetailsTitle">{meet.title}</div>
										<div className="meetingDetailsTime">
											{meet.startTime} - {meet.endTime}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
				<hr
					style={{
						width: '100%',
						background: 'var(--stroke)',
						border: 'none',
						height: '1px',
					}}
				/>
				<div className="calenderWidgetFooter">
					<div className="calenderWidgetFooterTitle">View Calendar</div>
					<PlusIcon />
				</div>
			</div>
			<div className="calenderWidgetSection2">
				{autoSuggestOptions.map((item) => (
					<div className="calenderWidgetSection2Item">
						<div className="calenderWidgetSection2ItemContainer">
							{iconMap[item.type]}
							<div className="calenderWidgetSection2ItemTitle">
								{item.type.charAt(0).toUpperCase() + item.type.slice(1)}
							</div>
						</div>
						<div className="calenderWidgetSection2ItemSubtitle">{item.suggestion}</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default CalenderWidget;

import React, { useState, useContext, useEffect } from 'react';
import '../../../assets/scss/globalComponents/calenderWidget.scss';
import { ReactComponent as PlusIcon } from '../../../assets/svg/calendar/plus.svg';
import { ReactComponent as AutomationIcon } from '../../../assets/svg/contacts/automation.svg';
import { ReactComponent as DeepSearchIcon } from '../../../assets/svg/contacts/deepsearch.svg';
import { ReactComponent as TaskSuggestionIcon } from '../../../assets/svg/contacts/tasksuggestion.svg';
import { ReactComponent as CalendarIcon } from '../../../assets/svg/contacts/calendar.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import PromptPopup from '../homePage/PromptPopup.jsx';
import { PromptData } from '../homePage/PromptData.js';
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
	calendar: <CalendarIcon />,
};

const CalenderWidget = ({ width, height }) => {
	const {
		calendarInfo: { getCalendarEventsList, calendarEventsList },
	} = useContext(Context);
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		currentCalendarDate: new Date(),
		currentDate: new Date().getDate(),
		currentDay: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
		promptPopupOpen: false,
		selectedCard: null,
	});
	useEffect(() => {
		getCalendarEventsList(info?.currentCalendarDate);
	}, [info?.currentCalendarDate]);
	const handlePromptPopup = (item) => {
		setInfo((prev) => ({ ...prev, promptPopupOpen: true, selectedCard: item }));
	};
	return (
		<div className="calender-main-container" style={{ width: width }}>
			<div className="calenderWidgetContainer">
				<div className="calenderWidgetMain">
					<div className="calenderWidgetDateContainer">
						<div className="calenderWidgetDateContainerDayContainer">
							<div className="calenderWidgetDateContainerDay">{info?.currentDay}</div>
							<div className="calenderWidgetDateContainerDate">
								{info?.currentDate}
							</div>
						</div>
					</div>
					<div className="calenderWidgetMainContent">
						{calendarEventsList?.length > 0 ? (
							<div className="calenderWidgetMainContentDate">
								{calendarEventsList?.map((meet) => (
									<div className="calenderWidgetMainContentDateMeet">
										<div className="calenderWidgetMainContentDateMeetTime">
											<span className="calenderWidgetMainContentTime">
												{meet?.startTime}
											</span>
											<span className="calenderWidgetMainLine"></span>
										</div>
										<div className="meetingDetails">
											<div className="meetingDetailsTitle">{meet?.title}</div>
											<div className="meetingDetailsTime">
												{meet?.startTime} - {meet?.endTime}
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="calenderWidgetMainContentDate">No events found</div>
						)}
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
				<div
					className="calenderWidgetFooter"
					onClick={() => {
						navigate('/calendar');
					}}
					style={{ cursor: 'pointer' }}
				>
					<div className="calenderWidgetFooterTitle">View Calendar</div>
					<PlusIcon />
				</div>
			</div>
			<div className="calenderWidgetSection2">
				{PromptData.filter((item) => item.type === 'calendar').map((item) => (
					<div
						className="calenderWidgetSection2Item"
						onClick={() => handlePromptPopup(item)}
					>
						<div className="calenderWidgetSection2ItemContainer">
							{iconMap[item.type]}
							<div className="calenderWidgetSection2ItemTitle">
								{item.type.charAt(0).toUpperCase() + item.type.slice(1)}
							</div>
						</div>
						<div className="calenderWidgetSection2ItemSubtitle">{item.title}</div>
					</div>
				))}
			</div>
			<PromptPopup
				open={info?.promptPopupOpen}
				closeModal={() =>
					setInfo((prev) => ({ ...prev, promptPopupOpen: false, selectedCard: null }))
				}
				selectedCard={info?.selectedCard}
			/>
		</div>
	);
};

export default CalenderWidget;

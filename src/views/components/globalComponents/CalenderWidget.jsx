import React, { useState, useContext, useEffect } from 'react';
import '../../../assets/scss/globalComponents/calenderWidget.scss';
import { ReactComponent as PlusIcon } from '../../../assets/svg/calendar/plus.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';

const CalenderWidget = ({ width }) => {
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
	return (
		<div className="calender-main-container" style={{ width: width, height: '412px' }}>
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
		</div>
	);
};

export default CalenderWidget;

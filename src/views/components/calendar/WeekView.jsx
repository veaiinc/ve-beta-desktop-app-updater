import React, { memo } from 'react';
import '../../../assets/scss/calendar/weekView.scss';

const events = [
	{ title: 'Meeting', time: '6:00 - 7:30', top: 0, height: 30, left: 0 },
	{ title: 'Save the date', time: '6:00 - 8:30', top: 0, height: 50, left: 80 },
	{ title: 'Payment 3 Shilpa Ram', time: '1,00,000 Rs', top: 0, height: 30, left: 160 },
	{ title: 'Reception', time: '9:00 - 1:00', top: 90, height: 120, left: 240 },
];
const WeekView = ({ updateCalendarInfo }) => {
	return (
		<div className="schedule" onClick={() => updateCalendarInfo('isCreateEventOpen', true)}>
			<div className="time-header">
				<span>GMT +05:30</span>
			</div>
			<div className="time-slots">
				<div className="hour">6 am</div>
				<div className="hour">7 am</div>
				<div className="hour">8 am</div>
				<div className="hour">9 am</div>
				<div className="hour">10 am</div>
				<div className="hour">11 am</div>
				<div className="hour">12 pm</div>
				<div className="hour">1 pm</div>
				<div className="hour">2 pm</div>
			</div>
			<div className="events">
				{events.map((event, index) => (
					<div
						key={index}
						className="event"
						style={{
							top: `${event.top}px`,
							height: `${event.height}px`,
							left: `${event.left}px`,
						}}
					>
						<span>{event.title}</span>
						<span className="time">{event.time}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(WeekView);

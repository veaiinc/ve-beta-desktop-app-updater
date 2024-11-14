import React, { memo } from 'react';
import '../../../assets/scss/calendar/calendarHeader.scss';

const WeekHeader = () => {
	return (
		<div className="weekHeaderWrapper">
			<div className="dayHeader">
				<span>Sunday</span>
			</div>
			<div className="dayHeader">
				<span>Monday</span>
			</div>
			<div className="dayHeader">
				<span>Tuesday</span>
			</div>
			<div className="dayHeader">
				<span>Wednesday</span>
			</div>
			<div className="dayHeader">
				<span>Thursday</span>
			</div>
			<div className="dayHeader">
				<span>Friday</span>
			</div>
			<div className="dayHeader">
				<span>Saturday</span>
			</div>
		</div>
	);
};

export default memo(WeekHeader);

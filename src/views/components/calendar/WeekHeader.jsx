import React, { memo } from 'react';
import '../../../assets/scss/calendar/calendarHeader.scss';

const WeekHeader = () => {
	return (
		<div className="weekHeaderWrapper">
			<div className="dayHeader">
				<span className="dayName">Mon</span>
			</div>
			<div className="dayHeader">
				<span className="dayName">Tue</span>
			</div>
			<div className="dayHeader">
				<span className="dayName">Wed</span>
			</div>
			<div className="dayHeader">
				<span className="dayName">Thu</span>
			</div>
			<div className="dayHeader">
				<span className="dayName">Fri</span>
			</div>
			<div className="dayHeader">
				<span className="dayName">Sat</span>
			</div>
			<div className="dayHeader">
				<span className="dayName">Sun</span>
			</div>
		</div>
	);
};

export default memo(WeekHeader);

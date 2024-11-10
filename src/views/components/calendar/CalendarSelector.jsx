import React, { memo } from 'react';
import '../../../assets/scss/calendar/calendarSelector.scss';

const CalendarSelector = () => {
	return (
		<div className="calendarSelectorParentContainer">
			<div className="calendarContainer">
				<div className="calendarHeader">
					<div>
						<div>September 2024</div>
						<div>
							<span>A</span>
							<span>B</span>
						</div>
					</div>
				</div>
				<div className="calendarBody">choose calendar</div>
			</div>
		</div>
	);
};

export default memo(CalendarSelector);

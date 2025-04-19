import React, { memo, useMemo } from 'react';
import '../../../assets/scss/calendar/calendarHeader.scss';
import moment from 'moment';

const WeekDayHeader = ({ selectedWeek }) => {
	const days = useMemo(
		() =>
			selectedWeek?.map((date) => {
				const dayDate = moment().date(date);
				return {
					date,
					dayName: dayDate.format('ddd'),
				};
			}),
		[selectedWeek],
	);

	return (
		<div className="weekDayHeaderContainer">
			{days?.map((day, index) => (
				<div
					key={index}
					className={`weekDayBlock ${new Date().getDate() === day?.date ? 'active' : ''}`}
				>
					<div className="weekDayWrapper">
						<span className="dayName">{day?.dayName}</span>
						<span className="date">{day?.date}</span>
					</div>
				</div>
			))}
		</div>
	);
};

export default memo(WeekDayHeader);

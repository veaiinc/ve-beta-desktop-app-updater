import React, { memo, useMemo } from 'react';
import '../../../assets/scss/calendar/calendarHeader.scss';

const WeekDayHeader = ({ selectedWeek }) => {
	const days = useMemo(
		() =>
			[
				{ name: 'Monday' },
				{ name: 'Tuesday' },
				{ name: 'Wednesday' },
				{ name: 'Thursday' },
				{ name: 'Friday' },
				{ name: 'Saturday' },
				{ name: 'Sunday' },
			]?.map((day, index) => ({
				...day,
				date: selectedWeek[index],
			})),
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
						<span>{day?.name}</span>
						<span>{day?.date}</span>
					</div>
				</div>
			))}
		</div>
	);
};

export default memo(WeekDayHeader);

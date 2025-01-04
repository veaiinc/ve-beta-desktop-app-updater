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
						<span style={{ color: 'rgba(var(--primary-font), 0.48)' }}>
							{day?.name}
						</span>
						<span style={{ color: 'var(--primary-font)' }}>{day?.date}</span>
					</div>
				</div>
			))}
		</div>
	);
};

export default memo(WeekDayHeader);

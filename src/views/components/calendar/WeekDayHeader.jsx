import React, { memo, useCallback, useState } from 'react';
import '../../../assets/scss/calendar/calendarHeader.scss';

const WeekDayHeader = ({ activeView, selectedWeek, selectedDate, getCurrentWeek }) => {
	const [info, setInfo] = useState({
		selectedWeek: [],
		selectedWeekday: selectedDate,
	});

	const handleSelectedDay = useCallback((day) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			selectedWeekday: day,
		}));
	}, []);

	const days = [
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
	}));

	return (
		<div className="weekDayHeaderContainer">
			{days?.map((day, index) => (
				<div
					key={index}
					className={`weekDayBlock ${new Date().getDate() === day?.date ? 'active' : ''}`}
					onClick={() => handleSelectedDay(index)}
				>
					<div className="weekDayWrapper">
						<span style={{ color: 'rgba(228, 229, 230, 0.48)' }}>{day.name}</span>
						<span style={{ color: '#E4E5E6' }}>{day.date}</span>
					</div>
				</div>
			))}
		</div>
	);
};

export default memo(WeekDayHeader);

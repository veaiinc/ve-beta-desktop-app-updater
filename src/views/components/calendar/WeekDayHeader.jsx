import React, { memo, useCallback, useState } from 'react';
import '../../../assets/scss/calendar/calendarHeader.scss';

const WeekDayHeader = () => {
	const [info, setInfo] = useState({
		selectedWeekday: 0,
	});

	const handleSelectedDay = useCallback((day) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			selectedWeekday: day,
		}));
	}, []);

	const days = [
		{ name: 'Monday', date: '12' },
		{ name: 'Tuesday', date: '13' },
		{ name: 'Wednesday', date: '14' },
		{ name: 'Thursday', date: '15' },
		{ name: 'Friday', date: '16' },
		{ name: 'Saturday', date: '17' },
		{ name: 'Sunday', date: '18' },
	];

	return (
		<div className="weekDayHeaderContainer">
			{days?.map((day, index) => (
				<div
					key={index}
					className={`weekDayBlock ${info?.selectedWeekday === index ? 'active' : ''}`}
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

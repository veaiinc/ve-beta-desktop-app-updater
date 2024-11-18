import React, { useState, useEffect } from 'react';
import '../../../assets/scss/calendar/monthView.scss';

const events = [
	{ date: 1, type: 'wedding', label: 'Wedding' },
	{ date: 1, type: 'engagement', label: 'Engagement +2' },
	{ date: 3, type: 'engagement', label: 'Engagement +2' },
	{ date: 10, type: 'wedding', label: 'Wedding +2' },
	{ date: 17, type: 'engagement', label: 'Engagement +2' },
	{ date: 24, type: 'wedding', label: 'Wedding +2' },
	{ date: 30, type: 'wedding', label: 'Wedding +2' },
];

const MonthView = ({ month = 6, year = 2024 }) => {
	const [days, setDays] = useState([]);

	useEffect(() => {
		const daysInMonth = new Date(year, month + 1, 0).getDate(); // Number of days in the month
		let firstDayOfMonth = new Date(year, month, 1).getDay(); // Day of the week the month starts on

		// Adjust firstDayOfMonth to treat Monday as the first day
		firstDayOfMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

		// Create an array representing each day in the month view
		const generatedDays = [];

		// Add placeholders for previous month's days
		for (let i = 0; i < firstDayOfMonth; i++) {
			generatedDays.push({ date: null, event: null });
		}

		// Add the actual days of the current month
		for (let day = 1; day <= daysInMonth; day++) {
			const event = events?.find((e) => e.date === day);
			generatedDays.push({
				date: day,
				event: event ? { ...event } : null,
			});
		}

		// Fill the remaining cells for the calendar to make it a 5-week grid
		while (generatedDays.length < 35) {
			// 5 rows x 7 columns
			generatedDays.push({ date: null, event: null });
		}

		setDays(generatedDays);
	}, [month, year]);

	return (
		<div className="calendar-grid">
			{days?.map((day, index) => (
				<div key={index} className="day">
					{day?.date && <span className="date">{day?.date}</span>}
					{day?.event && (
						<div className={`event ${day?.event?.type}`}>{day?.event?.label}</div>
					)}
				</div>
			))}
		</div>
	);
};

export default MonthView;

import React, { memo, useState, useCallback } from 'react';
import '../../../assets/scss/calendar/calendar.scss';
import CalendarSidebar from './CalendarSidebar';
import CalendarView from './CalendarView';
import {
	// format,
	// startOfMonth,
	// endOfMonth,
	startOfWeek,
	endOfWeek,
	// addMonths,
	// subMonths,
	eachDayOfInterval,
	// isSameDay,
} from 'date-fns';

const Calendar = () => {
	const [info, setInfo] = useState({
		todaysDate: new Date(),
		currentCalendarDate: new Date(),
		selectedMonth: new Date().getMonth(),
		selectedYear: new Date().getFullYear(),
		selectedDate: new Date(),
		selectedWeek: [],
		activeView: 'Month', // Week, Day
	});

	const handleToggleView = useCallback((view) => {
		setInfo((prevInfo) => ({ ...prevInfo, activeView: view }));
	}, []);

	const handleMonthChange = (month) => {
		setInfo((prevInfo) => ({ ...prevInfo, selectedMonth: month }));
	};

	const handleYearChange = (year) => {
		setInfo((prevInfo) => ({ ...prevInfo, selectedYear: year }));
	};

	const handlecurrentCalendarDateChange = (date) => {
		setInfo((prevInfo) => ({ ...prevInfo, currentCalendarDate: date }));
	};

	const handelSelectedDate = (date) => {
		setInfo((prevInfo) => ({ ...prevInfo, selectedDate: date }));
	};
	// const handleWeekChange = (week) => {
	// 	setInfo((prevInfo) => ({ ...prevInfo, selectedWeek: week }));
	// };

	// Get Week Days array for <WeekDayHeader /> component
	const getCurrentWeek = () => {
		const start = startOfWeek(info?.selectedDate, { weekStartsOn: 1 });
		const end = endOfWeek(info?.selectedDate, { weekStartsOn: 1 });

		// Generate all days to display in the calendar
		const week = eachDayOfInterval({
			start,
			end,
		});
		return week.map((date) => date.getDate());
	};

	return (
		<div className="calendarParentContainer">
			<CalendarSidebar
				currentCalendarDate={info?.currentCalendarDate}
				selectedMonth={info?.selectedMonth}
				selectedYear={info?.selectedYear}
				selectedDate={info?.selectedDate}
				handlecurrentCalendarDateChange={handlecurrentCalendarDateChange}
				handleMonthChange={handleMonthChange}
				handleYearChange={handleYearChange}
				handelSelectedDate={handelSelectedDate}
			/>
			<CalendarView
				activeView={info?.activeView}
				selectedWeek={info?.selectedWeek}
				getCurrentWeek={getCurrentWeek}
				handleToggleView={handleToggleView}
			/>
		</div>
	);
};

export default memo(Calendar);

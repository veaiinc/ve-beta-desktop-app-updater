import React, { memo, useState, useCallback, useEffect } from 'react';
import '../../../assets/scss/calendar/calendar.scss';
import CalendarSidebar from './CalendarSidebar';
import CalendarView from './CalendarView';
import UpdatedPageLoader from '../../components/loaders/UpdatedPageLoader';
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
		activeView: 'Month', // 'Week', 'Day'
		loading: false,
		isCreateEventOpen: false,
	});

	// console.log('Type of selectedDate: ' + info?.selectedDate);

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
	const getCurrentWeek = useCallback(() => {
		const start = startOfWeek(info?.selectedDate, { weekStartsOn: 1 });
		const end = endOfWeek(info?.selectedDate, { weekStartsOn: 1 });

		// Generate all days to display in the calendar
		const week = eachDayOfInterval({
			start,
			end,
		});
		const weekDates = week.map((date) => date.getDate());

		setInfo((prev) => ({
			...prev,
			selectedWeek: weekDates,
		}));
	}, [info?.selectedDate]);

	const toggleCreateEvent = useCallback(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			isCreateEventOpen: !prevInfo.isCreateEventOpen,
		}));
	}, []);

	useEffect(() => {
		getCurrentWeek();
	}, [getCurrentWeek, info.selectedDate]);
	// console.log(`and selectedWeek: ${info?.selectedWeek}`);

	return (
		<>
			{info?.loading ? (
				<UpdatedPageLoader />
			) : (
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
						isCreateEventOpen={info?.isCreateEventOpen}
						toggleCreateEvent={toggleCreateEvent}
					/>
					<CalendarView
						activeView={info?.activeView}
						selectedWeek={info?.selectedWeek}
						selectedDate={info?.selectedDate}
						getCurrentWeek={getCurrentWeek}
						handleToggleView={handleToggleView}
						toggleCreateEvent={toggleCreateEvent}
					/>
				</div>
			)}
		</>
	);
};

export default memo(Calendar);

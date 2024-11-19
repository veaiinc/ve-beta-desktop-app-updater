import React, { memo, useState, useCallback, useEffect } from 'react';
import '../../../assets/scss/calendar/calendar.scss';
import CalendarSidebar from './CalendarSidebar';
import CalendarView from './CalendarView';
import UpdatedPageLoader from '../../components/loaders/UpdatedPageLoader';
import moment from 'moment';

const Calendar = () => {
	const [info, setInfo] = useState({
		// todaysDate: new Date(),
		currentCalendarDate: new Date(),
		selectedMonth: new Date().getMonth(),
		selectedYear: new Date().getFullYear(),
		selectedDate: new Date(),
		selectedWeek: [],
		activeView: 'Month', // 'Week', 'Day'
		loading: false,
		isCreateEventOpen: false,
	});

	const updateCalendarInfo = useCallback((key, value) => {
		setInfo((prevInfo) => ({ ...prevInfo, [key]: value }));
	}, []);

	// Get Week Days array for <WeekDayHeader /> component
	const getCurrentWeek = useCallback(() => {
		const start = moment(info?.selectedDate).startOf('isoWeek'); // Start of the week (Monday)
		const end = moment(info?.selectedDate).endOf('isoWeek'); // End of the week (Sunday)

		// Generate all days to display in the week
		const weekDates = [];
		let currentDay = start.clone();
		while (currentDay.isBefore(end) || currentDay.isSame(end, 'day')) {
			weekDates.push(currentDay.clone().date());
			currentDay.add(1, 'day'); // Move to the next day
		}

		setInfo((prev) => ({
			...prev,
			selectedWeek: weekDates,
		}));
	}, [info?.selectedDate]);

	useEffect(() => {
		getCurrentWeek();
		updateCalendarInfo('selectedMonth', info?.selectedDate.getMonth());
		updateCalendarInfo('selectedYear', info?.selectedDate.getFullYear());
	}, [info.selectedDate]);

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
						isCreateEventOpen={info?.isCreateEventOpen}
						updateCalendarInfo={updateCalendarInfo}
					/>
					<CalendarView
						activeView={info?.activeView}
						selectedWeek={info?.selectedWeek}
						selectedDate={info?.selectedDate}
						selectedMonth={info?.selectedMonth}
						selectedYear={info?.selectedYear}
						getCurrentWeek={getCurrentWeek}
						updateCalendarInfo={updateCalendarInfo}
					/>
				</div>
			)}
		</>
	);
};

export default memo(Calendar);

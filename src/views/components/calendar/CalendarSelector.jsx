import React, { memo, useCallback, useState, useMemo, useEffect } from 'react';
import '../../../assets/scss/calendar/calendarSelector.scss';
import {
	format,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	addMonths,
	subMonths,
	eachDayOfInterval,
	isSameDay,
} from 'date-fns';
// import { DayPicker } from 'react-day-picker';
// import 'react-day-picker/style.css';
// import { ReactComponent as OpenCalSvg } from '../../../assets/svg/calendar/openCalendar.svg';
import { ReactComponent as LeftSvg } from '../../../assets/svg/activity/left.svg';
import { ReactComponent as RightSvg } from '../../../assets/svg/activity/right.svg';
import { ReactComponent as DownSvg } from '../../../assets/svg/calendar/down.svg';

const CalendarSelector = () => {
	// const [info, setInfo] = useState({
	// 	selectedDate: new Date(),
	// });

	// const handleSelectDate = useCallback((selectedDate) => {
	// 	setInfo((prevInfo) => ({ ...prevInfo, selectedDate }));
	// }, []);

	const [info, setInfo] = useState({
		todaysDate: new Date(),
		currentCalendarDate: new Date(),
		selectedMonth: new Date().getMonth(),
		selectedYear: new Date().getFullYear(),
		selectedDate: new Date(),
		selectedWeek: [],
	});

	// console.log('selectedDate:====>' + info?.selectedDate);

	const calendarInfo = useMemo(() => {
		const minYear = 1990;
		const maxYear = 2050;
		const months = [];
		const years = [];

		// Getting all month names
		for (let month = 0; month < 12; month++) {
			const date = new Date(2024, month, 1);
			months.push(format(date, 'MMMM'));
		}

		// Getting years from minYear to maxYear
		for (let year = minYear; year <= maxYear; year++) {
			years.push(year);
		}
		return {
			minYear,
			maxYear,
			months,
			years,
		};
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
	const handleWeekChange = (week) => {
		setInfo((prevInfo) => ({ ...prevInfo, selectedWeek: week }));
	};

	const [showMonths, setShowMonths] = useState(false);
	const [showYears, setShowYears] = useState(false);

	// Handles month drop-down and year drop-down
	const toggleMonthDropDown = () => {
		if (showYears && !showMonths) {
			setShowYears(false);
		}
		setShowMonths(!showMonths);
	};
	const toggleYearDropDown = () => {
		if (showMonths && !showYears) {
			setShowMonths(false);
		}
		setShowYears(!showYears);
	};

	// Changes calendar when month or year being changed
	useEffect(() => {
		handlecurrentCalendarDateChange(new Date(info.selectedYear, info.selectedMonth));
	}, [info.selectedMonth, info.selectedYear]);

	// Handles selected week when selected date changes
	useEffect(() => {
		if (daysInMonth) {
			const [currentWeek] = chunkArray(daysInMonth).filter((week) => {
				return week.some((date) => isSameDay(date, info.selectedDate));
			});
			handleWeekChange(currentWeek.map((date) => date.getDate()));
		}
	}, [info.selectedDate, info.todaysDate]);

	// Get the first and last day of the current month
	const firstDayOfMonth = startOfMonth(info.currentCalendarDate);
	const lastDayOfMonth = endOfMonth(info.currentCalendarDate);

	// Get the first and last day of the week for the current month
	const startOfCalendar = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
	const endOfCalendar = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 });

	// Generate all days to display in the calendar
	const daysInMonth = eachDayOfInterval({
		start: startOfCalendar,
		end: endOfCalendar,
	});

	// Handlers to navigate between months
	const goToPreviousMonth = () => {
		const date = subMonths(info.currentCalendarDate, 1);
		console.log(subMonths(info.currentCalendarDate, 1).toLocaleDateString());
		handlecurrentCalendarDateChange(
			date.getFullYear() < calendarInfo.minYear ? info.currentCalendarDate : date,
		);
	};
	const goToNextMonth = () => {
		const date = addMonths(info.currentCalendarDate, 1);
		handlecurrentCalendarDateChange(
			date.getFullYear() > calendarInfo.maxYear ? info.currentCalendarDate : date,
		);
	};

	// Get the month and year for display
	const monthName = format(info.currentCalendarDate, 'MMMM');
	const currentYear = format(info.currentCalendarDate, 'yyyy');

	// Function to chunk the array into groups of 7
	function chunkArray(arr, size = 7) {
		const result = [];
		for (let i = 0; i < arr.length; i += size) {
			result.push(arr.slice(i, i + size));
		}
		return result;
	}

	return (
		// <div className="calendarSelectorParentContainer">
		// 	<DayPicker
		// 		mode="single"
		// 		selected={info?.selectedDate}
		// 		onSelect={handleSelectDate}
		// 		captionLayout="dropdown"
		// 		weekStartsOn={1}
		// 		showOutsideDays
		// 		className="weekRow"
		// 	/>
		// </div> // This react DayPicker component has deprecated since we are using custom calendar, uncomment if you want to use this Library instead of custom calendar

		<div className="calendarContainer">
			<header>
				<div className="calendarCaption">
					<div className="captionMonth" onClick={toggleMonthDropDown}>
						<span>{monthName}</span>
						<span className="captionDropDown">
							<DownSvg />
						</span>
						{showMonths ? (
							<div className={`monthSelectorContainer `}>
								{calendarInfo.months.map((month, index) => (
									<div
										key={`monthName-${index}`}
										className={`monthName ${
											index === info.selectedMonth ? `selectedMonth` : ``
										}`}
										onClick={() => {
											handleMonthChange(index);
										}}
									>
										{month}
									</div>
								))}
							</div>
						) : (
							''
						)}
					</div>
					<div className="captionYear" onClick={toggleYearDropDown}>
						<span>{currentYear}</span>
						<span className="captionDropDown">
							<DownSvg />
						</span>
						{showYears ? (
							<div className={`yearSelectorContainer`}>
								{calendarInfo?.years?.map((year) => (
									<div
										key={year}
										className={`yearList ${
											info.selectedYear === year ? `selectedYear` : ``
										}`}
										onClick={() => handleYearChange(year)}
									>
										{year}
									</div>
								))}
							</div>
						) : (
							''
						)}
					</div>
				</div>
				<div className="calendarNav">
					<button onClick={goToPreviousMonth}>
						<LeftSvg />
					</button>

					<button onClick={goToNextMonth}>
						<RightSvg />
					</button>
				</div>
			</header>

			<div className="calendarDayNameGrid">
				{['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, index) => (
					<div key={index} className="calendarDayName">
						{day}
					</div>
				))}
			</div>

			<div className="dateContainer">
				{chunkArray(daysInMonth).map((week, weekIndex) => {
					const isSelectedWeek = week.some((date) => isSameDay(date, info.selectedDate));

					return (
						<div
							key={weekIndex}
							className={`dateRow ${isSelectedWeek ? 'highlightedRow' : ''}`}
						>
							{week.map((date, dateIndex) => {
								const isSelected = isSameDay(date, info.selectedDate);
								const isCurrent = isSameDay(date, new Date());

								return (
									<div
										key={dateIndex}
										className={`calendarDay ${
											date.getMonth() === info.currentCalendarDate.getMonth()
												? 'currentMonth'
												: 'otherMonth'
										} ${isSelected ? 'selectedDay' : ''} ${
											isCurrent ? 'currentDay' : ''
										}`}
										onClick={() => handelSelectedDate(date)}
									>
										{format(date, 'd')}
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default memo(CalendarSelector);

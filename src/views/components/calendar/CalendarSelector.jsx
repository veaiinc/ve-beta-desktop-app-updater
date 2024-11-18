import React, { memo, useState, useMemo, useEffect } from 'react';
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

const CalendarSelector = ({
	handlecurrentCalendarDateChange,
	currentCalendarDate,
	selectedMonth,
	selectedYear,
	selectedDate,
	handleMonthChange,
	handleYearChange,
	handelSelectedDate,
}) => {
	// const [info, setInfo] = useState({
	// 	todaysDate: new Date(),
	// 	currentCalendarDate: new Date(),
	// 	selectedMonth: new Date().getMonth(),
	// 	selectedYear: new Date().getFullYear(),
	// 	selectedDate: new Date(),
	// 	selectedWeek: [],
	// });

	//keeping it local
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

	//keeping these sates local to CalendarSelector
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
		handlecurrentCalendarDateChange(new Date(selectedYear, selectedMonth));
	}, [selectedMonth, selectedYear]);

	// Get the first and last day of the current month
	const firstDayOfMonth = startOfMonth(currentCalendarDate);
	const lastDayOfMonth = endOfMonth(currentCalendarDate);

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
		const date = subMonths(currentCalendarDate, 1);
		handlecurrentCalendarDateChange(
			date.getFullYear() < calendarInfo.minYear ? currentCalendarDate : date,
		);
	};
	const goToNextMonth = () => {
		const date = addMonths(currentCalendarDate, 1);
		handlecurrentCalendarDateChange(
			date.getFullYear() > calendarInfo.maxYear ? currentCalendarDate : date,
		);
	};

	// Get the month and year for display
	const monthName = format(currentCalendarDate, 'MMMM');
	const currentYear = format(currentCalendarDate, 'yyyy');

	// Function to chunk the array into groups of 7 for style properties
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
											index === selectedMonth ? `selectedMonth` : ``
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
											selectedYear === year ? `selectedYear` : ``
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
					const isSelectedWeek = week.some((date) => isSameDay(date, selectedDate));

					return (
						<div
							key={weekIndex}
							className={`dateRow ${isSelectedWeek ? 'highlightedRow' : ''}`}
						>
							{week.map((date, dateIndex) => {
								const isSelected = isSameDay(date, selectedDate);
								const isCurrent = isSameDay(date, new Date());

								return (
									<div
										key={dateIndex}
										className={`calendarDay ${
											date.getMonth() === currentCalendarDate.getMonth()
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

import React, { memo, useMemo, useState, useEffect, useCallback, useContext, useRef } from 'react';
import moment from 'moment';
import '../../../assets/scss/calendar/calendarSelector.scss';
// import LeftSvg from '../../../assets/svg/activity/left.svg?react';
// import RightSvg from '../../../assets/svg/activity/right.svg?react';
// import DownSvg from '../../../assets/svg/calendar/down.svg?react';
import Context from '../../../context/context';
import LeftSvg from '../../../assets/svg/activity/LeftSvg';
import RightSvg from '../../../assets/svg/activity/RightSvg';
import DownSvg from '../../../assets/svg/activity/DownSvg';

const MIN_YEAR = 1990;
const MAX_YEAR = 2050;
const MONTHS = moment.months();
const YEARS = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i);

const CalendarSelector = ({
	currentCalendarDate,
	selectedMonth,
	selectedYear,
	selectedDate,
	updateCalendarInfo,
}) => {
	const [info, setInfo] = useState({
		activeDropdown: null, // 'months', 'years', or null
	});
	const yearSelectorRef = useRef(null);
	const monthSelectorRef = useRef(null);
	const {
		themeInfo: { theme },
	} = useContext(Context);
	// Sync calendar date on month or year change
	useEffect(() => {
		updateCalendarInfo(
			'currentCalendarDate',
			moment({ year: selectedYear, month: selectedMonth }).toDate(),
		);
	}, [selectedMonth, selectedYear]);

	// Scroll to current year when year dropdown opens
	useEffect(() => {
		if (info.activeDropdown === 'years' && yearSelectorRef.current) {
			const currentYearIndex = YEARS.indexOf(selectedYear);
			const yearElement = yearSelectorRef.current.querySelector(
				`.yearList:nth-child(${currentYearIndex + 1})`,
			);
			if (yearElement) {
				yearElement.scrollIntoView({ block: 'center' });
			}
		}
	}, [info.activeDropdown, selectedYear]);

	// Handle click outside for both selectors
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				info.activeDropdown &&
				!monthSelectorRef.current?.contains(event.target) &&
				!yearSelectorRef.current?.contains(event.target)
			) {
				setInfo((prev) => ({ ...prev, activeDropdown: null }));
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [info.activeDropdown]);

	// Memoized calendar computations
	const daysInMonth = useMemo(() => {
		const firstDayOfMonth = moment(currentCalendarDate).startOf('month');
		const lastDayOfMonth = moment(currentCalendarDate).endOf('month');
		const startOfCalendar = moment(firstDayOfMonth).startOf('isoWeek');
		const endOfCalendar = moment(lastDayOfMonth).endOf('isoWeek');
		const days = [];
		let currentDay = startOfCalendar.clone();
		while (
			currentDay.isBefore(endOfCalendar, 'day') ||
			currentDay.isSame(endOfCalendar, 'day')
		) {
			days.push(currentDay.clone());
			currentDay.add(1, 'day');
		}
		return days;
	}, [currentCalendarDate]);

	// Toggle datedropdowns
	const toggleDropdown = useCallback((dropdown) => {
		setInfo((prevInfo) => ({
			activeDropdown: prevInfo.activeDropdown === dropdown ? null : dropdown,
		}));
	}, []);

	const toggleMonthDropDown = useCallback(() => toggleDropdown('months'), [toggleDropdown]);
	const toggleYearDropDown = useCallback(() => toggleDropdown('years'), [toggleDropdown]);

	// Navigate between months
	const goToPreviousMonth = useCallback(() => {
		const previousMonth = moment(currentCalendarDate)?.subtract(1, 'month');
		if (previousMonth?.year() >= MIN_YEAR) {
			updateCalendarInfo('currentCalendarDate', previousMonth?.toDate());
		}
	}, [currentCalendarDate, updateCalendarInfo]);

	const goToNextMonth = useCallback(() => {
		const nextMonth = moment(currentCalendarDate)?.add(1, 'month');
		if (nextMonth?.year() <= MAX_YEAR) {
			updateCalendarInfo('currentCalendarDate', nextMonth?.toDate());
		}
	}, [currentCalendarDate, updateCalendarInfo]);

	// Utility function to chunk array
	const chunkArray = useCallback((arr, size = 7) => {
		const result = [];
		for (let i = 0; i < arr.length; i += size) {
			result.push(arr.slice(i, i + size));
		}
		return result;
	}, []);

	// Memoized values for month name and year
	const monthName = useMemo(
		() => moment(currentCalendarDate).format('MMMM'),
		[currentCalendarDate],
	);
	const currentYear = useMemo(() => moment(currentCalendarDate).year(), [currentCalendarDate]);

	return (
		<div className="calendarWrapper">
			<div className="calendarHeader">
				<div className="dateSelectorContainer">
					{/* Month Selector */}
					<div
						className="monthSelector"
						onClick={toggleMonthDropDown}
						ref={monthSelectorRef}
					>
						<span>{monthName}</span>
						<span className="captionDropDown">
							<DownSvg className="downSvg" />
						</span>
						{info?.activeDropdown === 'months' && (
							<div className="monthSelectorContainer">
								<div className="selectorGrid">
									{MONTHS?.map((month, index) => (
										<div
											key={`monthName-${index}`}
											className={`monthName ${
												index === selectedMonth ? 'selectedMonth' : ''
											}`}
											onClick={() => {
												updateCalendarInfo('selectedMonth', index);
												setInfo((prev) => ({
													...prev,
													activeDropdown: 'months',
												}));
											}}
										>
											{month}
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Year Selector */}
					<div
						className="yearSelector"
						onClick={toggleYearDropDown}
						ref={yearSelectorRef}
					>
						<span>{currentYear}</span>
						<span className="captionDropDown">
							<DownSvg />
						</span>
						{info?.activeDropdown === 'years' && (
							<div className="yearSelectorContainer">
								<div className="selectorGrid">
									{YEARS?.map((year) => (
										<div
											key={year}
											className={`yearList ${
												year === selectedYear ? 'selectedYear' : ''
											}`}
											onClick={() => {
												updateCalendarInfo('selectedYear', year);
												setInfo((prev) => ({
													...prev,
													activeDropdown: 'years',
												}));
											}}
										>
											{year}
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Navigation Buttons */}
				<div className="calendarNav">
					<div onClick={goToPreviousMonth}>
						<LeftSvg />
					</div>
					<div onClick={goToNextMonth}>
						<RightSvg />
					</div>
				</div>
			</div>

			<div className="calendarContainer">
				{/* Day Names */}
				{/* <div className="calendarDayNameGrid">
					{['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']?.map((day, index) => (
						<div key={index} className="calendarDayName">
							{day}
						</div>
					))}
				</div> */}

				{/* Date Grid */}
				<div className="dateContainer">
					{chunkArray(daysInMonth)?.map((week, weekIndex) => {
						const isSelectedWeek = week?.some((date) =>
							moment(date)?.isSame(selectedDate, 'day'),
						);

						return (
							<div
								key={weekIndex}
								className={`dateRow ${isSelectedWeek ? 'highlightedRow' : ''}`}
							>
								{week?.map((date, dateIndex) => {
									const isSelected = moment(date)?.isSame(selectedDate, 'day');
									const isCurrent = moment(date)?.isSame(moment(), 'day');
									const isCurrentMonth = moment(date)?.isSame(
										currentCalendarDate,
										'month',
									);

									return (
										<div
											key={dateIndex}
											className={`calendarDay ${
												isCurrentMonth ? 'currentMonth' : 'otherMonth'
											} ${isSelected ? 'selectedDay' : ''} ${
												isCurrent ? 'currentDay' : ''
											}`}
											onClick={() =>
												updateCalendarInfo('selectedDate', date?.toDate())
											}
										>
											{date?.date()}
										</div>
									);
								})}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default memo(CalendarSelector);

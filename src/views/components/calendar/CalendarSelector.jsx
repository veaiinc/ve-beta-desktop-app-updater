import React, { memo, useMemo, useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import '../../../assets/scss/calendar/calendarSelector.scss';
import { ReactComponent as LeftSvg } from '../../../assets/svg/activity/left.svg';
import { ReactComponent as RightSvg } from '../../../assets/svg/activity/right.svg';
import { ReactComponent as DownSvg } from '../../../assets/svg/calendar/down.svg';

const CalendarSelector = ({
	currentCalendarDate,
	selectedMonth,
	selectedYear,
	selectedDate,
	updateCalendarInfo,
}) => {
	const [info, setInfo] = useState({
		showMonths: false,
		showYears: false,
	});

	// Memoized calendar information
	const calendarInfo = useMemo(() => {
		const minYear = 1990;
		const maxYear = 2050;
		const months = moment.months(); // Get all month names
		const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

		return { minYear, maxYear, months, years };
	}, []);

	// Sync calendar date on month or year change
	useEffect(() => {
		updateCalendarInfo(
			'currentCalendarDate',
			moment({ year: selectedYear, month: selectedMonth }).toDate(),
		);
	}, [selectedMonth, selectedYear]);

	const toggleMonthDropDown = useCallback(() => {
		setInfo((prevInfo) => {
			const { showYears, showMonths } = prevInfo;
			return {
				...prevInfo,
				showYears: showYears && !showMonths ? false : showYears,
				showMonths: !showMonths,
			};
		});
	}, []);

	const toggleYearDropDown = useCallback(() => {
		setInfo((prevInfo) => {
			const { showYears, showMonths } = prevInfo;
			return {
				...prevInfo,
				showYears: !showYears,
				showMonths: !showYears && showMonths ? false : showMonths,
			};
		});
	}, []);

	// Generate days for the calendar
	const firstDayOfMonth = moment(currentCalendarDate)?.startOf('month');
	const lastDayOfMonth = moment(currentCalendarDate)?.endOf('month');

	const startOfCalendar = moment(firstDayOfMonth)?.startOf('isoWeek'); // Start from Monday
	const endOfCalendar = moment(lastDayOfMonth)?.endOf('isoWeek'); // Ends on the last Sunday of the week

	const daysInMonth = [];
	let currentDay = startOfCalendar?.clone();
	while (currentDay?.isBefore(endOfCalendar, 'day') || currentDay?.isSame(endOfCalendar, 'day')) {
		daysInMonth.push(currentDay?.clone());
		currentDay?.add(1, 'day');
	}

	// Navigate between months
	const goToPreviousMonth = () => {
		const previousMonth = moment(currentCalendarDate)?.subtract(1, 'month');
		if (previousMonth?.year() >= calendarInfo?.minYear) {
			updateCalendarInfo('currentCalendarDate', previousMonth?.toDate());
		}
	};

	const goToNextMonth = () => {
		const nextMonth = moment(currentCalendarDate)?.add(1, 'month');
		if (nextMonth?.year() <= calendarInfo?.maxYear) {
			updateCalendarInfo('currentCalendarDate', nextMonth?.toDate());
		}
	};

	const chunkArray = (arr, size = 7) => {
		const result = [];
		for (let i = 0; i < arr.length; i += size) {
			result.push(arr.slice(i, i + size));
		}
		return result;
	};

	const monthName = moment(currentCalendarDate).format('MMMM');
	const currentYear = moment(currentCalendarDate).year();

	return (
		<div className="calendarContainer">
			<header>
				<div className="calendarCaption">
					<div className="captionMonth" onClick={toggleMonthDropDown}>
						<span>{monthName}</span>
						<span className="captionDropDown">
							<DownSvg />
						</span>
						{info?.showMonths && (
							<div className={`monthSelectorContainer`}>
								{calendarInfo?.months?.map((month, index) => (
									<div
										key={`monthName-${index}`}
										className={`monthName ${
											index === selectedMonth ? 'selectedMonth' : ''
										}`}
										onClick={() => updateCalendarInfo('selectedMonth', index)}
									>
										{month}
									</div>
								))}
							</div>
						)}
					</div>
					<div className="captionYear" onClick={toggleYearDropDown}>
						<span>{currentYear}</span>
						<span className="captionDropDown">
							<DownSvg />
						</span>
						{info?.showYears && (
							<div className={`yearSelectorContainer`}>
								{calendarInfo?.years?.map((year) => (
									<div
										key={year}
										className={`yearList ${
											year === selectedYear ? 'selectedYear' : ''
										}`}
										onClick={() => updateCalendarInfo('selectedYear', year)}
									>
										{year}
									</div>
								))}
							</div>
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
				{['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']?.map((day, index) => (
					<div key={index} className="calendarDayName">
						{day}
					</div>
				))}
			</div>

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
	);
};

export default memo(CalendarSelector);

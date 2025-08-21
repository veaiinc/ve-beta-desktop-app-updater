import { memo, useEffect, useState } from 'react';
import moment from 'moment';
import s from '../../../../../assets/scss/globalComponents/widgets/calendar/calendar.module.scss';
import { ReactComponent as ChevronRightThinSvg } from '../../../../../assets/svg/tasks/chevronRightThin.svg';

const Calendar = ({ onDateSelect = () => {}, className = '', style = {}, startDate = null }) => {
	const [currentMonth, setCurrentMonth] = useState(moment().startOf('month'));
	const [selectedDate, setSelectedDate] = useState(null);

	useEffect(() => {
		if (startDate) {
			setCurrentMonth(moment(startDate * 1000)?.startOf('month'));
			setSelectedDate(moment(startDate * 1000));
		}
	}, [startDate]);

	// --- Navigation handlers ---
	const handlePrevMonth = () => {
		setCurrentMonth((prev) => prev.clone().subtract(1, 'month'));
	};

	const handleNextMonth = () => {
		setCurrentMonth((prev) => prev.clone().add(1, 'month'));
	};

	// --- Helpers ---
	const isToday = (date) => date.isSame(moment(), 'day');
	const isSelected = (date) => selectedDate && date.isSame(selectedDate, 'day');
	const isCurrentMonth = (date) => date.isSame(currentMonth, 'month');
	const isPastDate = (date) => date.isBefore(moment(), 'day');

	const getCellClasses = (date) => {
		const classes = [s.dayCell];
		if (isSelected(date)) classes.push(s.selected);
		if (!isCurrentMonth(date)) classes.push(s.hiddenDay); // hide other months
		if (isPastDate(date)) classes.push(s.disabledDay);
		return classes.join(' ');
	};

	// --- Generate calendar grid (with padding for weekdays, but hide other months) ---
	const generateCalendarGrid = () => {
		const startOfMonth = currentMonth.clone().startOf('month');
		const endOfMonth = currentMonth.clone().endOf('month');

		const startOfGrid = startOfMonth.clone().startOf('week');
		const endOfGrid = endOfMonth.clone().endOf('week');

		const weeks = [];
		let currentDate = startOfGrid.clone();

		while (currentDate.isSameOrBefore(endOfGrid, 'day')) {
			const week = [];
			for (let i = 0; i < 7; i++) {
				week.push(currentDate.clone());
				currentDate.add(1, 'day');
			}
			weeks.push(week);
		}

		return weeks;
	};

	const handleDateClick = (date) => {
		setSelectedDate(date);
		onDateSelect(date);
	};

	const weeks = generateCalendarGrid();
	const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

	return (
		<div className={`${s.calendarContainer} ${className}`} style={style}>
			{/* Header */}
			<div className={s.calendarHeader}>
				<div className={s.selectedDate}>{currentMonth?.format('MMM YYYY')}</div>

				<div className={s.navButtonContainer}>
					<button
						type="button"
						className={`${s.navButton} ${s.left}`}
						onClick={handlePrevMonth}
					>
						<ChevronRightThinSvg />
					</button>
					<button type="button" className={`${s.navButton} `} onClick={handleNextMonth}>
						<ChevronRightThinSvg />
					</button>
				</div>
			</div>

			{/* Weekday row */}
			<div className={s.weekdayHeader}>
				{weekdays?.map((day) => (
					<div key={day} className={s.weekdayLabel}>
						{day}
					</div>
				))}
			</div>

			{/* Calendar grid */}
			<div className={s.calendarGrid}>
				{weeks?.map((week, weekIndex) => (
					<div key={weekIndex} className={s.calendarWeek}>
						{week?.map((date, index) => {
							const cellClasses = getCellClasses(date);
							const isDisabled = cellClasses?.includes(s.disabledDay);
							return (
								<button
									key={index}
									className={cellClasses}
									onClick={() => handleDateClick(date)}
									type="button"
									disabled={isDisabled}
								>
									{date?.date()}
									{isToday(date) && <div className={s.todayIndicator} />}
								</button>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(Calendar);

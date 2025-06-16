import { useState } from 'react';
import moment from 'moment';
import styles from '../../../../assets/scss/notes/databaseComponents/calendarPicker.module.scss';

const CalendarPicker = ({
	startDate = null,
	endDate = null,
	onDateSelect = () => {},
	onRangeSelect = () => {},
	hoverDate = null,
	onHover = () => {},
	className = '',
	style = {},
}) => {
	const [currentMonth, setCurrentMonth] = useState(() => {
		if (startDate) return moment(startDate).startOf('month');
		return moment().startOf('month');
	});

	const handlePrevMonth = () => {
		setCurrentMonth((prev) => prev.clone().subtract(1, 'month'));
	};

	const handleNextMonth = () => {
		setCurrentMonth((prev) => prev.clone().add(1, 'month'));
	};

	const handleDateClick = (date) => {
		// If the clicked date is from a different month, update the current month
		if (!date.isSame(currentMonth, 'month')) {
			setCurrentMonth(date.clone().startOf('month'));
		}
		onDateSelect(date);
	};

	const handleDateHover = (date) => {
		onHover(date);
	};

	const generateCalendarGrid = () => {
		const startOfMonth = currentMonth.clone().startOf('month');
		const endOfMonth = currentMonth.clone().endOf('month');
		const startOfGrid = startOfMonth.clone().startOf('week').day(0);
		const endOfGrid = endOfMonth.clone().endOf('week').day(6);

		const weeks = [];
		let currentWeek = [];
		let currentDate = startOfGrid.clone();

		// Generate exactly 6 weeks
		for (let week = 0; week < 6; week++) {
			currentWeek = [];
			for (let day = 0; day < 7; day++) {
				currentWeek.push(currentDate.clone());
				currentDate.add(1, 'day');
			}
			weeks.push(currentWeek);
		}

		return weeks;
	};

	const isInRange = (date) => {
		if (!startDate) return false;

		if (endDate) {
			return date.isBetween(startDate, endDate, 'day', '[]');
		}

		if (hoverDate) {
			if (moment(hoverDate).isBefore(startDate)) {
				return date.isBetween(hoverDate, startDate, 'day', '[]');
			} else {
				return date.isBetween(startDate, hoverDate, 'day', '[]');
			}
		}

		return false;
	};

	const isRangeStart = (date) => {
		if (!startDate) return false;
		if (endDate && moment(endDate).isBefore(startDate)) {
			return date.isSame(endDate, 'day');
		}
		return date.isSame(startDate, 'day');
	};

	const isRangeEnd = (date) => {
		if (!startDate) return false;
		if (endDate) {
			return date.isSame(endDate, 'day');
		}
		if (hoverDate) {
			if (moment(hoverDate).isBefore(startDate)) {
				return date.isSame(startDate, 'day');
			} else {
				return date.isSame(hoverDate, 'day');
			}
		}
		return false;
	};

	const isToday = (date) => {
		return date.isSame(moment(), 'day');
	};

	const isCurrentMonth = (date) => {
		return date.isSame(currentMonth, 'month');
	};

	const getCellClasses = (date) => {
		const classes = [styles.calendarDay];

		if (!isCurrentMonth(date)) {
			classes.push(styles.otherMonth);
		}

		if (isToday(date)) {
			classes.push(styles.today);
		}

		if (isRangeStart(date)) {
			classes.push(styles.rangeStart);
		}

		if (isRangeEnd(date)) {
			classes.push(styles.rangeEnd);
		}

		if (isInRange(date)) {
			classes.push(styles.inRange);
		}

		return classes.join(' ');
	};

	const weeks = generateCalendarGrid();
	const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

	return (
		<div className={`${styles.calendarContainer} ${className}`} style={style}>
			{/* Header */}
			<div className={styles.calendarHeader}>
				<h3 className={styles.monthYear}>{currentMonth.format('MMMM YYYY')}</h3>
				<div className={styles.navButtonContainer}>
					<button
						type="button"
						className={styles.navButton}
						onClick={handlePrevMonth}
						aria-label="Previous month"
					>
						←
					</button>

					<button
						type="button"
						className={styles.navButton}
						onClick={handleNextMonth}
						aria-label="Next month"
					>
						→
					</button>
				</div>
			</div>

			{/* Weekday headers */}
			<div className={styles.weekdayHeader}>
				{weekdays.map((day) => (
					<div key={day} className={styles.weekdayLabel}>
						{day}
					</div>
				))}
			</div>

			{/* Calendar grid */}
			<div className={styles.calendarGrid}>
				{weeks.map((week, weekIndex) => (
					<div key={weekIndex} className={styles.calendarWeek}>
						{week.map((date) => (
							<div
								key={date.format('YYYY-MM-DD')}
								className={getCellClasses(date)}
								onClick={() => handleDateClick(date)}
								onMouseEnter={() => handleDateHover(date)}
							>
								<span className={styles.dayNumber}>{date.date()}</span>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default CalendarPicker;

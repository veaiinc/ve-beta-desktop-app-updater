import React, { useState } from 'react';
import moment from 'moment';
import CalendarPicker from '../../../notes/DatabseComponents/CalendarPicker';
import s from '../../../../../assets/scss/notes/dropdown/dateFilterDropdown.module.scss';

const DateFilterDropdown = ({ selected, onChange, title, showStartEnd = true }) => {
	const [dateType, setDateType] = useState(selected?.dateType || 'startDate');
	const [activeInput, setActiveInput] = useState(0); // 0 for first input, 1 for second input
	const [isSelectingRange, setIsSelectingRange] = useState(false);
	const [hoverDate, setHoverDate] = useState(null);

	const handleDateTypeChange = (e) => {
		const newDateType = e.target.value;
		setDateType(newDateType);
		if (showStartEnd && selected?.date) {
			onChange({
				date: selected.date,
				dateType: newDateType,
			});
		}
	};

	const handleDateSelect = (date) => {
		const timestamp = moment(date).unix();

		if (Array.isArray(selected?.date)) {
			if (activeInput === 0) {
				// When selecting first date
				if (selected.date[1] && timestamp > selected.date[1]) {
					// If selected date is after the end date, swap them
					onChange({
						date: [selected.date[1], timestamp],
						dateType: dateType,
					});
				} else {
					// Normal case - update start date
					onChange({
						date: [timestamp, selected.date[1]],
						dateType: dateType,
					});
				}
				setActiveInput(1); // Move to end date selection
				setIsSelectingRange(true);
			} else {
				// When selecting second date
				if (timestamp < selected.date[0]) {
					// If selected date is before the start date, swap them
					onChange({
						date: [timestamp, selected.date[0]],
						dateType: dateType,
					});
				} else {
					// Normal case - update end date
					onChange({
						date: [selected.date[0], timestamp],
						dateType: dateType,
					});
				}
				setActiveInput(0); // Move back to start date selection
				setIsSelectingRange(false);
			}
		} else {
			// Single date selection
			onChange({
				date: timestamp,
				dateType: dateType,
			});
		}
		setHoverDate(null);
	};

	const handleDateHover = (date) => {
		if (
			Array.isArray(selected?.date) &&
			isSelectingRange &&
			selected.date[0] &&
			!selected.date[1]
		) {
			setHoverDate(date);
		}
	};

	const getDisplayDate = (index = 0) => {
		if (Array.isArray(selected?.date)) {
			return selected.date[index]
				? moment.unix(selected.date[index]).format('MMM DD, YYYY')
				: '';
		}
		return selected?.date ? moment.unix(selected.date).format('MMM DD, YYYY') : '';
	};

	const getCalendarDate = () => {
		if (Array.isArray(selected?.date)) {
			return selected.date[activeInput] ? moment.unix(selected.date[activeInput]) : null;
		}
		return selected?.date ? moment.unix(selected.date) : null;
	};

	const getStartDate = () => {
		if (Array.isArray(selected?.date)) {
			return selected.date[0] ? moment.unix(selected.date[0]) : null;
		}
		return null;
	};

	const getEndDate = () => {
		if (Array.isArray(selected?.date)) {
			return selected.date[1] ? moment.unix(selected.date[1]) : null;
		}
		return null;
	};

	return (
		<div className={s.dateFilterDropdown}>
			<div className={s.topSection}>
				<div className={s.topSectionTitle}>{title}</div>
			</div>
			<div className={s.bodySection}>
				{showStartEnd && (
					<select
						className={s.dateTypeSelect}
						value={dateType}
						onChange={handleDateTypeChange}
					>
						<option value="startDate">Start Date</option>
						<option value="endDate">End Date</option>
					</select>
				)}
				<div className={s.inputContainer}>
					{Array.isArray(selected?.date) ? (
						<>
							<input
								type="text"
								placeholder="Start Date"
								value={getDisplayDate(0)}
								readOnly
								onClick={() => setActiveInput(0)}
								className={activeInput === 0 ? s.activeInput : ''}
							/>
							<input
								type="text"
								placeholder="End Date"
								value={getDisplayDate(1)}
								readOnly
								onClick={() => setActiveInput(1)}
								className={activeInput === 1 ? s.activeInput : ''}
							/>
						</>
					) : (
						<input
							type="text"
							placeholder="Select Date"
							value={getDisplayDate()}
							readOnly
						/>
					)}
				</div>
			</div>
			<CalendarPicker
				startDate={getStartDate()}
				endDate={getEndDate()}
				hoverDate={hoverDate}
				onDateSelect={handleDateSelect}
				onHover={handleDateHover}
			/>
		</div>
	);
};

export default DateFilterDropdown;

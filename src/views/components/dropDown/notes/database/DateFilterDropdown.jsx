import React, { useState } from 'react';
import moment from 'moment';
import CalendarPicker from '../../../notes/DatabseComponents/CalendarPicker';
import s from '../../../../../assets/scss/notes/dropdown/dateFilterDropdown.module.scss';

const DateFilterDropdown = ({ selected, onChange, title, showStartEnd = true }) => {
	const [dateType, setDateType] = useState(
		typeof selected === 'object' ? selected?.dateType || 'startDate' : 'startDate',
	);

	const handleDateTypeChange = (e) => {
		const newDateType = e.target.value;
		setDateType(newDateType);
		if (showStartEnd) {
			if (typeof selected === 'object' && selected?.date) {
				onChange({
					date: selected.date,
					dateType: newDateType,
				});
			} else if (typeof selected === 'number') {
				onChange({
					date: selected,
					dateType: newDateType,
				});
			}
		}
	};

	const handleDateSelect = (date) => {
		const timestamp = moment(date).unix();
		if (showStartEnd) {
			onChange({
				date: timestamp,
				dateType: dateType,
			});
		} else {
			onChange(timestamp);
		}
	};

	const getDisplayDate = () => {
		if (typeof selected === 'object' && selected?.date) {
			return moment.unix(selected.date).format('MMM DD, YYYY');
		} else if (typeof selected === 'number') {
			return moment.unix(selected).format('MMM DD, YYYY');
		}
		return '';
	};

	const getCalendarDate = () => {
		if (typeof selected === 'object' && selected?.date) {
			return moment.unix(selected.date);
		} else if (typeof selected === 'number') {
			return moment.unix(selected);
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
				<input type="text" placeholder="Select Date" value={getDisplayDate()} readOnly />
			</div>
			<CalendarPicker
				startDate={getCalendarDate()}
				endDate={getCalendarDate()}
				onDateSelect={handleDateSelect}
			/>
		</div>
	);
};

export default DateFilterDropdown;

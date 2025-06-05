import React, { useState } from 'react';
import moment from 'moment';
import CalendarPicker from '../../../notes/DatabseComponents/CalendarPicker';
import s from '../../../../../assets/scss/notes/dropdown/dateFilterDropdown.module.scss';

const DateFilterDropdown = ({ selected, onChange, title }) => {
	const [dateType, setDateType] = useState(selected?.dateType || 'startDate');

	const handleDateTypeChange = (e) => {
		const newDateType = e.target.value;
		setDateType(newDateType);
		if (selected?.date) {
			onChange({
				date: selected.date,
				dateType: newDateType,
			});
		}
	};

	const handleDateSelect = (date) => {
		onChange({
			date: moment(date).unix(),
			dateType: dateType,
		});
	};

	return (
		<div className={s.dateFilterDropdown}>
			<div className={s.topSection}>
				<div className={s.topSectionTitle}>{title}</div>
			</div>
			<div className={s.bodySection}>
				<select
					className={s.dateTypeSelect}
					value={dateType}
					onChange={handleDateTypeChange}
				>
					<option value="startDate">Start Date</option>
					<option value="endDate">End Date</option>
				</select>
				<input
					type="text"
					placeholder="Select Date"
					value={selected?.date ? moment.unix(selected.date).format('MMM DD, YYYY') : ''}
					readOnly
				/>
			</div>
			<CalendarPicker
				startDate={selected?.date ? moment.unix(selected.date) : null}
				endDate={selected?.date ? moment.unix(selected.date) : null}
				onDateSelect={handleDateSelect}
			/>
		</div>
	);
};

export default DateFilterDropdown;

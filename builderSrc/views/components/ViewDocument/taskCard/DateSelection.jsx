import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { CalendarOutlined } from '@ant-design/icons';
import 'react-datepicker/dist/react-datepicker.css';

const DateSelection = ({
	value,
	onChange,
	title,
	showTime = false,
	format = 'yyyy-MM-dd',
	placeholder,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	// Convert epoch to Date object for display
	const displayValue = value ? new Date(value * 1000) : null;

	const handleDateChange = (date) => {
		// Convert selected date to epoch timestamp
		const epochValue = date ? Math.floor(date.getTime() / 1000) : null;
		onChange(epochValue);
		setIsOpen(false);
	};

	return (
		<div>
			<DatePicker
				selected={displayValue}
				onChange={handleDateChange}
				open={isOpen}
				onInputClick={() => setIsOpen(true)}
				onCalendarOpen={() => setIsOpen(true)}
				onCalendarClose={() => setIsOpen(false)}
				showTimeSelect={false} // Make sure this is false
				showTimeSelectOnly={false} // Make sure this is false
				dateFormat="yyyy-MM-dd" // Use date-only format
				placeholderText={placeholder || (title ? `Select ${title}` : 'Select date')}
				className="dateView-datePicker-icon"
				style={{
					width: '40px',
					height: '40px',
					backgroundColor: 'transparent',
					border: '1px solid #d9d9d9',
					borderRadius: '6px',
					padding: '8px',
					cursor: 'pointer',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: '0',
				}}
				readOnly
				showIcon
				toggleCalendarOnIconClick
				calendarIcon={<CalendarOutlined style={{ color: '#1890ff', fontSize: '16px' }} />}
				popperClassName="date-picker-dropdown"
				popperPlacement="bottom-start"
				popperModifiers={[
					{
						name: 'offset',
						options: {
							offset: [-50, 0], // [left offset, top offset]
						},
					},
					{
						name: 'preventOverflow',
						options: {
							boundary: 'viewport',
						},
					},
				]}
			/>
		</div>
	);
};

export default DateSelection;

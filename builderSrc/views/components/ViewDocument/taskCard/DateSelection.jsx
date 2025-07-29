import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateSelection = ({ value, onChange, title, placeholder }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [date, setDate] = useState(value);

	// Safely convert epoch to Date object for display
	// const getDisplayValue = () => {
	// 	try {
	// 		if (!value || value === null || value === undefined) {
	// 			return null;
	// 		}

	// 		// If value is already a Date object
	// 		if (value instanceof Date) {
	// 			return value;
	// 		}

	// 		// If value is a string (ISO format), parse it
	// 		if (typeof value === 'string') {
	// 			const parsed = new Date(value);
	// 			if (!isNaN(parsed.getTime())) {
	// 				return parsed;
	// 			}
	// 		}

	// 		// If value is a number (epoch timestamp)
	// 		if (typeof value === 'number' && !isNaN(value)) {
	// 			// Check if it's already in milliseconds (13 digits) or seconds (10 digits)
	// 			const timestamp = value.toString().length === 13 ? value : value * 1000;
	// 			return new Date(timestamp);
	// 		}

	// 		return null;
	// 	} catch (error) {
	// 		console.error('Error converting date value:', error);
	// 		return null;
	// 	}
	// };

	// const displayValue = getDisplayValue();

	const handleDateChange = (date) => {
		try {
			if (date && !isNaN(date.getTime())) {
				// Create a new date with only the date part (time set to 00:00:00)
				const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

				// Convert to ISO string with timezone offset, but only date part
				const year = selectedDate.getFullYear();
				const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
				const day = String(selectedDate.getDate()).padStart(2, '0');

				const isoString = `${year}-${month}-${day}`;
				setDate(isoString);
				onChange(isoString);
			} else {
				onChange(null);
			}
			setIsOpen(false);
		} catch (error) {
			console.error('Error handling date change:', error);
			onChange(null);
			setIsOpen(false);
		}
	};

	return (
		<div style={{ position: 'relative' }}>
			<DatePicker
				selected={date}
				onChange={handleDateChange}
				open={isOpen}
				onInputClick={() => setIsOpen(true)}
				onCalendarOpen={() => setIsOpen(true)}
				onCalendarClose={() => setIsOpen(false)}
				showTimeSelect={false}
				dateFormat="yyyy-MM-dd"
				placeholderText={placeholder || (title ? `Select ${title}` : 'Select date')}
				className="dateView-datePicker"
				style={{
					width: '100%',
					backgroundColor: 'white',
					border: '1px solid #d9d9d9',
					borderRadius: '6px',
					padding: '8px 12px',
					cursor: 'pointer',
					fontSize: '14px',
					lineHeight: '1.5',
				}}
			/>
		</div>
	);
};

export default DateSelection;

import React, { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const DateSelection = ({ value, onChange, title, placeholder }) => {
	const [selectedDate, setSelectedDate] = useState(null);

	useEffect(() => {
		if (value) {
			setSelectedDate(dayjs(value));
		}
	}, [value]);

	const handleDateChange = (date) => {
		setSelectedDate(date);
		if (date) {
			const isoDate = date.format('YYYY-MM-DD');
			onChange(isoDate);
		} else {
			onChange(null);
		}
	};

	return (
		<div className="white-datepicker">
			<style>
				{`
                    .white-datepicker .ant-picker-suffix {
                        color: white !important;
                    }
                    .white-datepicker .ant-picker {
                        background-color: transparent;
                    }
                    .white-datepicker .ant-picker-input > input {
                        color: white;
                    }
                    .white-datepicker .ant-picker-input > input::placeholder {
                        color: rgba(255, 255, 255, 0.6);
                    }
                `}
			</style>
			<DatePicker
				value={selectedDate}
				onChange={handleDateChange}
				format="DD-MM-YYYY"
				placeholder={placeholder || (title ? `Select ${title}` : 'Select date')}
				allowClear={false}
				style={{
					width: '100%',
					backgroundColor: 'transparent',
					color: 'white',
				}}
			/>
		</div>
	);
};

export default DateSelection;

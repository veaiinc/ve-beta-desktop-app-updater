import React, { memo, useCallback, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import '../../../assets/scss/calendar/calendarSelector.scss';
// import { ReactComponent as LeftSvg } from '../../../assets/svg/activity/left.svg';
// import { ReactComponent as OpenCalSvg } from '../../../assets/svg/calendar/openCalendar.svg';
// import { ReactComponent as RightSvg } from '../../../assets/svg/activity/right.svg';

const CalendarSelector = () => {
	const [info, setInfo] = useState({
		selectedDate: new Date(),
	});
	console.log('selectedDate');

	const handleSelectDate = useCallback((selectedDate) => {
		setInfo((prevInfo) => ({ ...prevInfo, selectedDate }));
	}, []);

	return (
		<div className="calendarSelectorParentContainer">
			<DayPicker
				mode="single"
				selected={info?.selectedDate}
				onSelect={handleSelectDate}
				captionLayout="dropdown"
				weekStartsOn={1}
				showOutsideDays
				className="weekRow"
			/>
		</div>
	);
};

export default memo(CalendarSelector);

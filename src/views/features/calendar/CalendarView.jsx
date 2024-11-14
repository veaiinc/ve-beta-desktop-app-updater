import React, { memo, useState, useCallback } from 'react';
import '../../../assets/scss/calendar/calendar.scss';
import CalendarHeader from '../../components/calendar/CalendarHeader';
import CalendarViewType from '../../components/calendar/CalendarViewType';

const CalendarView = () => {
	const [info, setInfo] = useState({
		activeView: 'Month',
	});
	const handleToggleView = useCallback((view) => {
		setInfo((prevInfo) => ({ ...prevInfo, activeView: view }));
	}, []);
	return (
		<div className="calendarViewParentContainer">
			<CalendarHeader activeView={info?.activeView} handleToggleView={handleToggleView} />
			<CalendarViewType activeView={info?.activeView} />
		</div>
	);
};

export default memo(CalendarView);

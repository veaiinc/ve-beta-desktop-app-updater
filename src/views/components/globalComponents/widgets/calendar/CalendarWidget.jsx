import React, { memo, useMemo } from 'react';
import s from '../../../../../assets/scss/globalComponents/widgets/calendar/calendarWidget.module.scss';
import AddCalendarWidget from './AddCalendarWidget';

const CalendarWidget = ({ action, widgetData }) => {
	const widgetMapper = useMemo(() => {
		return {
			create_event: <AddCalendarWidget widgetData={widgetData} />,
		};
	}, [action, widgetData]);

	return widgetMapper[action] ? (
		<div className={s.calendarWidgetContainer}>{widgetMapper[action]}</div>
	) : (
		''
	);
};

export default memo(CalendarWidget);

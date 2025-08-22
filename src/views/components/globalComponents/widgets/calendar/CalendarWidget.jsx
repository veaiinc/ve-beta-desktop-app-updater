import React, { memo, useMemo } from 'react';
import s from '../../../../../assets/scss/globalComponents/widgets/calendar/calendarWidget.module.scss';
import AddCalendarWidget from './AddCalendarWidget';

const CalendarWidget = ({ widgetInfo, widgetData, showSkipBtn = false, onChange = null }) => {
	const widgetMapper = useMemo(() => {
		return {
			create_event: (
				<AddCalendarWidget
					widgetData={widgetData}
					showSkipBtn={showSkipBtn}
					onChange={onChange}
					widgetInfo={widgetInfo}
				/>
			),
		};
	}, [widgetData, showSkipBtn, onChange, widgetInfo]);

	return widgetMapper[widgetInfo?.action] ? (
		<div className={s.calendarWidgetContainer}>{widgetMapper[widgetInfo?.action]}</div>
	) : (
		''
	);
};

export default memo(CalendarWidget);

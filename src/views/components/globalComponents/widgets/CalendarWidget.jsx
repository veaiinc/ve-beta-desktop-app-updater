import { memo } from 'react';
import s from '../../../../assets/scss/globalComponents/widgets/calendarWidget.module.scss';

const CalendarWidget = ({ widgetData = null }) => {
	return (
		<div className={s.calendarWidgetContainer}>
			<div className={s.calendarWidgetWrapper}>
				<div className={s.calendar}></div>
			</div>
			<div className={s.buttonsContainer}></div>
		</div>
	);
};

export default memo(CalendarWidget);

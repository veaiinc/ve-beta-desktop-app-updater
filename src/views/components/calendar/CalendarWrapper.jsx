import React, { memo } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
moment.locale('es', {
	week: {
		dow: 1, // for starrting day from monday
	},
});

const localizer = momentLocalizer(moment);

const Calendar = (props) => {
	return <BigCalendar {...props} localizer={localizer} />;
};

export default memo(Calendar);

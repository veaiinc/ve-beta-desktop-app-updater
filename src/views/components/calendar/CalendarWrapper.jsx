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
const minTime = moment().set({ hours: 6, minutes: 0, seconds: 0 }).toDate(); //set  time to 6am

const Calendar = (props) => {
	return <BigCalendar {...props} localizer={localizer} min={minTime} />;
};

export default memo(Calendar);

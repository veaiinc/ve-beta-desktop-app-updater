import React, { memo } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
moment.locale('es', {
	week: {
		dow: 1, // for starting day from monday
	},
});

const localizer = momentLocalizer(moment);
const scrollToTime = moment().set({ hours: 7, minutes: 0, seconds: 0 }).toDate(); // scroll to 7am

const Calendar = (props) => {
	return <BigCalendar {...props} localizer={localizer} scrollToTime={scrollToTime} />;
};

export default memo(Calendar);

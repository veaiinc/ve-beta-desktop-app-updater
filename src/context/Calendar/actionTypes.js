export const CALENDAR = {
	// calendarChat: '/calendar_chat',
	calendarChat: '/multi_agent_chat',
	sendEventToAi: '/calendar_event_classify',
	calendarEventsList: '/calendar/getEventsList',
	calendarAllEvents: '/calendar/getAllEvents',
	createCalendarEvent: '/calendar/createEvent',
	updateCalendarCategory: '/calendar/update-category',
	getcalendarCategories: '/calendar/calendar-category',
	deleteCalendarCategory: '/calendar/deleteCalendarCategory',
	getCalendarEventDetails: '/calendar/getEvent',
	updateCalendarEvent: '/calendar/updateEvent',
	deleteCalendarEvent: '/calendar/deleteEvent',
	resetCalendarState: 'RESET_CALENDAR_STATE',
	resetCalendarAiChat: 'RESET_CALENDAR_AI_CHAT',
	getGoogleCalendarEventsList: '/calendar/google-events',

	//Scheduler Apis ================================>
	schedulerList: '/scheduler/all-sessions',
	createSchedulerSession: '/scheduler/createsession',
	getSchedulerSessionDetail: '/get-session',
	updateSchedulerSession: '/update',
	resetSchedulerState: 'RESET_SCHEDULER_STATE',

	// Google Calendar Apis ================================>
	getConnectedGoogleCalendar: '/googlecalendar/connected-calendars',
	getGoogleCalendarList: '/googlecalendar/calendar-list',
	fetchCalendarEventsFromGoogle: '/googlecalendar/getEvents',
	createGoogleCalendarEvent: '/googlecalendar/create-event',
	watchGoogleCalendar: '/googlecalendar/watch',
	stopGoogleCalendar: '/googlecalendar/stop',
};

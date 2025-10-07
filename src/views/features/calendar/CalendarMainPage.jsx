import { memo, useState, useCallback, useEffect, useContext } from 'react';
import '../../../assets/scss/calendar/calendar.scss';
import CalendarSidebar from './CalendarSidebar';
import CalendarView from './CalendarView';
// import EditScheduler from './EditScheduler';
import Context from '../../../context/context';
import ObjectId from 'bson-objectid';
import moment from 'moment';
import ChatLeftBarComponent from '../../components/ChatLeftBarComponent';
import SchedulerSessionMainPage from '../../components/calendar/SchedulerSessionMainPage';
import { message } from '../../components/globalComponents/CustomToast';

const initialState = {
	selectedWeek: [],
	isCreateEventOpen: false,
	isEventSelected: false,
	categoryList: [],
	selectedCategory: null,
	categoryFilter: [],
	selectedWorkflowId: null,
	selectedSlot: null,
	chatList: [{ type: 'AI', message: 'Hello, how can I help you today?' }],
	chatSessionId: null,
	aiChatLoading: false,
	workflowSlug: null,
	chatQuery: '',
	schedulerList: [],
	selectedSession: null,
	sessionFilter: [],
	showEditScheduler: false,
	showGoogleEvents: true,
};

const aiSuggestions = [
	{
		id: 1,
		name: 'Schedule a meeting',
	},
	{
		id: 2,
		name: 'Quick reminder',
	},
	{
		id: 3,
		name: 'Make a weekly plans',
	},
];

const Calendar = () => {
	const {
		calendarInfo: {
			calendarCategoriesList,
			getCalendarCategories,
			resetCalendarAiChat,
			getCalendarEventsList,
			updateCalendarState,
			refetchCalendarState,
			getSchedulerList,
			schedulerList,
			googleCalendarList,
			getGoogleCalendarList,
		},
		companyInfo: { getTeamMembers },
		templates: { updateStateValues, getConnectedThirdParties, googleCalendarWatch },
	} = useContext(Context);

	const [info, setInfo] = useState({
		currentCalendarDate: new Date(),
		selectedMonth: new Date().getMonth(),
		selectedYear: new Date().getFullYear(),
		selectedDate: new Date(),
		...initialState,
	});

	// Close left sidebar when component unmounts
	// updateStateValues({ leftSidebarState: 'open' });

	useEffect(() => {
		const sessionId = ObjectId().toString();
		setInfo((prevInfo) => ({ ...prevInfo, chatSessionId: sessionId }));
		if (!calendarCategoriesList) {
			getCalendarCategories();
		}

		getSchedulerList();

		return () => {
			setInfo((prevInfo) => ({
				...prevInfo,
				...initialState,
			}));
			resetCalendarAiChat();
		};
	}, []);

	// useEffect(() => {
	// 	if (!calendarEventsFromGoogle) {
	// 		const calendarId = 12;
	// 		const isWorkspaceCalendar =false
	// 		fetchCalendarEventsFromGoogle(calendarId, isWorkspaceCalendar);}
	// }, [calendarEventsFromGoogle]);

	// useEffect(() => {
	// 	if (!googleCalendarEvents) {
	// 		getGoogleCalendarEvents();
	// 	}
	// }, [googleCalendarEvents]);

	useEffect(() => {
		if (!googleCalendarList) {
			getGoogleCalendarList();
		}
	}, [googleCalendarList]);

	useEffect(() => {
		if (calendarCategoriesList) {
			updateCategoryList();
		}
	}, [calendarCategoriesList]);

	useEffect(() => {
		if (schedulerList) {
			setInfo((prevInfo) => ({
				...prevInfo,
				schedulerList: [...schedulerList],
			}));
		}
	}, [schedulerList]);

	useEffect(() => {
		if (info?.categoryList?.length > 0 && info?.selectedCategory === null) {
			const defaultCategory = info?.categoryList?.find(
				(category) => category?.name === 'all',
			);
			setInfo((prevInfo) => ({
				...prevInfo,
				selectedCategory: defaultCategory,
				categoryFilter: [defaultCategory?._id],
			}));
		}
	}, [info?.categoryList, info?.selectedCategory]);

	useEffect(() => {
		getCurrentWeek();
		updateCalendarInfo('selectedMonth', info?.selectedDate.getMonth());
		updateCalendarInfo('selectedYear', info?.selectedDate.getFullYear());
	}, [info?.selectedDate]);

	useEffect(() => {
		if (refetchCalendarState) {
			getCalendarEventsList(info?.selectedDate);
			updateCalendarState({ refetchCalendarState: false });
		}
	}, [refetchCalendarState]);

	const updateCalendarInfo = useCallback((key, value) => {
		setInfo((prevInfo) => ({ ...prevInfo, [key]: value }));
	}, []);

	const handleBackToCalendar = useCallback(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			showEditScheduler: false,
			selectedSession: null,
		}));
	}, []);
	const updateCategoryList = useCallback(() => {
		if (calendarCategoriesList?.error) {
			message.error(calendarCategoriesList?.error);
			return;
		}
		const categories = calendarCategoriesList?.map((category) => ({
			...category,
			_id: category?._id,
			name: category?.name,
			color: category?.color,
			type: category?.type,
		}));

		setInfo((prevInfo) => ({
			...prevInfo,
			categoryList: categories,
		}));
	}, [calendarCategoriesList]);

	// Get Week Days array for <WeekDayHeader /> component
	const getCurrentWeek = useCallback(() => {
		const start = moment(info?.selectedDate).startOf('isoWeek'); // Start of the week (Monday)
		const end = moment(info?.selectedDate).endOf('isoWeek'); // End of the week (Sunday)

		// Generate all days to display in the week
		const weekDates = [];
		let currentDay = start.clone();
		while (currentDay.isBefore(end) || currentDay.isSame(end, 'day')) {
			weekDates.push(currentDay.clone().date());
			currentDay.add(1, 'day'); // Move to the next day
		}

		setInfo((prev) => ({
			...prev,
			selectedWeek: weekDates,
		}));
	}, [info?.selectedDate]);

	return (
		<>
			<div className="calendarParentContainer">
				<ChatLeftBarComponent suggestions={aiSuggestions}>
					<CalendarSidebar
						currentCalendarDate={info?.currentCalendarDate}
						selectedMonth={info?.selectedMonth}
						selectedYear={info?.selectedYear}
						selectedDate={info?.selectedDate}
						categoryList={info?.categoryList}
						selectedCategory={info?.selectedCategory}
						categoryFilter={info?.categoryFilter}
						updateCalendarInfo={updateCalendarInfo}
						selectedWorkflowId={info?.selectedWorkflowId}
						schedulerList={info?.schedulerList}
						selectedSession={info?.selectedSession}
						sessionFilter={info?.sessionFilter}
						showGoogleEvents={info?.showGoogleEvents}
					/>
				</ChatLeftBarComponent>

				{info?.showEditScheduler ? (
					<SchedulerSessionMainPage
						onBackToCalendar={handleBackToCalendar}
						schedulerList={info?.schedulerList}
						sessionId={info?.selectedSession?._id}
					/>
				) : (
					<CalendarView
						currentCalendarDate={info?.currentCalendarDate}
						selectedWeek={info?.selectedWeek}
						selectedDate={info?.selectedDate}
						selectedMonth={info?.selectedMonth}
						selectedYear={info?.selectedYear}
						isEventSelected={info?.isEventSelected}
						categoryList={info?.categoryList}
						selectedCategory={info?.selectedCategory}
						categoryFilter={info?.categoryFilter}
						getCurrentWeek={getCurrentWeek}
						updateCalendarInfo={updateCalendarInfo}
						selectedWorkflowId={info?.selectedWorkflowId}
						selectedSlot={info?.selectedSlot}
						showGoogleEvents={info?.showGoogleEvents}
					/>
				)}
			</div>
		</>
	);
};

export default memo(Calendar);

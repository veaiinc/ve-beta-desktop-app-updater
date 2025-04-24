import { memo, useState, useCallback, useEffect, useContext } from 'react';
import '../../../assets/scss/calendar/calendar.scss';
import CalendarSidebar from './CalendarSidebar';
import CalendarView from './CalendarView';
import EditScheduler from './EditScheduler';
import Context from '../../../context/context';
import ObjectId from 'bson-objectid';
import moment from 'moment';
import CreateSessionModal from '../../components/modalsV2/calendar/CreateSessionModal';
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
};

const Calendar = () => {
	const {
		calendarInfo: {
			calendarCategoriesList,
			getCalendarCategories,
			getCalendarChat,
			resetCalendarAiChat,
			getCalendarEventsList,
			updateCalendarState,
			refetchCalendarState,
			getSchedulerList,
			schedulerList,
		},
		companyInfo: { getTeamMembers },
		templates: {
			leftSidebarState,
			updateStateValues,
			getConnectedThirdParties,
			googleCalendarWatch,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		currentCalendarDate: new Date(),
		selectedMonth: new Date().getMonth(),
		selectedYear: new Date().getFullYear(),
		selectedDate: new Date(),
		...initialState,
	});

	// Close left sidebar when component unmounts
	useEffect(() => {
		updateStateValues({ leftSidebarState: 'close' });
		return () => {
			updateStateValues({ leftSidebarState: null });
		};
	}, []);

	useEffect(() => {
		const sessionId = ObjectId().toString();
		setInfo((prevInfo) => ({ ...prevInfo, chatSessionId: sessionId }));

		getCalendarCategories();
		getSchedulerList();

		return () => {
			setInfo((prevInfo) => ({
				...prevInfo,
				...initialState,
			}));
			resetCalendarAiChat();
		};
	}, []);

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

	const handleBackToCalendar = useCallback(
		(updatedSession) => {
			if (updatedSession) {
				// Update the scheduler list with the updated session
				setInfo((prevInfo) => ({
					...prevInfo,
					schedulerList: prevInfo.schedulerList.map((session) =>
						session._id === updatedSession._id ? updatedSession : session,
					),
					selectedSession: updatedSession,
					showEditScheduler: false,
					isEventSelected: false,
					selectedSlot: null,
				}));

				// Force a re-render of the SessionCard by updating the sessionFilter
				setInfo((prevInfo) => ({
					...prevInfo,
					sessionFilter: [...prevInfo.sessionFilter],
				}));

				// Update the calendar state to trigger a refresh
				updateCalendarState({ refetchCalendarState: true });

				// Fetch the latest scheduler list
				getSchedulerList();

				// Force a re-render of the calendar
				setInfo((prevInfo) => ({
					...prevInfo,
					currentCalendarDate: new Date(),
				}));
			} else {
				setInfo((prevInfo) => ({
					...prevInfo,
					showEditScheduler: false,
					selectedSession: null,
					isEventSelected: false,
					selectedSlot: null,
				}));
			}
		},
		[updateCalendarState, getSchedulerList],
	);

	// Add effect to handle scheduler list updates
	useEffect(() => {
		if (schedulerList && schedulerList.length > 0) {
			setInfo((prevInfo) => {
				const updatedInfo = {
					...prevInfo,
					schedulerList: [...schedulerList],
				};

				// If there's a selected session, make sure it's in the updated list
				if (prevInfo.selectedSession) {
					const updatedSession = schedulerList.find(
						(session) => session._id === prevInfo.selectedSession._id,
					);
					if (updatedSession) {
						updatedInfo.selectedSession = updatedSession;
					}
				}

				return updatedInfo;
			});
		}
	}, [schedulerList]);

	const updateCategoryList = useCallback(() => {
		if (calendarCategoriesList) {
			setInfo((prevInfo) => ({
				...prevInfo,
				categoryList: [...calendarCategoriesList],
			}));
		}
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
				/>
				{info?.showEditScheduler ? (
					<EditScheduler
						onBack={handleBackToCalendar}
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
					/>
				)}
			</div>
		</>
	);
};

export default memo(Calendar);

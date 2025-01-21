import React, { memo, useState, useCallback, useEffect, useContext } from 'react';
import '../../../assets/scss/calendar/calendar.scss';
import CalendarSidebar from './CalendarSidebar';
import CalendarView from './CalendarView';
import Context from '../../../context/context';
import BottomToolbar from '../../components/ai_agents/BottomToolbar';
import { ReactComponent as AiSparkel } from '../../../assets/svg/calendar/aiSparkel.svg';
import WorkflowSlugSelector from '../../components/calendar/WorkflowSlugSelector';
import ObjectId from 'bson-objectid';
import moment from 'moment';

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
};

const Calendar = () => {
	const {
		calendarInfo: {
			calendarCategories,
			createCalendarCategory,
			getCalendarChat,
			resetCalendarAiChat,
			getCalendarEventsList,
		},
		companyInfo: { getTeamMembers },
		templates: { getWorkflowsList, workflowslist, moreWorkList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		currentCalendarDate: new Date(),
		selectedMonth: new Date().getMonth(),
		selectedYear: new Date().getFullYear(),
		selectedDate: new Date(),
		...initialState,
	});

	useEffect(() => {
		const sessionId = ObjectId().toString();
		setInfo((prevInfo) => ({ ...prevInfo, chatSessionId: sessionId }));

		const calendarCategoryPayload = {
			calendarCategory: 'default',
			categoryColor: '#b977ff',
			categoryType: 'default',
		};
		createCalendarCategory(calendarCategoryPayload);
		getTeamMembers();

		return () => {
			setInfo((prevInfo) => ({
				...prevInfo,
				...initialState,
			}));
			resetCalendarAiChat();
		};
	}, []);

	useEffect(() => {
		if (calendarCategories) {
			updateCategoryList();
		}
	}, [calendarCategories]);

	useEffect(() => {
		if (info?.categoryList?.length > 0 && info?.selectedCategory === null) {
			const defaultCategory = info?.categoryList?.find(
				(category) => category?.name === 'default',
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

	const updateCalendarInfo = useCallback((key, value) => {
		setInfo((prevInfo) => ({ ...prevInfo, [key]: value }));
	}, []);

	const updateCategoryList = useCallback(() => {
		if (calendarCategories) {
			setInfo((prevInfo) => ({
				...prevInfo,
				categoryList: [...calendarCategories],
			}));
		}
	}, [calendarCategories]);

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

	useEffect(() => {
		if (info?.workflowSlug) {
			handleSendMessage(info?.chatQuery, true);
		}
	}, [info?.workflowSlug]);

	const handleSendMessage = useCallback(
		async (data, sendingSlug = false) => {
			let obj = {
				type: 'user',
				message: data,
			};
			let loadingObj = {
				type: 'AI',
				message: 'loading....',
				content: (
					<div className="aiMessageWrapper">
						<AiSparkel />
						<div className="aiMessage">
							<span>Thinking...</span>
						</div>
					</div>
				),
			};
			let chatlist = [...(info?.chatList || [])];
			if (!sendingSlug) {
				chatlist = [...chatlist, obj, loadingObj];
			} else {
				chatlist = [...chatlist, loadingObj];
			}

			setInfo((prev) => ({
				...prev,
				chatList: chatlist,
				aiChatLoading: true,
				chatQuery: data,
			}));

			const chatPayload = {
				query: data,
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				module: 'calendar',
				workflow_slug: info?.workflowSlug || null,
			};

			const response = await getCalendarChat(info?.chatSessionId, chatPayload);
			chatlist.pop();
			if (response?.[0]) {
				if (response?.[1]?.answer?.length) {
					let obj = {
						type: 'AI',
						message: response?.[1]?.answer || '',
					};
					chatlist = [...chatlist, obj];
				}

				if (response?.[1]?.db_updates?.calendar_db_update) {
					//refetch the calendar eventList data
					getCalendarEventsList(info?.selectedDate);
				}

				if (response?.[1]?.variables_required?.includes('workflow_slug')) {
					//show the workflow slug selector
					let workflowSlug = {
						type: 'AI',
						message: 'Please select a workflow to continue',
						content: (
							<WorkflowSlugSelector
								updateCalendarInfo={updateCalendarInfo}
								workflowSlug={info?.workflowSlug || null}
							/>
						),
					};
					chatlist = [...chatlist, workflowSlug];
				}
			}
			setInfo((prev) => ({ ...prev, chatList: chatlist, aiChatLoading: false }));
		},
		[info?.chatList, info?.chatSessionId, info?.workflowSlug, info?.selectedDate],
	);

	return (
		<>
			<div className="calendarParentContainer">
				<CalendarSidebar
					currentCalendarDate={info?.currentCalendarDate}
					selectedMonth={info?.selectedMonth}
					selectedYear={info?.selectedYear}
					selectedDate={info?.selectedDate}
					isCreateEventOpen={info?.isCreateEventOpen}
					categoryList={info?.categoryList}
					selectedCategory={info?.selectedCategory}
					categoryFilter={info?.categoryFilter}
					updateCalendarInfo={updateCalendarInfo}
					selectedWorkflowId={info?.selectedWorkflowId}
					selectedSlot={info?.selectedSlot}
				/>
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

				<BottomToolbar
					outerContainerStyle={{ bottom: '5px' }}
					chatList={info?.chatList}
					onSend={handleSendMessage}
					aiChatLoading={info?.aiChatLoading}
					customChatActions={true}
				/>
			</div>
		</>
	);
};

export default memo(Calendar);

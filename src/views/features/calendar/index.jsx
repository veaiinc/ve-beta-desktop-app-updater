import React, { memo, useState, useCallback, useEffect, useContext } from 'react';
import '../../../assets/scss/calendar/calendar.scss';
import CalendarSidebar from './CalendarSidebar';
import CalendarView from './CalendarView';
import Context from '../../../context/context';

import moment from 'moment';

const Calendar = () => {
	const {
		calendarInfo: { calendarCategories, createCalendarCategory },
	} = useContext(Context);

	const [info, setInfo] = useState({
		currentCalendarDate: new Date(),
		selectedMonth: new Date().getMonth(),
		selectedYear: new Date().getFullYear(),
		selectedDate: new Date(),
		selectedWeek: [],
		isCreateEventOpen: false,
		isEventSelected: false,
		categoryList: [],
		selectedCategory: null,
		categoryFilter: [],
	});
	console.log('calendarCategories', calendarCategories);
	useEffect(() => {
		const payload = {
			calendarCategory: 'default',
			categoryColor: '#bf8bff',
		};
		createCalendarCategory(payload);
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
				/>
				<CalendarView
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
				/>
			</div>
		</>
	);
};

export default memo(Calendar);

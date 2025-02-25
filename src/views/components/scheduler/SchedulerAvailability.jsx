import React, { useCallback, useState, useMemo } from 'react';
import moment from 'moment';
import '../../../assets/scss/scheduler/schedulerAvailability.scss';
import { ReactComponent as Right } from '../../../assets/svg/activity/right.svg';
import { ReactComponent as Left } from '../../../assets/svg/activity/left.svg';

const WeeklySlot = ({ day, date, slots, handleUpdateSessionSlot }) => {
	return (
		<div className="daySlotContainer">
			<div className="dayHeader">
				<div className="dayName">
					{day} {date}
				</div>
			</div>
			<div className="slotsWrapper">
				{slots?.map((slot, index) => (
					<div key={index} className="slotItem">
						<div
							className="slotOverlay"
							onClick={(event) => {
								event.stopPropagation();
								handleUpdateSessionSlot();
							}}
						>
							Edit Session
						</div>
						<div
							className="slotIndicator"
							style={{ background: slot?.sessionColor || '#6366F1' }}
						/>
						<div className="slotContent">
							<div className="slotName">{slot.sessionName || 'Session'}</div>
							<div className="slotTime">
								{slot.startTime} - {slot.endTime}
							</div>
						</div>
					</div>
				))}
				<div className="emptySlotItem newSlot">
					<div className="emptySlotContent">
						<div className="plusIcon">+</div>
						<div className="newSessionText">New Session</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const SchedulerAvailability = ({ isUpdateSessionSlot, handleUpdateSessionSlot }) => {
	const [info, setInfo] = useState({
		currentDate: moment(),
	});

	// Sample session data - In real app, this would come from props or API
	const sessionData = {
		Yoga: {
			sessionName: 'Yoga',
			startTime: '9:00 AM',
			endTime: '9:45 AM',
			sessionColor: '#4CAF50',
			days: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'],
		},
		Cardio: {
			sessionName: 'Cardio',
			startTime: '10:00 AM',
			endTime: '12:00 AM',
			sessionColor: '#F44336',
			days: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
		},
		Dance: {
			sessionName: 'Dance Class',
			startTime: '4:30 PM',
			endTime: '6:00 PM',
			sessionColor: '#2196F3',
			days: ['Wednesday'],
		},
	};

	const getWeekDuration = useMemo(() => {
		const startOfWeek = moment(info?.currentDate).startOf('isoWeek');
		const endOfWeek = moment(info?.currentDate).endOf('isoWeek');
		const currentWeekStart = moment().startOf('isoWeek');

		return {
			startOfWeek,
			endOfWeek,
			displayRange: `${startOfWeek.format('MMM D')} - ${endOfWeek.format('MMM D, YYYY')}`,
			isCurrentWeek: startOfWeek.isSame(currentWeekStart, 'day'),
		};
	}, [info?.currentDate]);

	const weeklySlots = useMemo(() => {
		const { startOfWeek } = getWeekDuration;
		const weekDays = [];

		for (let i = 0; i < 7; i++) {
			const currentDay = moment(startOfWeek).add(i, 'days');
			const dayName = currentDay.format('dddd');
			const slots = [];

			// Add sessions for this day
			Object.values(sessionData).forEach((session) => {
				if (session.days.includes(dayName)) {
					slots.push({
						sessionName: session.sessionName,
						startTime: session.startTime,
						endTime: session.endTime,
						sessionColor: session.sessionColor,
					});
				}
			});

			weekDays.push({
				day: currentDay.format('ddd'),
				date: currentDay.format('M/D'),
				slots,
			});
		}

		return weekDays;
	}, [getWeekDuration]);

	const handlePreviousWeek = useCallback(() => {
		const newDate = moment(info.currentDate).subtract(1, 'week');
		const currentWeekStart = moment().startOf('isoWeek');

		// Only allow navigation if the new date is not before the current week
		if (!newDate.startOf('isoWeek').isBefore(currentWeekStart, 'day')) {
			setInfo((prev) => ({
				...prev,
				currentDate: newDate,
			}));
		}
	}, [info.currentDate]);

	const handleNextWeek = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			currentDate: moment(prev.currentDate).add(1, 'week'),
		}));
	}, []);

	return (
		<div className="ScheduledAvailabilityContainer">
			<div className="headerContainer">
				<div className="headerLeftContainer">
					<div className="headerTitle">Time Slots</div>
					<div className="headerSubTitle">
						Effortlessly manage your time with AI scheduling.
					</div>
				</div>
				<div className="headerRightContainer">
					<div>{getWeekDuration.displayRange}</div>
					<Left
						onClick={handlePreviousWeek}
						style={{
							cursor: getWeekDuration.isCurrentWeek ? 'not-allowed' : 'pointer',
							opacity: getWeekDuration.isCurrentWeek ? 0.3 : '',
						}}
					/>
					<Right onClick={handleNextWeek} />
				</div>
			</div>
			<div className="weeklySlotsContainer">
				{weeklySlots.map((dayData, index) => (
					<WeeklySlot
						key={index}
						{...dayData}
						handleUpdateSessionSlot={handleUpdateSessionSlot}
					/>
				))}
			</div>
		</div>
	);
};

export default SchedulerAvailability;

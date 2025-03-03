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
							<div className="slotName">{slot.sessionName}</div>
							<div className="slotTime">
								{slot.startTime} - {slot.endTime}
							</div>
						</div>
					</div>
				))}
				<div className="emptySlotItem newSlot">
					<div className="emptySlotContent">
						<div className="plusIcon">+</div>
						<div className="newSessionText">New Slot</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const SchedulerAvailability = ({ updateSessionSlot, handleUpdateSessionSlot, schedulerList }) => {
	const [info, setInfo] = useState({
		currentDate: moment(),
	});

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
			const currentDate = currentDay.format('YYYY-MM-DD');
			const slots = [];

			// Process each session in schedulerList
			schedulerList?.forEach((session) => {
				// Check if the current date falls within the session window
				const sessionStart = moment(session.sessionWindow.startDate);
				const sessionEnd = moment(session.sessionWindow.endDate);

				if (currentDay.isBetween(sessionStart, sessionEnd, 'day', '[]')) {
					// Check for custom exceptions first
					const customException = session.customExceptions?.find(
						(exception) => moment(exception.date).format('YYYY-MM-DD') === currentDate,
					);

					if (customException) {
						// If overrideAvailability is true, use custom time ranges
						if (
							customException.overrideAvailability &&
							customException.customTimeRanges
						) {
							customException.customTimeRanges?.forEach((range) => {
								slots?.push({
									sessionName: session.sessionName,
									startTime: range.startTime,
									endTime: range.endTime,
									sessionColor: session.sessionColor,
								});
							});
						}
						// If overrideAvailability is false, skip this day
					} else {
						// Check regular availability slots
						const dayAvailability = session.availabilitySlots?.find(
							(slot) => slot.dayOfWeek === dayName,
						);

						if (dayAvailability) {
							dayAvailability.timeRanges.forEach((range) => {
								slots.push({
									sessionName: session.sessionName,
									startTime: range.startTime,
									endTime: range.endTime,
									sessionColor: session.sessionColor,
								});
							});
						}
					}
				}
			});

			weekDays?.push({
				day: currentDay.format('ddd'),
				date: currentDay.format('D/M'),
				slots: slots.sort((a, b) =>
					moment(a.startTime, 'HH:mm').diff(moment(b.startTime, 'HH:mm')),
				),
			});
		}

		return weekDays;
	}, [getWeekDuration, schedulerList]);

	const handlePreviousWeek = useCallback(() => {
		const newDate = moment(info.currentDate).subtract(1, 'week');
		const currentWeekStart = moment().startOf('isoWeek');

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
				{weeklySlots?.map((dayData, index) => (
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

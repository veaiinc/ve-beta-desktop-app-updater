import { memo, useState, useEffect, useCallback, useContext } from 'react';
import moment from 'moment';
import s from '../../../../../assets/scss/globalComponents/widgets/calendar/addCalendarWidget.module.scss';
import Calendar from './Calendar';
import { message } from '../../CustomToast';
import Context from '../../../../../context/context';
import Spinner from '../../../loaders/Spinner';

const AddCalendarWidget = ({ widgetData = null }) => {
	const {
		calendarInfo: { createCalendarEvent, getCalendarCategories, calendarCategoriesList },
	} = useContext(Context);
	const [info, setInfo] = useState({
		startTime: null, // stored in epoch
		endTime: null, // stored in epoch
		title: '',
		selectedDate: null,
		addingCalendarEvent: false,
	});

	const startTimeDisplay = info?.startTime ? moment?.unix(info.startTime)?.format('HH:mm') : '';
	const endTimeDisplay = info?.endTime ? moment?.unix(info.endTime)?.format('HH:mm') : '';

	const startPeriod = info?.startTime
		? moment?.unix(info?.startTime)?.format('A') // AM / PM
		: '';
	const endPeriod = info?.endTime ? moment?.unix(info?.endTime)?.format('A') : '';

	const selectedDateDisplay = info?.selectedDate
		? info?.selectedDate?.format('dddd, MMM DD, YYYY')
		: '';

	const selectedTimeRange =
		info?.startTime && info?.endTime
			? `${moment?.unix(info?.startTime)?.format('hh:mm A')} - ${moment
					?.unix(info?.endTime)
					?.format('hh:mm A')}`
			: '';

	useEffect(() => {
		if (widgetData) {
			const { start_time, end_time, title } = widgetData;
			const currentTime = Math.floor(Date.now() / 1000);
			setInfo((prev) => ({
				...prev,
				startTime: start_time || currentTime,
				endTime: end_time || currentTime,
				selectedDate: moment?.unix(start_time || currentTime),
				title: title || '',
			}));
		}
	}, [widgetData]);

	useEffect(() => {
		if (!calendarCategoriesList) {
			getCalendarCategories();
		}
	}, []);

	const handleTimeChange = (e, type) => {
		const newValue = e.target.value; // "HH:mm"
		const [hours, minutes] = newValue.split(':').map(Number);

		setInfo((prev) => {
			const baseDate = prev?.selectedDate || moment(); // fallback today
			const updatedEpoch = baseDate
				.clone()
				.set({ hour: hours, minute: minutes, second: 0 })
				.unix();

			return { ...prev, [type]: updatedEpoch };
		});
	};

	const handleDateChange = (date) => {
		setInfo((prev) => ({ ...prev, selectedDate: date }));
	};

	const handleAddToCalendar = useCallback(async () => {
		if (info?.addingCalendarEvent) return;

		const { title, startTime, endTime, selectedDate } = info;
		const now = moment()?.startOf('day');

		const startDateTime = moment
			?.unix(startTime)
			?.set({
				year: selectedDate?.year(),
				month: selectedDate?.month(),
				date: selectedDate?.date(),
			})
			?.format();

		const endDateTime = moment
			?.unix(endTime || startTime)
			?.set({
				year: selectedDate?.year(),
				month: selectedDate?.month(),
				date: selectedDate?.date(),
			})
			?.format();

		const validations = [
			{
				condition: !title,
				message: 'Event Name is required',
			},
			{
				condition: !calendarCategoriesList,
				message: 'Category is required',
			},
			{
				condition: !startTime,
				message: 'Start time is required',
			},
			{
				condition: startTime && endTime && endTime < startTime,
				message: 'End time cannot be before start time',
			},
			{
				condition: moment(startDateTime)?.isBefore(now),
				message: 'Start date/time cannot be in the past',
			},
		];

		for (const { condition, message: msg } of validations) {
			if (condition) return message.error(msg);
		}

		const payload = {
			title,
			startDateTime,
			endDateTime,
			calendarCategory: calendarCategoriesList?.[0],
		};

		setInfo((prev) => ({ ...prev, addingCalendarEvent: true }));

		const response = await createCalendarEvent(payload);

		if (response?.[0] === true) {
			message.success('Event added to calendar');
		} else {
			message.error('Failed to add event to calendar');
		}

		setInfo((prev) => ({ ...prev, addingCalendarEvent: false }));
	}, [widgetData, info, calendarCategoriesList]);

	return (
		<div className={s.addCalendarWidgetContainer}>
			<div className={s.calendarTitle}>
				<div className={s.titleHeader}>Event Name</div>
				<input
					type="text"
					className={s.titleInput}
					value={info?.title}
					onChange={(e) => setInfo((prev) => ({ ...prev, title: e.target.value }))}
				/>
			</div>

			<div className={s.addCalendarWidgetWrapper}>
				<Calendar startDate={info?.startTime} onDateSelect={handleDateChange} />

				<div className={s.calendarInfo}>
					<div className={s.calendarDate}>
						<div className={s.selectedDate}>{selectedDateDisplay}</div>
						<div className={s.selectedTime}>{selectedTimeRange}</div>
					</div>

					{/* Start Time */}
					<div className={s.time}>
						<div className={s.timeLabel}>Start Time</div>
						<div className={s.timeInput}>
							<input
								type="time"
								className={s.timeInputElement}
								value={startTimeDisplay}
								onChange={(e) => handleTimeChange(e, 'startTime')}
							/>
							<div className={`${s.am} ${startPeriod === 'AM' ? s.active : ''}`}>
								AM
							</div>
							<div className={`${s.pm} ${startPeriod === 'PM' ? s.active : ''}`}>
								PM
							</div>
						</div>
					</div>

					{/* End Time */}
					<div className={s.time}>
						<div className={s.timeLabel}>End Time</div>
						<div className={s.timeInput}>
							<input
								type="time"
								className={s.timeInputElement}
								value={endTimeDisplay}
								onChange={(e) => handleTimeChange(e, 'endTime')}
							/>
							<div className={`${s.am} ${endPeriod === 'AM' ? s.active : ''}`}>
								AM
							</div>
							<div className={`${s.pm} ${endPeriod === 'PM' ? s.active : ''}`}>
								PM
							</div>
						</div>
					</div>
					<div className={s.buttonsContainer}>
						<button className={s.button} onClick={handleAddToCalendar}>
							Add To Calendar
							{info?.addingCalendarEvent && <Spinner width={16} height={16} />}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(AddCalendarWidget);

import React, { memo, useCallback, useState, useContext, useEffect } from 'react';
import '../../../assets/scss/calendar/createEvent.scss';
import { ReactComponent as CloseSvg } from '../../../assets/svg/calendar/close.svg';
import { ReactComponent as DownSvg } from '../../../assets/svg/calendar/down.svg';
import { ReactComponent as Clock } from '../../../assets/svg/activity/duration.svg';
import { ReactComponent as Category } from '../../../assets/svg/calendar/category.svg';
import { ReactComponent as Location } from '../../../assets/svg/calendar/locationPin.svg';
import { ReactComponent as Meeting } from '../../../assets/svg/calendar/meeting.svg';
import { ReactComponent as Avtar } from '../../../assets/svg/calendar/calendarEllipse.svg';
import { ReactComponent as Close } from '../../../assets/svg/activity/close.svg';
import UpdateCategoryModal from '../modalsV2/calendar/UpdateCategoryModal';
import Spinner from '../../components/loaders/Spinner.jsx';
import ToggleSwitch from '../../components/input/slider';
import Context from '../../../context/context';
import moment from 'moment/moment';

const initialState = {
	title: '',
	description: null,
	location: null,
	startDateTime: '',
	endDateTime: '',
	timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	allDay: false,
	attendees: [],
	meeting: null,
	phone: null,

	// Validation and submission states
	isSubmitting: false,
	submissionError: null,
};

const formatTimeAndDateForInput = (timeObj) => {
	if (!timeObj) return { date: '', time: '' };
	if (typeof timeObj === 'string') return { date: timeObj, time: '' };
	const date = moment(timeObj).format('YYYY-MM-DD');
	const time = moment(timeObj).format('HH:mm');
	return { date, time };
};

const CreateEvent = ({ categoryList, selectedCategory, updateCalendarInfo, selectedSlot }) => {
	const {
		calendarInfo: { calendarEvent, createCalendarEvent },
		profileInfo: { userDetailsData },
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
		companyInfo: { tenantsUserList },
	} = useContext(Context);

	// Add styles for date and time input icons
	const inputStyles = `
		<style>
			/* Change calendar icon color */
			input[type="date"]::-webkit-calendar-picker-indicator {
				filter: invert(1);
				cursor: pointer;
			}

			/* Change time icon color */
			input[type="time"]::-webkit-calendar-picker-indicator {
				filter: invert(1);
				cursor: pointer;
			}
		</style>
	`;

	const [info, setInfo] = useState({
		...initialState,

		// UI state
		showCategory: false,
		showAtendeeSuggestions: false,
		categories: ['Shoots', 'Sessions', 'Meetings'],
		selectedCategory: selectedCategory || null,
		attendeesInputField: '',
		startDate: '',
		startTime: '',
		endDate: '',
		endTime: '',
		addCategory: false,
	});

	useEffect(() => {
		if (selectedSlot) {
			const { date, time } = formatTimeAndDateForInput(selectedSlot);
			setInfo((prev) => ({
				...prev,
				startDate: date,
				startTime: time,
				endDate: date,
				endTime: time,
			}));
		}
	}, [selectedSlot]);

	const convertToISOString = useCallback((date, time) => {
		if (!date) return null;

		const combinedDateTime = time
			? moment(`${date}T${time}`, 'YYYY-MM-DDTHH:mm')
			: moment(date);

		return combinedDateTime.format('YYYY-MM-DDTHH:mm:ssZ');
	}, []);

	const updateEventInfo = useCallback((key, value) => {
		setInfo((previnfo) => ({ ...previnfo, [key]: value }));
	}, []);

	// Prepare event payload for submission
	const prepareEventPayload = useCallback(() => {
		const {
			title,
			description,
			startDate,
			startTime,
			endDate,
			endTime,
			allDay,
			timezone,
			location,
			meeting,
			attendees,
			phone,
		} = info;
		// Validate required fields
		if (!title) {
			setInfo((prev) => ({
				...prev,
				submissionError: 'Agenda is required',
				isSubmitting: false,
			}));
			return null;
		}

		if (!startDate) {
			setInfo((prev) => ({
				...prev,
				submissionError: 'Start date is required',
				isSubmitting: false,
			}));
			return null;
		}

		if (!endDate) {
			setInfo((prev) => ({
				...prev,
				submissionError: 'End date is required',
				isSubmitting: false,
			}));
			return null;
		}

		// Convert dates to moment objects for comparison
		const startDateTime = moment(convertToISOString(startDate, startTime));
		const endDateTime = moment(convertToISOString(endDate, endTime || startTime));
		const now = moment().startOf('day');

		// Check if dates are in the past
		if (startDateTime.isBefore(now)) {
			setInfo((prev) => ({
				...prev,
				submissionError: 'Start date/time cannot be in the past',
				isSubmitting: false,
			}));
			return null;
		}

		// Check if end date is before start date
		if (endDateTime.isBefore(startDateTime)) {
			setInfo((prev) => ({
				...prev,
				submissionError: 'End date/time cannot be before start date/time',
				isSubmitting: false,
			}));
			return null;
		}

		// Validate attendees
		if (!attendees || attendees?.length === 0) {
			setInfo((prev) => ({
				...prev,
				submissionError: 'At least one attendee is required',
				isSubmitting: false,
			}));
			return null;
		}

		// formate attendees
		const processedAttendees = attendees?.map((attendee) => ({
			isWorkspaceUser: attendee?.tenantUserId ? true : false,
			tenantUserId: attendee?.tenantUserId || null,
			name: attendee?.name || null,
			email: attendee?.email,
			role: attendee?.role,
			responseStatus: 'confirmed',
		}));

		const eventPayload = {
			title,
			description: description || '',
			location,
			startDateTime: convertToISOString(startDate, startTime),
			endDateTime: convertToISOString(endDate || startDate, endTime || startTime),
			timezone,
			allDay,
			attendees: processedAttendees,
			calendarCategory: info?.selectedCategory,
			meeting,
			phone,
		};
		return eventPayload;
	}, [info, convertToISOString]);

	// Handle event creation submission
	const handleEventSubmission = useCallback(async () => {
		try {
			if (
				validateExpiryData &&
				validateExpiryData?.restrictCalendar &&
				validateExpiryData?.isExpired
			) {
				return updateSubscriptionState({ expiredSubscriptionModal: true });
			}
			setInfo((prev) => ({
				...prev,
				isSubmitting: true,
				submissionError: null,
			}));
			const eventPayload = prepareEventPayload();
			if (!eventPayload) return;

			await createCalendarEvent(eventPayload);
			updateCalendarInfo('isCreateEventOpen', false);
		} catch (error) {
			setInfo((prev) => ({
				...prev,
				isSubmitting: false,
				submissionError: error.message || 'Failed to create event',
			}));
		}
	}, [prepareEventPayload, createCalendarEvent, updateCalendarInfo]);

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const addAttendees = useCallback(
		({
			name = null,
			email = null,
			isWorkspaceUser = false,
			tenantUserId = null,
			role = null,
		}) => {
			// Validate email
			if (!emailRegex.test(email)) {
				setInfo((prevInfo) => ({
					...prevInfo,
					submissionError: 'Invalid email address',
				}));
				return;
			}

			// Check for duplicate
			setInfo((prevInfo) => {
				const isDuplicate = prevInfo?.attendees?.some(
					(attendee) => attendee?.email === email,
				);

				if (isDuplicate) {
					return {
						...prevInfo,
						submissionError: 'Attendee already added',
					};
				}

				const updatedAttendees = [
					...prevInfo.attendees,
					{ name, email, isWorkspaceUser, tenantUserId, role },
				];

				return {
					...prevInfo,
					attendeesInputField: '',
					attendees: updatedAttendees,
					submissionError: null,
				};
			});
		},
		[],
	);

	const removeAttendee = useCallback(
		(id) => {
			const updatedAttendees = info?.attendees?.filter(
				(attendee) => attendee?.tenantUserId !== id && attendee?.email !== id,
			);

			setInfo((prevInfo) => ({
				...prevInfo,
				submissionError: null,
				attendees: updatedAttendees,
			}));
		},
		[info?.attendees],
	);

	return (
		<div className="createEventContainer">
			<div
				style={{
					position: 'absolute',
					width: '100vw',
					height: '100vh',
					backgroundColor: 'transparent',
					left: 0,
					top: 0,
					zIndex: 1000,
				}}
				onClick={() => updateCalendarInfo('isCreateEventOpen', false)}
			></div>
			<div style={{ zIndex: 1001 }} className="createEventContainer">
				<div dangerouslySetInnerHTML={{ __html: inputStyles }} />
				<div className="headerWrapper">
					<span className="headerLabel">Create an event</span>
					<CloseSvg
						onClick={() => {
							if (info?.isSubmitting) return;
							updateCalendarInfo('isCreateEventOpen', false);
							setInfo(initialState);
						}}
						style={{ cursor: 'pointer' }}
					/>
				</div>
				{info?.submissionError && (
					<div
						style={{
							color: 'red',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						{info?.submissionError}
					</div>
				)}
				<div className="eventDetailsContainer">
					<div className="agendaContainer">
						<span className="agendaLabel">Agenda</span>
						<input
							type="text"
							name="title"
							id="title"
							placeholder="E.g. Meeting"
							value={info?.title}
							onChange={(e) => updateEventInfo('title', e.target.value)}
						/>
						<span className="agendaLabel">Description</span>
						<input
							type="text"
							name="description"
							id="description"
							placeholder="Description of the event"
							value={info?.description}
							onChange={(e) => updateEventInfo('description', e.target.value)}
						/>
					</div>

					<div className="detailsContainer">
						<div className="detailsWrapper">
							<Clock />
							<span className="detailsLabel">Details</span>
						</div>
						<div className={`${info?.allDay ? `` : `eventTimeWrapper`}`}>
							<input
								type="date"
								placeholder="Wed, September 22 2024"
								className="dateInput"
								value={info?.startDate}
								onChange={(e) => {
									updateEventInfo('startDate', e.target.value);
									updateEventInfo('submissionError', null);
								}}
							/>
							{info?.allDay ? (
								''
							) : (
								<input
									type="time"
									placeholder="12:00PM"
									className="timeInput"
									value={info?.startTime}
									onChange={(e) => {
										updateEventInfo('startTime', e.target.value);
										updateEventInfo('submissionError', null);
									}}
								/>
							)}
						</div>
						<div className={`${info?.allDay ? `` : `eventTimeWrapper`}`}>
							<input
								type="date"
								placeholder="Wed, September 22 2024"
								className="dateInput"
								value={info?.endDate}
								onChange={(e) => {
									updateEventInfo('endDate', e.target.value);
									updateEventInfo('submissionError', null);
								}}
							/>
							{info?.allDay ? (
								''
							) : (
								<input
									type="time"
									placeholder="12:30AM"
									className="timeInput"
									value={info?.endTime}
									onChange={(e) => {
										updateEventInfo('endTime', e.target.value);
										updateEventInfo('submissionError', null);
									}}
								/>
							)}
						</div>
						<div className="allDayWrapper">
							<span className="allDayLabel">All Day Event</span>
							<ToggleSwitch
								onChange={() => updateEventInfo('allDay', !info?.allDay)}
							/>
						</div>
					</div>

					<div className="categoriesContainer">
						<div className="categoriesWrapper">
							<Category />
							<div className="categoriesLabel">Categories</div>
						</div>
						<div className="categoriesSelector">
							<input
								type="text"
								placeholder="Add to a category"
								onBlur={() => updateEventInfo('showCategory', false)}
								onFocus={() => {
									updateEventInfo('showCategory', true);
								}}
								value={info?.selectedCategory?.name}
								style={{ textTransform: 'capitalize' }}
							/>
							<div
								className="downArrow"
								onClick={() => updateEventInfo('showCategory', !info?.showCategory)}
							>
								<DownSvg
									style={{
										transform: info?.showCategory
											? `rotate(180deg)`
											: `rotate(0)`,
									}}
								/>
							</div>
							{info?.showCategory && (
								<div className="categoryDropDown">
									{categoryList?.map((item) => (
										<div
											className="categoryDropDownItem"
											onMouseDown={() => {
												updateEventInfo('selectedCategory', item);
												updateEventInfo('showCategory', false);
											}}
										>
											{item?.name}
										</div>
									))}
									<div
										className="categoryDropDownItem addCategory"
										onClick={() =>
											setInfo((prev) => ({ ...prev, addCategory: true }))
										}
									>
										+ Add new
									</div>
								</div>
							)}
						</div>
						<div className="additionalOptions">
							<input
								type="text"
								placeholder="Add location"
								value={info?.location}
								onChange={(e) => updateEventInfo('location', e.target.value)}
							/>
							<Location />
						</div>
						<div className="additionalOptions">
							<Meeting />
							<input
								type="text"
								placeholder="Add meeting link"
								value={info?.meeting}
								onChange={(e) => updateEventInfo('meeting', e.target.value)}
							/>
						</div>
					</div>

					<div className="attendeesContainer">
						<div className="attendeesHeader">
							<span className="attendiesLabel">Attendees</span>
							<span className="attendeesCount">{info?.attendees?.length + 1}</span>
						</div>
						<div className="attendeeInputWrapper">
							<input
								type="text"
								placeholder="Add attendee or email"
								onBlur={() => updateEventInfo('showAtendeeSuggestions', false)}
								onFocus={() => {
									updateEventInfo('showAtendeeSuggestions', true);
									updateEventInfo('submissionError', null);
								}}
								value={info?.attendeesInputField}
								onChange={(e) =>
									updateEventInfo('attendeesInputField', e.target.value)
								}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && info?.attendeesInputField) {
										addAttendees({ email: info?.attendeesInputField });
										updateEventInfo('showAtendeeSuggestions', false);
									}
								}}
							/>
							{info?.showAtendeeSuggestions ? (
								<div className="addAttendeeDropDown">
									{tenantsUserList
										?.filter((item) => !item?.isOwner)
										?.map((item) => (
											<div
												className="dropDownList"
												key={item?._id}
												onMouseDown={() => {
													addAttendees({
														name: item?.firstName,
														email: item?.email,
														tenantUserId: item?._id,
														isWorkspaceUser: true,
														role: item?.role,
													});
												}}
											>
												<div className="avatar">
													<Avtar />
												</div>
												<div className="details">
													<div className="name">{`${item?.firstName}`}</div>
													<div className="email">{item?.email}</div>
												</div>
											</div>
										))}
								</div>
							) : (
								''
							)}
						</div>
						<div className="attendeesList">
							<div className="attendeesDetails">
								<div className="avatar">
									<Avtar />
								</div>
								<div className="nameWrapper">
									<span className="name">
										{userDetailsData?.firstName} {userDetailsData?.lastName}
									</span>
									<span className="role">Organizer</span>
								</div>
							</div>
							{info?.attendees
								? info?.attendees?.map((item, index) => (
										<div className="attendeesDetails" key={index}>
											<div className="avatar">
												<Avtar />
											</div>
											<div className="nameWrapper">
												<span className="name">{item?.name}</span>
												<span className="role">{item?.email}</span>
											</div>
											<Close
												onClick={() =>
													removeAttendee(
														item?.tenantUserId || item?.email,
													)
												}
												style={{ cursor: 'pointer' }}
											/>
										</div>
								  ))
								: ''}
						</div>
					</div>
				</div>
				<button
					className="addToCalendar"
					onClick={handleEventSubmission}
					disabled={info?.isSubmitting}
				>
					{info?.isSubmitting ? (
						<Spinner width={'20px'} height={'20px'} />
					) : (
						'Add to calendar'
					)}
				</button>
				<UpdateCategoryModal
					show={info?.addCategory}
					handleClose={() => setInfo((prev) => ({ ...prev, addCategory: false }))}
					selectedCategory={info?.selectedCategory}
				/>
			</div>
		</div>
	);
};

export default memo(CreateEvent);

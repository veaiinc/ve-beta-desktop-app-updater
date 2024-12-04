import React, { memo, useCallback, useEffect, useRef, useState, useContext } from 'react';
import '../../../assets/scss/calendar/createEvent.scss';
import { ReactComponent as CloseSvg } from '../../../assets/svg/calendar/close.svg';
// import { ReactComponent as VerticalDots } from '../../../assets/svg/more-options-dots.svg';
import { ReactComponent as DownSvg } from '../../../assets/svg/calendar/down.svg';
import { ReactComponent as Clock } from '../../../assets/svg/activity/duration.svg';
import { ReactComponent as Category } from '../../../assets/svg/calendar/category.svg';
import { ReactComponent as Location } from '../../../assets/svg/calendar/locationPin.svg';
import { ReactComponent as Meeting } from '../../../assets/svg/calendar/meeting.svg';
import { ReactComponent as Avtar } from '../../../assets/svg/calendar/calendarEllipse.svg';
import { ReactComponent as Close } from '../../../assets/svg/activity/close.svg';
import Spinner from '../../components/loaders/Spinner.jsx';
import ToggleSwitch from '../../components/input/slider';
import Context from '../../../context/context';
import moment from 'moment/moment';

const initialState = {
	title: '',
	description: '',
	location: '',
	startDateTime: '',
	endDateTime: '',
	timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	allDay: false,
	attendees: [],
	meeting: '',
	phone: '',

	// Validation and submission states
	isSubmitting: false,
	submissionError: null,
};

const CreateEvent = ({ updateCalendarInfo }) => {
	const {
		calendarInfo: { calendarEvent, createCalendarEvent },
	} = useContext(Context);

	const [info, setInfo] = useState({
		...initialState,

		// UI state
		showCategory: false,
		showAtendeeSuggestions: false,
		categories: ['Shoots', 'Sessions', 'Meetings'],
		selectedCategory: 'default',
		attendeesInputField: '',
		startDate: '',
		startTime: '',
		endDate: '',
		endTime: '',
		inputDropDownItems: [
			{
				_id: '66e8263c45a6222134432931',
				firstName: 'sankar',
				lastName: 'josyula',
				email: 'sankar@ve.ai',
				role: 'admin',
				isOwner: true,
			},
			{
				_id: '671a26ab0d6a528cf2d8fd7a',
				firstName: 'Dheeraj',
				lastName: 'C Justin',
				email: 'dheeraj@ve.ai',
				role: 'admin',
				isOwner: false,
			},
			{
				_id: '671a26ab0d6a528cf3c9fd9b',
				firstName: 'Preetam',
				lastName: 'Singh',
				email: 'preetam@ve.ai',
				role: 'admin',
				isOwner: false,
			},
		],
	});

	const createEventRef = useRef(null);

	useEffect(() => {
		let timerId;
		const handleClickOutside = (event) => {
			if (
				createEventRef.current &&
				!createEventRef.current.contains(event.target) &&
				!event.target.closest('.attendeesDetails')
			) {
				updateCalendarInfo('isCreateEventOpen', false);
			}
		};
		timerId = setTimeout(() => {
			document.addEventListener('click', handleClickOutside);
		}, 0);
		return () => {
			clearTimeout(timerId);
			document.removeEventListener('click', handleClickOutside);
			setInfo({ ...initialState });
		};
	}, []);

	// Format date and time to ISO string
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
			selectedCategory,
		} = info;
		// Validate required fields
		if (!title || !startDate || !endDate) {
			setInfo((prev) => ({
				...prev,
				submissionError: 'Title and date are required',
				isSubmitting: false,
			}));
			return null;
		}

		return {
			title,
			description: description || '',
			location,
			startDateTime: convertToISOString(startDate, startTime),
			endDateTime: convertToISOString(endDate || startDate, endTime || startTime),
			timezone,
			allDay,
			attendees: attendees?.map((attendee) => ({
				tenantUserId: attendee.tenantUserId || '',
				firstName: attendee.name || '',
				lastName: '',
				email: attendee.email,
				responseStatus: 'confirmed',
			})),
			calendarCategory: selectedCategory.toLowerCase(),
			meeting,
			phone: '',
		};
	}, [info, convertToISOString]);

	// Handle event creation submission
	const handleEventSubmission = useCallback(async () => {
		// Reset previous errors
		setInfo((prev) => ({
			...prev,
			isSubmitting: true,
			submissionError: null,
		}));

		try {
			const eventPayload = prepareEventPayload();
			if (!eventPayload) return;
			console.log('Calling API with payload:', eventPayload);

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

	const addAttendees = useCallback(
		({ name = '', email = '', isWorkspaceUser = false, tenantUserId = '' }) => {
			// Validate email
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				setInfo((prevInfo) => ({
					...prevInfo,
					submissionError: 'Invalid email address',
				}));
				return;
			}

			// Check for duplicate
			const isDuplicate = info.attendees.some((attendee) => attendee.email === email);

			if (isDuplicate) {
				setInfo((prevInfo) => ({
					...prevInfo,
					submissionError: 'Attendee already added',
				}));
				return;
			}

			setInfo((prevInfo) => {
				const updatedAttendees = [
					...prevInfo.attendees,
					{ name, email, isWorkspaceUser, tenantUserId },
				];
				return {
					...prevInfo,
					attendeesInputField: '',
					attendees: updatedAttendees,
					submissionError: null, // Clear any previous errors
				};
			});
		},
		[info.attendees],
	);

	const removeAttendee = useCallback((id) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			submissionError: null,
			attendees: prevInfo.attendees.filter(
				(attendee) => attendee.tenantUserId !== id && attendee.email !== id,
			),
		}));
	}, []);

	return (
		<div className="createEventContainer" ref={createEventRef}>
			<div className="headerWrapper">
				<span className="headerLabel">Create an event</span>
				<CloseSvg
					onClick={() => updateCalendarInfo('isCreateEventOpen', false)}
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
							onChange={(e) => updateEventInfo('startDate', e.target.value)}
						/>
						{info?.allDay ? (
							''
						) : (
							<input
								type="time"
								placeholder="12:00PM"
								className="timeInput"
								value={info?.startTime}
								onChange={(e) => updateEventInfo('startTime', e.target.value)}
							/>
						)}
					</div>
					<div className={`${info?.allDay ? `` : `eventTimeWrapper`}`}>
						<input
							type="date"
							placeholder="Wed, September 22 2024"
							className="dateInput"
							value={info?.endDate}
							onChange={(e) => updateEventInfo('endDate', e.target.value)}
						/>
						{info?.allDay ? (
							''
						) : (
							<input
								type="time"
								placeholder="12:30AM"
								className="timeInput"
								value={info?.endTime}
								onChange={(e) => updateEventInfo('endTime', e.target.value)}
							/>
						)}
					</div>
					<div className="allDayWrapper">
						<span className="allDayLabel">All Day Event</span>
						<ToggleSwitch onChange={() => updateEventInfo('allDay', !info?.allDay)} />
					</div>
				</div>

				<div className="categoriesContainer">
					<div className="categoriesWrapper">
						<Category />
						<div className="categoriesLabel">Categories</div>
					</div>
					<div className="categoriesSelector">
						<input type="text" placeholder="Add to a category" />
						<div
							className="downArrow"
							onClick={() => updateEventInfo('showCategory', !info?.showCategory)}
						>
							<DownSvg
								style={{
									transform: info?.showCategory ? `rotate(180deg)` : `rotate(0)`,
								}}
							/>
						</div>
						{info?.showCategory ? (
							<div className="categoryDropDown">
								<div className="categoryDropDownItem">Shoots</div>
								<div className="categoryDropDownItem">Sessions</div>
								<div className="categoryDropDownItem">Meetings</div>
								<div className="categoryDropDownItem addCategory">+ Add new</div>
							</div>
						) : (
							''
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
						<span className="attendeesCount">{info?.attendees.length + 1}</span>
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
							onChange={(e) => updateEventInfo('attendeesInputField', e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && info?.attendeesInputField) {
									addAttendees({ email: info?.attendeesInputField });
									updateEventInfo('showAtendeeSuggestions', false);
								}
							}}
						/>
						{info?.showAtendeeSuggestions ? (
							<div className="addAttendeeDropDown">
								{info?.inputDropDownItems
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
												});
											}}
										>
											<div className="avatar">
												<Avtar />
											</div>
											<div className="details">
												<div className="name">{`${item?.firstName} ${item?.lastName}`}</div>
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
								<span className="name">Avinash</span>
								<span className="role">Organizer</span>
							</div>
						</div>
						{info?.attendees
							? info?.attendees?.map((item, index) => (
									<div className="attendeesDetails" key={index}>
										<div className="avatar">
											<Avtar />
										</div>

										{item?.isWorkspaceUser ? (
											<div className="nameWrapper">
												<span className="name">{item?.name}</span>
												<span className="role">{item?.email}</span>
											</div>
										) : (
											<div className="nameWrapper">
												<span className="name">{item?.email}</span>
											</div>
										)}
										<Close
											onClick={() =>
												removeAttendee(item?.tenantUserId || item?.email)
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
		</div>
	);
};

export default memo(CreateEvent);

import React, { memo, useCallback, useState, useContext, useEffect } from 'react';
import '../../../assets/scss/calendar/eventsPopup.scss';
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
import ReactModal from '../modalsV2';

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

	// UI state
	showCategory: false,
	showAtendeeSuggestions: false,
	categories: ['Shoots', 'Sessions', 'Meetings'],
	selectedCategory: null,
	attendeesInputField: '',
	startDate: '',
	startTime: '',
	endDate: '',
	endTime: '',
	addCategory: false,
};

const formatTimeAndDateForInput = (timeObj) => {
	if (!timeObj) return { date: '', time: '' };
	if (typeof timeObj === 'string') return { date: timeObj, time: '' };
	const date = moment(timeObj).format('YYYY-MM-DD');
	const time = moment(timeObj).format('HH:mm');
	return { date, time };
};

const EventsPopUp = ({ open, closeModal, categoryList, selectedCategory, selectedSlot }) => {
	const {
		calendarInfo: {
			calendarEvent,
			createCalendarEvent,
			getCalendarEventsList,
			updateCalendarState,
			calendarCategoriesList,
			getCalendarCategories,
		},
		profileInfo: { userDetailsData },
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
		companyInfo: { tenantsUserList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		...initialState,
		selectedCategory: selectedCategory || null,
		categories: [],
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

	useEffect(() => {
		if (calendarCategoriesList && calendarCategoriesList.length > 0) {
			setInfo((prev) => ({
				...prev,
				categories: [...calendarCategoriesList],
			}));
		}
	}, [calendarCategoriesList]);

	useEffect(() => {
		getCalendarCategories();
	}, []);

	useEffect(() => {
		if (info?.categories?.length > 0 && !info?.selectedCategory) {
			const defaultCategory = info?.categories?.find((category) => category?.name === 'all');
			if (defaultCategory) {
				setInfo((prev) => ({
					...prev,
					selectedCategory: defaultCategory,
				}));
			}
		}
	}, [info?.categories, info?.selectedCategory]);

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

		const startDateTime = moment(convertToISOString(startDate, startTime));
		const endDateTime = moment(convertToISOString(endDate, endTime || startTime));
		const now = moment().startOf('day');

		if (startDateTime.isBefore(now)) {
			setInfo((prev) => ({
				...prev,
				submissionError: 'Start date/time cannot be in the past',
				isSubmitting: false,
			}));
			return null;
		}

		if (endDateTime.isBefore(startDateTime)) {
			setInfo((prev) => ({
				...prev,
				submissionError: 'End date/time cannot be before start date/time',
				isSubmitting: false,
			}));
			return null;
		}

		if (!attendees || attendees?.length === 0) {
			setInfo((prev) => ({
				...prev,
				submissionError: 'At least one attendee is required',
				isSubmitting: false,
			}));
			return null;
		}

		const processedAttendees = attendees?.map((attendee) => ({
			isWorkspaceUser: attendee?.tenantUserId ? true : false,
			tenantUserId: attendee?.tenantUserId || null,
			name: attendee?.name || null,
			email: attendee?.email,
			role: attendee?.role,
			responseStatus: 'confirmed',
		}));

		return {
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
	}, [info, convertToISOString]);

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
			// Update calendar state to trigger a refresh
			updateCalendarState({ refetchCalendarState: true });
			// Close the modal and reset state
			closeModal();
			setInfo(initialState);
		} catch (error) {
			setInfo((prev) => ({
				...prev,
				isSubmitting: false,
				submissionError: error.message || 'Failed to create event',
			}));
		}
	}, [
		prepareEventPayload,
		createCalendarEvent,
		closeModal,
		updateCalendarState,
		validateExpiryData,
		updateSubscriptionState,
	]);

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	const addAttendees = useCallback(
		({
			name = null,
			email = null,
			isWorkspaceUser = false,
			tenantUserId = null,
			role = null,
		}) => {
			if (!emailRegex.test(email)) {
				setInfo((prevInfo) => ({
					...prevInfo,
					submissionError: 'Invalid email address',
				}));
				return;
			}

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

	const handleClose = useCallback(() => {
		if (info?.isSubmitting) return;
		closeModal();
		setInfo(initialState);
	}, [closeModal, info?.isSubmitting]);

	if (!open) return null;

	return (
		<ReactModal
			isOpen={open}
			closeModal={handleClose}
			customStyles={{
				overlay: {
					zIndex: 9999,
					background: 'rgba(0, 0, 0, 0.3)',
					backdropFilter: 'blur(8px)',
					WebkitBackdropFilter: 'blur(8px)',
				},
				content: {
					overflow: 'unset',
					background: 'transparent',
					border: 'none',
					padding: 0,
					top: '50%',
					left: '50%',
					right: 'auto',
					bottom: 'auto',
					marginRight: '-50%',
					transform: 'translate(-50%, -50%)',
				},
			}}
		>
			<div className="events-popup-container">
				<div className="events-popup-header">
					<div className="events-popup-header-text">Create Event</div>
					<CloseSvg onClick={handleClose} style={{ cursor: 'pointer' }} />
				</div>
				{info?.submissionError && (
					<div className="events-popup-submission-error">
						⚠️
						<span>{info?.submissionError}</span>
					</div>
				)}
				<div className="events-popup-body">
					<div className="events-popup-agenda-container">
						<span className="events-popup-agenda-label">Agenda</span>
						<input
							type="text"
							name="title"
							id="title"
							placeholder="E.g. Meeting"
							value={info?.title}
							onChange={(e) => updateEventInfo('title', e.target.value)}
						/>
						<span className="events-popup-agenda-label">Description</span>
						<input
							type="text"
							name="description"
							id="description"
							placeholder="Description of the event"
							value={info?.description}
							onChange={(e) => updateEventInfo('description', e.target.value)}
						/>
					</div>

					<div className="events-popup-details-container">
						<div className="events-popup-details-wrapper">
							<Clock className="events-popup-details-icon" />
							<span className="events-popup-details-label">Details</span>
						</div>
						<div className={`${info?.allDay ? `` : `events-popup-time-wrapper`}`}>
							<input
								type="date"
								placeholder="Wed, September 22 2024"
								className="events-popup-date-input"
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
									className="events-popup-time-input"
									value={info?.startTime}
									onChange={(e) => {
										updateEventInfo('startTime', e.target.value);
										updateEventInfo('submissionError', null);
									}}
								/>
							)}
						</div>
						<div className={`${info?.allDay ? `` : `events-popup-time-wrapper`}`}>
							<input
								type="date"
								placeholder="Wed, September 22 2024"
								className="events-popup-date-input"
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
									className="events-popup-time-input"
									value={info?.endTime}
									onChange={(e) => {
										updateEventInfo('endTime', e.target.value);
										updateEventInfo('submissionError', null);
									}}
								/>
							)}
						</div>
						<div className="events-popup-all-day-wrapper">
							<span className="events-popup-all-day-label">All Day Event</span>
							<ToggleSwitch
								onChange={() => updateEventInfo('allDay', !info?.allDay)}
							/>
						</div>
					</div>

					<div className="events-popup-categories-container">
						<div className="events-popup-categories-wrapper">
							<Category />
							<div className="events-popup-categories-label">Categories</div>
						</div>
						<div className="events-popup-categories-selector">
							<input
								type="text"
								placeholder="Add to a category"
								onBlur={() => updateEventInfo('showCategory', false)}
								onFocus={() => {
									updateEventInfo('showCategory', true);
								}}
								value={info?.selectedCategory?.name || ''}
								style={{ textTransform: 'capitalize' }}
							/>
							<div
								className="events-popup-down-arrow"
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
								<div className="events-popup-category-dropdown">
									{info?.categories?.map((item) => (
										<div
											key={item?._id}
											className="events-popup-category-dropdown-item"
											onMouseDown={() => {
												updateEventInfo('selectedCategory', item);
												updateEventInfo('showCategory', false);
											}}
										>
											{item?.name}
										</div>
									))}
									<div
										className="events-popup-category-dropdown-item events-popup-add-category"
										onClick={() =>
											setInfo((prev) => ({ ...prev, addCategory: true }))
										}
									>
										+ Add new
									</div>
								</div>
							)}
						</div>
						<div className="events-popup-additional-options">
							<input
								type="text"
								placeholder="Add location"
								value={info?.location}
								onChange={(e) => updateEventInfo('location', e.target.value)}
							/>
							<Location />
						</div>
						<div className="events-popup-additional-options">
							<Meeting />
							<input
								type="text"
								placeholder="Add meeting link"
								value={info?.meeting}
								onChange={(e) => updateEventInfo('meeting', e.target.value)}
							/>
						</div>
					</div>

					<div className="events-popup-attendees-container">
						<div className="events-popup-attendees-header">
							<span className="events-popup-attendees-label">Attendees</span>
							<span className="events-popup-attendees-count">
								{info?.attendees?.length + 1}
							</span>
						</div>
						<div className="events-popup-attendee-input-wrapper">
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
								<div className="events-popup-add-attendee-dropdown">
									{tenantsUserList
										?.filter((item) => !item?.isOwner)
										?.map((item) => (
											<div
												className="events-popup-dropdown-list"
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
												<div className="events-popup-avatar">
													<Avtar />
												</div>
												<div className="events-popup-details">
													<div className="events-popup-name">
														{`${item?.firstName}`}
													</div>
													<div className="events-popup-email">
														{item?.email}
													</div>
												</div>
											</div>
										))}
								</div>
							) : (
								''
							)}
						</div>
						<div className="events-popup-attendees-list">
							<div className="events-popup-attendees-details">
								<div className="events-popup-avatar">
									<Avtar />
								</div>
								<div className="events-popup-name-wrapper">
									<span className="events-popup-name">
										{userDetailsData?.firstName} {userDetailsData?.lastName}
									</span>
									<span className="events-popup-role">Organizer</span>
								</div>
							</div>
							{info?.attendees
								? info?.attendees?.map((item, index) => (
										<div className="events-popup-attendees-details" key={index}>
											<div className="events-popup-avatar">
												<Avtar />
											</div>
											<div className="events-popup-name-wrapper">
												<span className="events-popup-name">
													{item?.name}
												</span>
												<span className="events-popup-role">
													{item?.email}
												</span>
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
					className="events-popup-submit-button"
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
		</ReactModal>
	);
};

export default memo(EventsPopUp);

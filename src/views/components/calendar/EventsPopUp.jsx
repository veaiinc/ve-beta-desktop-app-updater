import { memo, useCallback, useState, useContext, useEffect } from 'react';
import styles from '../../../assets/scss/calendar/eventsPopup.module.scss';
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
// import { Tooltip } from 'antd';
import PhoneInput from 'react-phone-number-input';
import { isURL } from '../../../helpers';

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
	locationTypeOpen: false,
	meetLinkTypeOpen: false,
	locationType: 'In Person',
	meetLinkType: 'Video Call',
	sessionTypeOpen: false,
	sessionType: 'In Person',
	phoneNumber: null,
	meetingLink: null,
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const customStyles = {
	overlay: {
		zIndex: 9999,
		background: 'var(--backdrop)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '20px',
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
		width: '100%',
		maxWidth: '620px',
		maxHeight: '90vh',
	},
};

const formatTimeAndDateForInput = (timeObj) => {
	if (!timeObj) return { date: '', time: '' };
	if (typeof timeObj === 'string') return { date: timeObj, time: '' };
	const date = moment(timeObj).format('YYYY-MM-DD');
	const time = moment(timeObj).format('HH:mm');
	return { date, time };
};

const sessionTypeOptions = ['In Person', 'Phone Call', 'Video Call'];

const sessionTypeInputConfig = {
	'In Person': {
		value: 'location',
		tag: 'Location',
		type: 'text',
		placeholder: 'Add location',
	},
	'Phone Call': {
		value: 'phoneNumber',
		tag: 'Phone Number',
		type: 'tel',
		placeholder: 'Add phone number',
	},
	'Video Call': {
		value: 'meetingLink',
		tag: 'Platform Link',
		type: 'url',
		placeholder: 'Add meeting link',
	},
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
			createCalendarCategory,
		},
		profileInfo: { userDetailsData },
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
		companyInfo: { tenantsUserList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		...initialState,
		selectedCategory: selectedCategory || null,
		categories: [],
		categoryInput: '',
		categoryLoading: false,
		categoryError: null,
	});

	useEffect(() => {
		if (open) {
			if (!calendarCategoriesList) {
				getCalendarCategories();
			} else {
				setInfo((prev) => ({
					...prev,
					...(!calendarCategoriesList?.error && {
						categories: [...calendarCategoriesList],
					}),
					categoryError: null,
				}));
			}
		}
	}, [open, calendarCategoriesList, getCalendarCategories]);

	useEffect(() => {
		if (selectedSlot && selectedSlot.start && selectedSlot.end) {
			const { date: startDate, time: startTime } = formatTimeAndDateForInput(
				selectedSlot.start,
			);
			const { date: endDate, time: endTime } = formatTimeAndDateForInput(selectedSlot.end);
			setInfo((prev) => ({
				...prev,
				startDate,
				startTime,
				endDate,
				endTime,
			}));
		}
	}, [selectedSlot]);

	useEffect(() => {
		if (info?.categories && !info?.selectedCategory) {
			const defaultCategory = info?.categories?.find((category) => category?.name === 'all');
			if (defaultCategory) {
				setInfo((prev) => ({
					...prev,
					selectedCategory: defaultCategory,
				}));
			}
		}
	}, [info?.categories, info?.selectedCategory]);

	useEffect(() => {
		if (calendarCategoriesList && !calendarCategoriesList.error) {
			setInfo((prev) => ({
				...prev,
				categories: [...calendarCategoriesList],
			}));
		}
	}, [calendarCategoriesList]);

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
			description = '',
			startDate,
			startTime,
			endDate,
			endTime,
			allDay,
			timezone,
			location,
			meeting,
			attendees = [],
			phone,
			selectedCategory,
		} = info;
		const startDateTime = moment(convertToISOString(startDate, startTime));
		const endDateTime = moment(convertToISOString(endDate || startDate, endTime || startTime));
		const now = moment().startOf('day');
		const setErrorAndReturn = (msg) => {
			setInfo((prev) => ({
				...prev,
				submissionError: msg,
				isSubmitting: false,
			}));
			return null;
		};
		const validations = [
			{
				condition: !title,
				message: 'Agenda is required',
			},
			{
				condition: !startDate,
				message: 'Start date is required',
			},
			{
				condition: !endDate,
				message: 'End date is required',
			},
			{
				condition: startDateTime.isBefore(now),
				message: 'Start date/time cannot be in the past',
			},
			{
				condition: endDateTime.isBefore(startDateTime),
				message: 'End date/time cannot be before start date/time',
			},
			{
				condition: attendees.length === 0,
				message: 'At least one attendee is required',
			},
			{
				condition: !selectedCategory,
				message: 'Please select a category',
			},
		];
		for (const { condition, message } of validations) {
			if (condition) return setErrorAndReturn(message);
		}
		const processedAttendees = attendees.map(({ tenantUserId, name = null, email, role }) => ({
			isWorkspaceUser: !!tenantUserId,
			tenantUserId: tenantUserId || null,
			name,
			email,
			role,
			responseStatus: 'confirmed',
		}));
		return {
			title,
			description,
			location,
			startDateTime: convertToISOString(startDate, startTime),
			endDateTime: convertToISOString(endDate || startDate, endTime || startTime),
			timezone,
			allDay,
			attendees: processedAttendees,
			calendarCategory: selectedCategory,
			meeting,
			phone,
		};
	}, [info, selectedCategory]);

	const handleEventSubmission = useCallback(async () => {
		try {
			if (
				validateExpiryData &&
				validateExpiryData?.restrictCalendar &&
				validateExpiryData?.isExpired
			) {
				return updateSubscriptionState({
					expiredSubscriptionModal: true,
					expiredSubscriptionType: 'Event',
				});
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
					...prevInfo?.attendees,
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

	const handleSessionTypeChange = useCallback(
		(type) => {
			if (type === info?.sessionType) return;
			setInfo((prev) => ({
				...prev,
				sessionType: type,
				sessionTypeOpen: false,
				location: type === 'In Person' ? prev.location : '',
				phone: type === 'Phone Call' ? prev.phoneNumber : '',
				meeting: type === 'Video Call' ? prev.meetingLink : '',
				phoneNumber: type === 'Phone Call' ? prev.phoneNumber : '',
				meetingLink: type === 'Video Call' ? prev.meetingLink : '',
			}));
		},
		[info?.sessionType],
	);

	const renderSessionTypeInput = () => {
		const config = sessionTypeInputConfig[info.sessionType];
		const value = info[config.value];

		const validateInput = (value) => {
			if (config.value === 'meetingLink') {
				const err = !isURL(value);
				setInfo((prev) => ({
					...prev,
					submissionError: err ? 'Invalid meeting link' : null,
				}));
			}
			return true;
		};

		const handleChange = (val) => {
			setInfo((prev) => ({
				...prev,
				[config.value]: val,
				[config.value === 'phoneNumber'
					? 'phone'
					: config.value === 'meetingLink'
					? 'meeting'
					: 'location']: val,
				submissionError: null,
			}));
			validateInput(val);
		};

		if (config.value === 'phoneNumber') {
			return (
				<PhoneInput
					placeholder="Enter phone number"
					value={info[config.value]}
					onChange={handleChange}
					defaultCountry={(() => {
						try {
							const locationDetails = JSON.parse(
								localStorage.getItem('locationDetails'),
							);
							return locationDetails?.countryCode || 'US';
						} catch {
							return 'US';
						}
					})()}
					className="phoneInputNumber"
					countryCallingCodeEditable={true}
					autoComplete="tel"
					style={{ backgroundColor: 'none', border: '1px solid var(--stroke)' }}
				/>
			);
		}

		return (
			<input
				type={config.type}
				value={info[config.value] || ''}
				onChange={(e) => handleChange(e.target.value)}
				placeholder={config.placeholder}
				className={`${styles.inputHeight}${
					info.submissionError && config.value === 'meetingLink' ? ` ${styles.error}` : ''
				}`}
			/>
		);
	};

	const doesCategoryExist = (name) =>
		info.categories.some((cat) => cat?.name?.toLowerCase() === name.trim().toLowerCase());

	const handleCreateCategory = async (name) => {
		if (!name.trim()) return;
		if (doesCategoryExist(name)) {
			return;
		}
		const color = '#ff2727';
		setInfo((prev) => ({ ...prev, categoryLoading: true }));
		try {
			await createCalendarCategory({ calendarCategory: name.trim(), categoryColor: color });
			await getCalendarCategories();
			setTimeout(() => {
				setInfo((prev) => {
					const newCat = (prev.categories || []).find(
						(cat) => cat?.name?.toLowerCase() === name.trim().toLowerCase(),
					);
					if (!newCat) {
						return {
							...prev,
							categoryLoading: false,
						};
					}
					return {
						...prev,
						selectedCategory: newCat,
						categoryInput: '',
						categoryLoading: false,
						showCategory: false,
					};
				});
			}, 200); // Give time for context to update
		} catch (e) {
			setInfo((prev) => ({
				...prev,
				categoryLoading: false,
			}));
		}
	};

	if (!open) return null;

	return (
		<ReactModal
			isOpen={open}
			closeModal={handleClose}
			customStyles={customStyles}
			shouldCloseOnOverlayClick={false}
		>
			<div className={styles['events-popup-container']}>
				<div className={styles['events-popup-header']}>
					<div className={styles['events-popup-header-text']}>Create Event</div>
					<CloseSvg onClick={handleClose} style={{ cursor: 'pointer' }} />
				</div>
				{info?.submissionError && (
					<div className={styles['events-popup-submission-error']}>
						⚠️
						<span>{info?.submissionError}</span>
					</div>
				)}
				<div className={styles['events-popup-body']}>
					<div className={styles['events-popup-agenda-container']}>
						<span className={styles['events-popup-agenda-label']}>Event name</span>
						<input
							type="text"
							name="title"
							id="title"
							placeholder="E.g. Meeting"
							value={info?.title}
							onChange={(e) => updateEventInfo('title', e.target.value)}
							style={{
								display: 'flex',
								padding: '12px 14px',
								alignItems: 'center',
								gap: '16px',
								alignSelf: 'stretch',
							}}
						/>
						<span className={styles['events-popup-agenda-label']}>Description</span>
						<input
							type="text"
							name="description"
							id="description"
							placeholder="Description of the event"
							value={info?.description}
							onChange={(e) => updateEventInfo('description', e.target.value)}
							autoComplete="off"
							autofill="off"
						/>
					</div>
					<div
						className={styles.sessionOptionContainer}
						style={{
							marginTop: '-4px',
						}}
					>
						<div className={styles.sessionTypeWrapper}>
							<span>Session Type</span>
							<div
								className={styles['typeOfSession-lable']}
								style={{
									backgroundColor: 'var(--popup)',
								}}
								onClick={() =>
									setInfo((prev) => ({
										...prev,
										sessionTypeOpen: !prev.sessionTypeOpen,
									}))
								}
							>
								{info?.sessionType}
								<DownSvg
									className={`${info?.sessionTypeOpen ? styles.open : ''}`}
								/>
							</div>
							{info?.sessionTypeOpen && (
								<div className={styles['sessionType-dropdown']}>
									{sessionTypeOptions?.map((option) => (
										<div
											key={option}
											className={styles['sessionType-dropdown-item']}
											onClick={() => handleSessionTypeChange(option)}
										>
											{option}
										</div>
									))}
								</div>
							)}
						</div>
						<div className={styles.sessionTypeWrapper}>
							<span>{sessionTypeInputConfig[info?.sessionType]?.tag}</span>
							{renderSessionTypeInput()}
						</div>
					</div>

					<div className={styles['events-popup-details-container']}>
						{/* <div className="events-popup-details-wrapper">
							<Clock className="events-popup-details-icon" />
							<span className="events-popup-details-label">Details</span>
						</div> */}
						<div
							className={`${info?.allDay ? `` : styles['events-popup-time-wrapper']}`}
						>
							<div className={styles['events-popup-time-label']}>
								Start Date & Time
							</div>
							<div className={styles['events-popup-time-wrapper']}>
								<input
									type="date"
									placeholder={moment().format('DD MMM YYYY')}
									className={styles['events-popup-date-input']}
									value={info?.startDate}
									min="1900-01-01"
									max="9999-12-31"
									onChange={(e) => {
										updateEventInfo('startDate', e.target.value);
										updateEventInfo('submissionError', null);
									}}
								/>
								{info?.allDay ? (
									''
								) : (
									<>
										<div className={styles['events-time-date-divider']}></div>
										<input
											type="time"
											placeholder="12:00PM"
											className={styles['events-popup-time-input']}
											value={info?.startTime}
											onChange={(e) => {
												updateEventInfo('startTime', e.target.value);
												updateEventInfo('submissionError', null);
											}}
										/>
									</>
								)}
							</div>
						</div>
						<div
							className={`${info?.allDay ? `` : styles['events-popup-time-wrapper']}`}
						>
							<div className={styles['events-popup-time-label']}>End Date & Time</div>
							<div className={styles['events-popup-time-wrapper']}>
								<input
									type="date"
									placeholder={moment().format('DD MMM YYYY')}
									className={styles['events-popup-date-input']}
									value={info?.endDate}
									min="0000-00-00"
									max="9999-12-31"
									onChange={(e) => {
										updateEventInfo('endDate', e.target.value);
										updateEventInfo('submissionError', null);
									}}
								/>
								{info?.allDay ? (
									''
								) : (
									<>
										<div className={styles['events-time-date-divider']}></div>
										<input
											type="time"
											placeholder="12:30AM"
											className={styles['events-popup-time-input']}
											value={info?.endTime}
											onChange={(e) => {
												updateEventInfo('endTime', e.target.value);
												updateEventInfo('submissionError', null);
											}}
										/>
									</>
								)}
							</div>
						</div>
						<div className={styles['events-popup-all-day-wrapper']}>
							<ToggleSwitch
								onChange={() => updateEventInfo('allDay', !info?.allDay)}
							/>
							<span className={styles['events-popup-all-day-label']}>
								All Day Event
							</span>
						</div>
					</div>

					<div className={styles['events-popup-categories-container']}>
						<div className={styles['events-popup-categories-wrapper']}>
							<Category />
							<div className={styles['events-popup-categories-label']}>
								Categories
							</div>
						</div>
						<div className={styles['events-popup-categories-selector']}>
							<input
								type="text"
								placeholder={
									info?.selectedCategory ? info?.selectedCategory.name : ''
								}
								onBlur={() => updateEventInfo('showCategory', false)}
								onFocus={() => {
									updateEventInfo('showCategory', true);
								}}
								value={
									info.categoryInput !== undefined
										? info?.categoryInput
										: info?.selectedCategory?.name || ''
								}
								onChange={(e) => {
									const val = e.target.value;
									setInfo((prev) => ({
										...prev,
										categoryInput: val,
										showCategory: true,
									}));
								}}
								onKeyDown={async (e) => {
									if (
										e.key === 'Enter' &&
										info.categoryInput &&
										!doesCategoryExist(info.categoryInput)
									) {
										await handleCreateCategory(info.categoryInput);
									}
								}}
								style={{ textTransform: 'capitalize' }}
								autoFocus={info.showCategory}
							/>
							<div
								className={styles['events-popup-down-arrow']}
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
								<div className={styles['events-popup-category-dropdown']}>
									{info?.categoryInput
										? info.categories
												.filter((cat) =>
													cat?.name
														?.toLowerCase()
														.includes(info.categoryInput.toLowerCase()),
												)
												.map((item) => (
													<div
														key={item?._id}
														className={
															styles[
																'events-popup-category-dropdown-item'
															]
														}
														onMouseDown={() => {
															setInfo((prev) => ({
																...prev,
																selectedCategory: item,
																showCategory: false,
																categoryInput: '',
															}));
														}}
													>
														{item?.name}
													</div>
												))
										: info.categories.map((item) => (
												<div
													key={item?._id}
													className={
														styles[
															'events-popup-category-dropdown-item'
														]
													}
													onMouseDown={() => {
														setInfo((prev) => ({
															...prev,
															selectedCategory: item,
															showCategory: false,
															categoryInput: '',
														}));
													}}
												>
													{item?.name}
												</div>
										  ))}
									{info.categoryInput &&
										!doesCategoryExist(info.categoryInput) && (
											<div
												className={`${styles['events-popup-category-dropdown-item']} ${styles['events-popup-add-category']}`}
												onMouseDown={async () => {
													await handleCreateCategory(info.categoryInput);
												}}
											>
												{info.categoryLoading
													? 'Adding...'
													: `+ Add "${info.categoryInput}"`}
											</div>
										)}
								</div>
							)}
						</div>
					</div>

					<div className={styles['events-popup-attendees-container']}>
						<div className={styles['events-popup-attendees-header']}>
							<span className={styles['events-popup-attendees-label']}>
								Attendees
							</span>
							<span className={styles['events-popup-attendees-count']}>
								{info?.attendees?.length + 1}
							</span>
						</div>
						<div className={styles['events-popup-attendee-input-wrapper']}>
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
								<div className={styles['events-popup-add-attendee-dropdown']}>
									{tenantsUserList
										?.filter((item) => !item?.isOwner)
										?.map((item) => (
											<div
												className={styles['events-popup-dropdown-list']}
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
												<div className={styles['events-popup-avatar']}>
													<Avtar />
												</div>
												<div className={styles['events-popup-details']}>
													<div className={styles['events-popup-name']}>
														{`${item?.firstName}`}
													</div>
													<div className={styles['events-popup-email']}>
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
						<div className={styles['events-popup-attendees-list']}>
							<div className={styles['events-popup-attendees-details']}>
								<div className={styles['events-popup-avatar']}>
									<Avtar />
								</div>
								<div className={styles['events-popup-name-wrapper']}>
									<span className={styles['events-popup-name']}>
										{userDetailsData?.firstName} {userDetailsData?.lastName}
									</span>
									<span className={styles['events-popup-role']}>Organizer</span>
								</div>
							</div>
							{info?.attendees
								? info?.attendees?.map((item, index) => (
										<div
											className={styles['events-popup-attendees-details']}
											key={index}
										>
											<div className={styles['events-popup-avatar']}>
												<Avtar />
											</div>
											<div className={styles['events-popup-name-wrapper']}>
												<span className={styles['events-popup-name']}>
													{item?.name}
												</span>
												<span className={styles['events-popup-role']}>
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
				<div className={styles['events-popup-actions-container']}>
					<div
						className={`${styles['events-popup-action-button']} ${styles['events-popup-action-button--secondary']}`}
						onClick={handleClose}
					>
						Discard
					</div>
					<div
						className={`${styles['events-popup-action-button']} ${styles['events-popup-action-button--primary']}`}
						onClick={handleEventSubmission}
						disabled={info?.isSubmitting}
					>
						{info?.isSubmitting ? <Spinner width={'20px'} height={'20px'} /> : 'Create'}
					</div>
				</div>
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

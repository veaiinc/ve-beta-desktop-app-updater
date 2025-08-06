import { memo, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import '../../../../assets/scss/calendar/modal/eventDetailsModal.scss';
import CustomInput from '../../../components/globalComponents/CustomInput';
import CustomTextArea from '../../../components/globalComponents/CustomTextArea';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/tasks/doubleRightArrow.svg';
import { ReactComponent as Delete } from '../../../../assets/svg/tasks/dustBin.svg';
import { ReactComponent as Share } from '../../../../assets/svg/calendar/share.svg';
import { ReactComponent as Call } from '../../../../assets/svg/calendar/events/call.svg';
import { ReactComponent as Location } from '../../../../assets/svg/calendar/events/location.svg';
import { ReactComponent as Link } from '../../../../assets/svg/calendar/events/link.svg';
import { ReactComponent as Status } from '../../../../assets/svg/calendar/events/status.svg';
import { message } from '../../../components/globalComponents/CustomToast';
import CategorySelector from '../../calendar/CategorySelector';
import AttendeeSelector from '../../calendar/AttendeeSelector';
import DeleteFormModal from '../DeleteModal/DeleteModal';
import DateView from '../../tasks/listView/DateView.jsx';
import Spinner from '../../../components/loaders/Spinner';
import Context from '../../../../context/context';
import { Drawer } from 'antd';
import moment from 'moment';
// import { PlusOutlined } from '@ant-design/icons';
// import { Input } from 'antd';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

// Utility to sanitize input
const sanitizeInput = (value) => {
	if (typeof value === 'string') {
		return value.replace(/[<>{}]/g, '');
	}
	return value;
};

const styles = {
	header: { display: 'none' },
	body: {
		padding: '0px',
		backgroundColor: 'transparent',
		marginTop: '0px',
		height: '100%',
		overflow: 'hidden',
	},
};

// Utility to normalize select values
// const normalizeSelectValue = (value, options, field) => {
// 	if (!options?.length) {
// 		return field === 'attendees' ? [] : null;
// 	}

// 	const findValue = (v) => {
// 		// Handle direct value matches
// 		const option = options.find((opt) => opt.value === v || opt.label === v || opt._id === v);

// 		// Handle object values
// 		if (!option && typeof v === 'object') {
// 			if (v._id) {
// 				return options.find((opt) => opt._id === v._id)?.value || null;
// 			}
// 			if (v.id) {
// 				return options.find((opt) => opt.value === v.id)?.value || null;
// 			}
// 			if (v.value) {
// 				return options.find((opt) => opt.value === v.value)?.value || null;
// 			}
// 		}

// 		return option ? option.value : null;
// 	};

// 	// Handle attendees array
// 	if (field === 'attendees') {
// 		if (!value || !Array.isArray(value)) {
// 			return [];
// 		}
// 		const normalized = value.map(findValue).filter(Boolean);
// 		return normalized;
// 	}

// 	// Handle calendar category
// 	if (field === 'calendarCategory') {
// 		if (!value) {
// 			return null;
// 		}
// 		const normalized = findValue(value);
// 		return normalized;
// 	}

// 	// Default case
// 	const normalized = findValue(value);
// 	return normalized;
// };

const initialState = {
	loading: false,
	deleting: false,
	eventDetails: null,
	eventKeys: ['locationAdrress', 'locationPincode'],
	error: null,
	updating: false,
	fetching: false,
};

const EventDetailsModal = ({
	selectedEvent,
	isEventSelected,
	categoryList,
	updateCalenderEventsList,
	filterDeletedEvent,
	onClose,
}) => {
	const {
		calendarInfo: { updateCalendarEvent, deleteCalendarEvent, getCalendarEventsList } = {},
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
		companyInfo: { tenantsUserList },
	} = useContext(Context);

	const [info, setInfo] = useState({ ...initialState });
	const [showAddAttendee, setShowAddAttendee] = useState(false);
	const [newAttendee, setNewAttendee] = useState('');
	const [deleteModal, setDeleteModal] = useState({ open: false });
	const resizableContainerRef = useRef(null);
	const mouseXPosition = useRef(null);
	const updateEventDebounceRef = useRef(null);
	const previousEventRef = useRef(null);

	useEffect(() => {
		if (
			selectedEvent &&
			(!previousEventRef.current || previousEventRef.current.id !== selectedEvent.id)
		) {
			previousEventRef.current = selectedEvent;

			const matchingCategory = categoryList?.find(
				(cat) =>
					cat._id === selectedEvent.calendarCategory?._id ||
					cat._id === selectedEvent.calendarCategory?.id ||
					cat._id === selectedEvent.calendarCategory,
			);

			setInfo((prev) => {
				const newState = {
					...prev,
					eventDetails: {
						...selectedEvent,
						attendees: Array.isArray(selectedEvent.attendees)
							? selectedEvent.attendees
							: [],
						calendarCategory:
							matchingCategory || selectedEvent.calendarCategory || null,
					},
					eventKeys: [...initialState.eventKeys, ...Object.keys(selectedEvent)],
					error: null,
					fetching: false,
				};

				return newState;
			});
		}
	}, [selectedEvent, categoryList]);

	useEffect(() => {
		return () => {
			if (updateEventDebounceRef.current) {
				clearTimeout(updateEventDebounceRef.current);
			}
			setInfo(initialState);
		};
	}, []);

	// const formatTimeMiliSec = useCallback((milliseconds) => {
	// 	const duration = moment.duration(milliseconds / 1000, 'seconds');
	// 	const hours = String(duration.hours()).padStart(2, '0');
	// 	const minutes = String(duration.minutes()).padStart(2, '0');
	// 	const secs = String(duration.seconds()).padStart(2, '0');
	// 	const millisecs = String(milliseconds % 1000).padStart(1, '0');
	// 	return `${hours}:${minutes}:${secs}.${millisecs}`;
	// }, []);

	const validateEventUpdate = useCallback(
		(field, value) => {
			if (!selectedEvent?.id) {
				setInfo((prev) => ({ ...prev, error: 'No event selected' }));
				return false;
			}

			if (field === 'startDateTime' || field === 'endDateTime') {
				const start = moment.unix(selectedEvent.startDateTime);
				const end = moment.unix(selectedEvent.endDateTime);

				if (end.isBefore(start)) {
					setInfo((prev) => ({
						...prev,
						error: 'End date/time cannot be before start date/time',
					}));
					return false;
				}
			}

			return true;
		},
		[selectedEvent],
	);

	const debouncedUpdateEvent = useCallback(
		async (eventData) => {
			if (updateEventDebounceRef.current) {
				clearTimeout(updateEventDebounceRef.current);
			}

			updateEventDebounceRef.current = setTimeout(async () => {
				try {
					if (
						validateExpiryData &&
						validateExpiryData?.restrictCalendar &&
						validateExpiryData?.isExpired
					) {
						return updateSubscriptionState({
							expiredSubscriptionModal: true,
							expiredSubscriptionType: 'Events',
						});
					}

					const { eventId, field, value } = eventData;

					if (!validateEventUpdate(field, value)) {
						return;
					}

					setInfo((prev) => ({ ...prev, updating: true, error: null }));

					const updateBody = {
						[field]: sanitizeInput(value),
					};

					if (!updateCalendarEvent) {
						throw new Error('Update function not available');
					}

					await updateCalendarEvent(eventId, updateBody);
					updateCalenderEventsList(eventId, updateBody);
					message.success('Event updated successfully');
				} catch (error) {
					const errorMessage =
						error.message === 'Unauthorized access'
							? 'Please log in again'
							: error.message === 'Event not found'
							? 'Event no longer exists'
							: error.message.includes('Failed to fetch')
							? 'Cannot connect to server. Please check your network or API settings.'
							: 'Failed to update event. Please try again.';
					setInfo((prev) => ({
						...prev,
						error: errorMessage,
					}));
					message.error(errorMessage);
				} finally {
					setInfo((prev) => ({ ...prev, updating: false }));
				}
			}, 800);
		},
		[
			updateCalendarEvent,
			validateExpiryData,
			updateSubscriptionState,
			validateEventUpdate,
			updateCalenderEventsList,
			getCalendarEventsList,
		],
	);
	const handleRemoveAttendee = (indexToRemove) => {
		setInfo((prev) => ({
			...prev,
			eventDetails: {
				...prev.eventDetails,
				attendees: prev.eventDetails.attendees.filter((_, idx) => idx !== indexToRemove),
			},
		}));
	};

	const modifiedOnClose = useCallback(() => {
		if (updateEventDebounceRef.current) {
			clearTimeout(updateEventDebounceRef.current);
		}
		setInfo((prev) => ({
			...prev,
			loading: false,
			deleting: false,
			updating: false,
			fetching: false,
			error: null,
		}));
		onClose();
	}, [onClose]);

	const deleteEvent = useCallback(async () => {
		try {
			if (
				validateExpiryData &&
				validateExpiryData?.restrictCalendar &&
				validateExpiryData?.isExpired
			) {
				message.info('Subscription expired. Please renew to delete events.');
				return updateSubscriptionState({
					expiredSubscriptionModal: true,
					expiredSubscriptionType: 'Events',
				});
			}

			if (!selectedEvent?.id) {
				setInfo((prev) => ({ ...prev, error: 'No event selected' }));
				message.error('No event selected');
				return;
			}

			if (!deleteCalendarEvent) {
				throw new Error('Delete function not available');
			}

			setInfo((prev) => ({ ...prev, deleting: true, error: null }));
			await deleteCalendarEvent(selectedEvent.id);
			filterDeletedEvent(selectedEvent.id);
			message.success('Event deleted successfully');
			modifiedOnClose();
		} catch (error) {
			const errorMessage =
				error.message === 'Unauthorized access'
					? 'Please log in again'
					: error.message === 'Event not found'
					? 'Event no longer exists'
					: error.message.includes('Failed to fetch')
					? 'Cannot connect to server. Please check your network or API settings.'
					: 'Failed to delete event. Please try again.';
			setInfo((prev) => ({
				...prev,
				error: errorMessage,
			}));
			message.error(errorMessage);
		} finally {
			setInfo((prev) => ({ ...prev, deleting: false }));
		}
	}, [
		selectedEvent,
		deleteCalendarEvent,
		filterDeletedEvent,
		validateExpiryData,
		updateSubscriptionState,
		modifiedOnClose,
	]);

	const handleOpenDeleteModal = () => {
		setDeleteModal({ open: true });
	};

	const handleConfirmDelete = async () => {
		await deleteEvent();
		setDeleteModal({ open: false });
	};

	const handleCancelDelete = () => {
		setDeleteModal({ open: false });
	};

	const updateEventDetails = useCallback(
		(field, value) => {
			const updatedDetails = {
				...info.eventDetails,
				[field]: value,
			};

			setInfo((prev) => ({
				...prev,
				eventDetails: updatedDetails,
				error: null,
			}));

			debouncedUpdateEvent({
				eventId: selectedEvent?.id,
				field,
				value,
			});
		},
		[info.eventDetails, selectedEvent?.id, debouncedUpdateEvent],
	);

	const handleAddNewAttendee = (email) => {
		if (!email) return;

		const isDuplicate = info?.eventDetails?.attendees?.some(
			(attendee) => attendee.email.toLowerCase() === email.toLowerCase(),
		);

		if (isDuplicate) {
			message.error('This email is already added as an attendee');
			return;
		}

		const updatedAttendees = [
			...info.eventDetails.attendees,
			{
				email: email,
				name: email.split('@')[0],
				responseStatus: 'confirmed',
				isWorkspaceUser: false,
				tenantUserId: null,
			},
		];

		updateEventDetails('attendees', updatedAttendees);
		setNewAttendee('');
		setShowAddAttendee(false);
	};

	const componentMapper = useMemo(() => {
		return {
			location: (value) => (
				<CustomInput
					value={value}
					className="inputFeilds"
					onChange={(e) => {
						updateEventDetails('location', e.target?.value);
					}}
				/>
			),
			startDateTime: (value) => (
				<DateView
					value={moment(value).isValid() ? moment(value).unix() : null}
					showTime={true}
					onOptionClick={(value) => {
						const date = moment.unix(value);
						if (date.isValid()) {
							updateEventDetails('startDateTime', date.toISOString());
						}
					}}
					className="dateInput"
					format="MMMM DD, YYYY hh:mm A"
					title="Start Date"
				/>
			),
			endDateTime: (value) => (
				<DateView
					value={moment(value).isValid() ? moment(value).unix() : null}
					showTime={true}
					onOptionClick={(value) => {
						const date = moment.unix(value);
						if (date.isValid()) {
							updateEventDetails('endDateTime', date.toISOString());
						}
					}}
					className="dateInput"
					format="MMMM DD, YYYY hh:mm A"
					title="End Date"
				/>
			),
			meetingLink: (value) =>
				value ? (
					<span className="meetingLink">
						<CustomInput
							type="url"
							value={value}
							placeholder="Edit meeting link"
							className="inputFields"
							onChange={(e) => {
								updateEventDetails('meetingLink', e.target?.value);
							}}
						/>
						<a
							href={value}
							target="_blank"
							rel="noopener noreferrer"
							style={{ cursor: 'pointer', fontSize: 7 }}
						>
							🔗
						</a>
					</span>
				) : (
					<CustomInput
						type="url"
						value={value}
						placeholder="Add meeting link"
						className="inputFields"
						onChange={(e) => {
							updateEventDetails('meetingLink', e.target?.value);
						}}
					/>
				),
			calendarCategory: (value) => (
				<CategorySelector
					value={value}
					options={categoryList}
					onChange={(selectedOption) => {
						updateEventDetails('calendarCategory', selectedOption);
					}}
					className="categorySelector"
				/>
			),
			attendees: (value) => (
				<div className="attendees-container">
					<AttendeeSelector
						className="attendeeSelector"
						value={
							Array.isArray(value)
								? value.map((v) => ({
										tenantUserId: v?.tenantUserId || v?._id || v?.id || null,
										email: v?.email,
										name: v?.name,
										responseStatus: v?.responseStatus || 'confirmed',
										isWorkspaceUser: Boolean(
											v?.tenantUserId || v?._id || v?.id,
										),
										role: v?.role || null,
								  }))
								: []
						}
						options={tenantsUserList}
						onChange={(value) => {
							updateEventDetails('attendees', value);
						}}
						mode="multiple"
					/>
				</div>
			),
			status: (value) => (
				<CustomInput
					value={value}
					className="inputFeilds"
					readOnly={true}
					onChange={() => {}}
				/>
			),
			source: (value) => (
				<CustomInput
					value={value?.type}
					className="inputFeilds"
					readOnly={true}
					onChange={() => {}}
				/>
			),
			phone: (value) => (
				<PhoneInput
					placeholder="Enter phone number"
					value={value}
					onChange={(phoneValue) => {
						updateEventDetails('phone', phoneValue);
					}}
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
				/>
			),
			organizer: (value) => (
				<CustomInput
					value={value?.name || value || '-'}
					className="inputFeilds"
					readOnly={true}
					onChange={() => {}}
				/>
			),
			createdAt: (value) => {
				const date = moment(value);
				const formattedDate = date.isValid() ? date.format('DD-MM-YYYY hh:mm A') : '-';
				return (
					<CustomInput
						value={formattedDate}
						className="inputFeilds"
						readOnly={true}
						onChange={() => {}}
					/>
				);
			},
			updatedAt: (value) => {
				const date = moment(value);
				const formattedDate = date.isValid() ? date.format('DD-MM-YYYY hh:mm A') : '-';
				return (
					<CustomInput
						value={formattedDate}
						className="inputFeilds"
						readOnly={true}
						onChange={() => {}}
					/>
				);
			},
		};
	}, [categoryList, updateEventDetails, tenantsUserList, showAddAttendee, newAttendee]);

	const { validKeys } = useMemo(() => {
		const validKeys = info?.eventKeys?.filter((key) => componentMapper[key]) || [];
		return { validKeys };
	}, [info?.eventKeys, componentMapper]);

	const handleMouseDown = (e) => {
		mouseXPosition.current = e.clientX;
		document?.addEventListener('mousemove', handleMouseMove);
		document?.addEventListener('mouseup', handleMouseUp);
	};

	const handleMouseMove = (e) => {
		if (!resizableContainerRef.current) return;
		const deltaX = mouseXPosition.current - e.clientX;
		let newWidth = resizableContainerRef.current.offsetWidth + deltaX;

		const minWidth = 450; // Minimum width in pixels
		const maxWidth = window.innerHeight * 1.0; // Maximum width (75vh) in pixels

		if (newWidth < minWidth) {
			newWidth = minWidth;
		} else if (newWidth > maxWidth) {
			newWidth = maxWidth;
		}

		requestAnimationFrame(() => {
			resizableContainerRef.current.style.width = `${newWidth}px`;
		});
		mouseXPosition.current = e.clientX;
	};

	const handleMouseUp = () => {
		document?.removeEventListener('mousemove', handleMouseMove);
		document?.removeEventListener('mouseup', handleMouseUp);
	};

	return (
		<Drawer
			onClose={modifiedOnClose}
			width="auto"
			open={isEventSelected}
			styles={styles}
			placement="right"
			closable={false}
			className="event-details-drawer"
		>
			<div
				className="eventDetailsDrawerParentCOntainer"
				ref={resizableContainerRef}
				style={{ width: window.innerWidth >= 1440 ? '460px' : '400px' }}
			>
				<div className="drag-handler" onMouseDown={handleMouseDown} />
				<div className="innerContainer">
					{info?.loading || info?.fetching ? (
						<div className="loadingContainer">
							<Spinner />
							<div>Hang tight! Your event details are on their way...</div>
						</div>
					) : (
						<>
							<div className="drawer-header">
								<div className="header-content">
									<div className="left-container">
										<CloseSvg
											width={20}
											height={20}
											onClick={modifiedOnClose}
											style={{ cursor: 'pointer' }}
										/>
									</div>
									<div className="headerActions">
										{/* <div className="action-btn">
											<Share width={20} height={20} />
										</div> */}
										{info?.deleting ? (
											<Spinner width={18} height={18} color="#7d7d7d" />
										) : (
											<Delete
												width={20}
												height={20}
												className="deleteIcon"
												onClick={handleOpenDeleteModal}
											/>
										)}
									</div>
								</div>
							</div>
							<div className="content-container">
								<div className="headerWrapper">
									<CustomTextArea
										value={info?.eventDetails?.title}
										onChange={(e) => {
											updateEventDetails('title', e.target?.value);
										}}
										autoResize={true}
									/>
									<CustomTextArea
										value={info?.eventDetails?.description}
										onChange={(e) => {
											updateEventDetails('description', e.target?.value);
										}}
										style={{ fontSize: 15, color: 'var(--secondary-font)' }}
										autoResize={true}
										placeholder="Description..."
									/>
								</div>
								<div className="attendeesSection">
									<div className="attendeesTitle" style={{ marginBottom: '8px' }}>
										Attendees
									</div>
									<div className="attendeesValue">
										{componentMapper?.attendees(info?.eventDetails?.attendees)}
										<div className="attendeesList">
											{info?.eventDetails?.attendees?.map(
												(attendee, index) => (
													<div key={index} className="attendee-item">
														<span>
															{attendee.email}{' '}
															{attendee.role
																? `(${attendee.role})`
																: ''}
														</span>
														<button
															onClick={() =>
																handleRemoveAttendee(index)
															}
															title="Remove attendee"
														>
															×
														</button>
													</div>
												),
											)}
										</div>
									</div>
								</div>
								<div className="eventDetailsWrapper">
									<h1 className="eventDetailsTitle">Event Details</h1>
									{validKeys
										?.filter(
											(key) =>
												key !== 'attendees' &&
												![
													'createdAt',
													'organizer',
													'updatedAt',
													'status',
													'source',
												].includes(key),
										)
										?.sort((a, b) => {
											const order = [
												'calendarCategory',
												'startDateTime',
												'endDateTime',
												'meetingLink',
												'location',
												'phone',
											];
											return order.indexOf(a) - order.indexOf(b);
										})
										?.map((key) => (
											<div className="eventDetailsRow" key={key}>
												<span className="eventKey">
													{key === 'location' && (
														<Location width={16} height={16} />
													)}
													{key === 'phone' && (
														<Call width={16} height={21} />
													)}
													{key === 'meetingLink' && (
														<Link width={16} height={16} />
													)}
													{key === 'status' && (
														<Status width={16} height={16} />
													)}
													{key}
												</span>
												<span className="eventValue">
													{componentMapper?.[key](
														info?.eventDetails?.[key],
													)}
												</span>
											</div>
										))}
								</div>
								<div className="eventInfoWrapper">
									<div className="timestamp-div">
										<div className="timestamp-cell">
											<div className="timestamp-item">
												<span className="timestamp-label">Created at</span>
												<span className="timestamp-value">
													{componentMapper?.createdAt(
														info?.eventDetails?.createdAt,
													)}
												</span>
												{/* <span className="timestamp-assignee">
													{componentMapper?.organizer(
														info?.eventDetails?.organizer,
													)}
												</span> */}
											</div>
											<div className="timestamp-item">
												<span className="timestamp-label">Organizer</span>
												<span className="timestamp-value">
													{componentMapper?.organizer(
														info?.eventDetails?.organizer,
													)}
												</span>
											</div>
											<div className="timestamp-item">
												<span className="timestamp-label">Updated at</span>
												<span className="timestamp-value">
													{componentMapper?.updatedAt(
														info?.eventDetails?.updatedAt,
													)}
												</span>
												{/* <span className="timestamp-assignee">
													{info?.eventDetails?.updatedBy?.name || '-'}
												</span> */}
											</div>
											<div className="timestamp-item">
												<span className="timestamp-label">Source</span>
												<span className="timestamp-value">
													{componentMapper?.source(
														info?.eventDetails?.source,
													)}
												</span>
											</div>
											<div className="timestamp-item">
												<span className="timestamp-label">Status</span>
												<span className="timestamp-value">
													{componentMapper?.status(
														info?.eventDetails?.status,
													)}
												</span>
											</div>
										</div>
									</div>
								</div>
								{info?.error && (
									<div
										className="errorMessage"
										style={{ color: 'red', marginTop: '10px' }}
									>
										{info.error}
									</div>
								)}
							</div>
						</>
					)}
				</div>
			</div>

			<DeleteFormModal
				isOpen={deleteModal.open}
				onClose={handleCancelDelete}
				onConfirm={handleConfirmDelete}
				title="Delete Event?"
				itemType="event"
				description="Are you sure you want to delete this event?"
				warning="This event will be permanently removed and cannot be recovered."
			/>
		</Drawer>
	);
};

export default memo(EventDetailsModal);

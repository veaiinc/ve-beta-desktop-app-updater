import React, { memo, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import '../../../../assets/scss/calendar/modal/eventDetailsModal.scss';
import CustomInput from '../../../components/globalComponents/CustomInput';
import CustomTextArea from '../../../components/globalComponents/CustomTextArea';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/tasks/doubleRightArrow.svg';
import { ReactComponent as Arrow } from '../../../../assets/svg/calendar/down.svg';
import { ReactComponent as Delete } from '../../../../assets/svg/tasks/dustBin.svg';
import CategorySelector from '../../calendar/CategorySelector';
import AttendeeSelector from '../../calendar/AttendeeSelector';
import DateView from '../../tasks/listView/DateView.jsx';
import Spinner from '../../../components/loaders/Spinner';
import Context from '../../../../context/context';
import { Drawer } from 'antd';
import moment from 'moment';

const initialState = {
	loading: false, // TODO: use on fetching event details
	deleting: false,
	detailsExpanded: true,
	eventDetails: null,
	eventKeys: ['locationAdrress', 'locationPincode'],
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
		calendarInfo: { updateCalendarEvent, deleteCalendarEvent },
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
		companyInfo: { tenantsUserList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		...initialState,
	});

	// Add debounce ref
	const updateEventDebounceRef = useRef(null);

	useEffect(() => {
		if (selectedEvent) {
			setInfo((prev) => ({
				...prev,
				eventDetails: selectedEvent,
				eventKeys: [...initialState?.eventKeys, ...Object?.keys(selectedEvent)],
			}));
		}
	}, [selectedEvent]);

	useEffect(() => {
		return () => {
			setInfo({
				...initialState,
			});
		};
	}, []);

	const debouncedUpdateEvent = useCallback(
		(eventData) => {
			if (updateEventDebounceRef.current) {
				clearTimeout(updateEventDebounceRef.current);
			}

			updateEventDebounceRef.current = setTimeout(async () => {
				if (validateExpiryData?.isExpired) {
					return updateSubscriptionState({ expiredSubscriptionModal: true });
				}
				try {
					const { eventId, field, value } = eventData;
					// Create an object with only the changed field
					const updateBody = {
						[field]: value,
					};

					await updateCalendarEvent(eventId, updateBody);
					updateCalenderEventsList(eventId, updateBody);
				} catch (error) {
					console.error('Failed to update event:', error);
				}
			}, 800);
		},
		[updateCalendarEvent, validateExpiryData?.isExpired, updateSubscriptionState],
	);

	const deleteEvent = useCallback(async () => {
		if (validateExpiryData?.isExpired) {
			return updateSubscriptionState({ expiredSubscriptionModal: true });
		}
		if (selectedEvent?.id) {
			setInfo((prev) => ({ ...prev, deleting: true }));
			await deleteCalendarEvent(selectedEvent?.id);
			setInfo((prev) => ({ ...prev, deleting: false }));

			filterDeletedEvent(selectedEvent?.id);
			modifiedOnClose();
		}
	}, [selectedEvent]);

	const updateEventDetails = useCallback(
		(field, value) => {
			const updatedDetails = {
				...info.eventDetails,
				[field]: value,
			};

			setInfo((prev) => ({
				...prev,
				eventDetails: updatedDetails,
			}));
			// Call the debounced update function with only the changed field
			debouncedUpdateEvent({
				eventId: selectedEvent?.id,
				field,
				value,
			});
		},
		[info.eventDetails, selectedEvent?.id, debouncedUpdateEvent],
	);

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
					value={moment(value).unix()}
					showTime={true}
					onOptionClick={(value) => {
						updateEventDetails('startDateTime', moment.unix(value).toISOString());
					}}
					className="dateInput"
					format="MMMM DD, YYYY hh:mm A"
				/>
			),
			endDateTime: (value) => (
				<DateView
					value={moment(value).unix()}
					showTime={true}
					onOptionClick={(value) => {
						updateEventDetails('endDateTime', moment.unix(value).toISOString());
					}}
					className="dateInput"
					format="MMMM DD, YYYY hh:mm A"
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
					onChange={(value) => {
						updateEventDetails('calendarCategory', value);
					}}
					className="categorySelector"
				/>
			),
			attendees: (value) => (
				<AttendeeSelector
					className="attendeeSelector"
					value={value}
					options={tenantsUserList}
					onChange={(value) => {
						updateEventDetails('attendees', value);
					}}
				/>
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
				<CustomInput
					type="tel"
					value={value}
					className="inputFeilds"
					onChange={(e) => {
						updateEventDetails('phone', e.target?.value);
					}}
				/>
			),
			organizer: (value) => (
				<CustomInput defaultValue={value} className="inputFeilds" readOnly={true} />
			),
			createdAt: (value) => {
				const createdAt = moment.unix(value).format('DD-MM-YYYY hh:mm A').toString();
				return (
					<CustomInput defaultValue={createdAt} className="inputFeilds" readOnly={true} />
				);
			},
			updatedAt: (value) => {
				const updatedAt = moment.unix(value).format('DD-MM-YYYY hh:mm A').toString();
				return (
					<CustomInput defaultValue={updatedAt} className="inputFeilds" readOnly={true} />
				);
			},
		};
	}, [categoryList, updateEventDetails, tenantsUserList]);

	const { validKeys, visibleKeys } = useMemo(() => {
		const validKeys = info?.eventKeys?.filter((key) => componentMapper[key]) || [];
		const visibleKeys = info?.detailsExpanded ? validKeys : validKeys?.slice(0, 5);
		return { validKeys, visibleKeys };
	}, [info?.eventKeys, info?.detailsExpanded, componentMapper]);

	const modifiedOnClose = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			...initialState,
		}));
		onClose();
	}, [onClose]);

	return (
		<Drawer
			onClose={modifiedOnClose}
			width={450}
			open={isEventSelected}
			style={{ padding: '0px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
		>
			{info?.loading ? (
				<div className="eventDetailsDrawerParentCOntainer">
					<div className="innerContainer">
						<div className="loadingContainer">
							<Spinner />
							<div>Hang tight! Your event details are on their way...</div>
						</div>
					</div>
				</div>
			) : (
				<div className="eventDetailsDrawerParentCOntainer">
					<div className="innerContainer">
						{/* Event Header */}
						<div className="eventHeader">
							<CloseSvg
								width={16}
								height={16}
								onClick={() => {
									modifiedOnClose();
									setInfo((prev) => ({
										...prev,
										detailsExpanded: false,
									}));
								}}
								style={{ cursor: 'pointer' }}
							/>

							<div className="eventTitle">Event Details</div>

							{info?.deleting ? (
								<Spinner width={18} height={18} color="#7d7d7d" />
							) : (
								<Delete
									width={20}
									height={20}
									className="deleteIcon"
									onClick={deleteEvent}
								/>
							)}
						</div>

						{/* Event Title */}
						<CustomTextArea
							value={info?.eventDetails?.title}
							onChange={(e) => {
								updateEventDetails('title', e.target?.value);
							}}
							autoResize={true}
						/>

						{/* Event Details */}
						<div className="eventDetailsWrapper">
							{validKeys?.map((key) => (
								<div
									className={`eventDetailsRow ${
										visibleKeys?.includes(key) ? 'visible' : 'hidden'
									}`}
									key={key}
								>
									<span className="eventKey">{key}</span>
									<span className="eventValue">
										{componentMapper?.[key](info?.eventDetails?.[key])}
									</span>
								</div>
							))}

							<span
								onClick={() =>
									setInfo((prev) => ({
										...prev,
										detailsExpanded: !prev?.detailsExpanded,
									}))
								}
								className="expandBtn"
							>
								<Arrow
									style={{
										width: 10,
										height: 10,
										transform: info?.detailsExpanded
											? 'rotate(180deg)'
											: 'rotate(0deg)',
										transition: 'transform 0.4s ease',
									}}
								/>
								<span className="show">
									{info?.detailsExpanded ? 'Show Less' : 'Show More'}
								</span>
							</span>
						</div>

						{/* Event Description */}
						<CustomTextArea
							value={info?.eventDetails?.description}
							onChange={(e) => {
								updateEventDetails('description', e.target?.value);
							}}
							style={{ fontSize: 15 }}
							autoResize={true}
							placeholder="Description..."
						/>
					</div>
				</div>
			)}
		</Drawer>
	);
};

export default memo(EventDetailsModal);

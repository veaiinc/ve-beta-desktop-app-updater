import React, { memo, useState, useCallback, useContext, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../assets/scss/scheduler/editScheduler.scss';
import { ReactComponent as Back } from '../../../assets/svg/subscription/back.svg';
import { ReactComponent as DateSvg } from '../../../assets/svg/calendar/date.svg';
import { ReactComponent as DownArrow } from '../../../assets/svg/activity/down.svg';
import { ReactComponent as Down } from '../../../assets/svg/calendar/down.svg';
import SessionInfoCard from '../../components/scheduler/SessionInfoCard';
import { Tooltip, DatePicker } from 'antd';
import dayjs from 'dayjs';
import InputComponent from '../../components/ai_assistant/InputComponent';
import { ReactComponent as Clock } from '../../../assets/svg/workflow/clock.svg';
import { ReactComponent as Duplicate } from '../../../assets/svg/tasks/duplicate.svg';
import Context from '../../../context/context';

const durationOptions = ['30 Minutes', '45 Minutes', '60 Minutes', '90 Minutes', '120 Minutes'];
const sessionTypeOptions = ['In Person', 'Phone Call', 'Video Call'];

const sessionTypeInputConfig = {
	'In Person': {
		value: 'location',
		tag: 'Location',
		type: 'text',
		placeholder: 'Enter location',
	},
	'Phone Call': {
		value: 'phoneNumber',
		tag: 'Phone Number',
		type: 'tel',
		placeholder: 'Enter phone number',
	},
	'Video Call': {
		value: 'videoLink',
		tag: 'Platform Link',
		type: 'url',
		placeholder: 'Enter video call link',
	},
};

const EditScheduler = () => {
	const {
		calendarInfo: { getSchedulerSessionDetail, updateSchedulerSession, sessionDetail },
	} = useContext(Context);

	const { sessionId } = useParams();
	const navigate = useNavigate();
	const updateTimeoutRef = useRef(null);
	const availabilityUpdateTimeoutRef = useRef(null);

	const [info, setInfo] = useState({
		sessionDetail: null,
		startTime: dayjs(), // Default start time
		endTime: dayjs().add(7, 'day'), // Default end time
		duration: '30 Minutes',
		isDurationOpen: false,
		sessionDescription: '',
		addDescription: false,
		sessionType: 'In Person',
		sessionTypeOpen: false,
		location: '',
		phoneNumber: '',
		videoLink: '',

		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		maxParticipants: 1,
		allowRescheduling: true,
		allowCanceling: true,
		minCancelNotice: 30,
		minBookingNotice: 15,
		maxBookingAdvance: 5,
		maxBookingsPerSession: 1,
		preparationInstructions: '',
		weeklyAvailability: {
			MON: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
			TUE: { enabled: false, slots: [] },
			WED: { enabled: false, slots: [] },
			THU: { enabled: false, slots: [] },
			FRI: { enabled: false, slots: [] },
			SAT: { enabled: false, slots: [] },
			SUN: { enabled: false, slots: [] },
		},
		bookingPeriod: 'Day',
		timeout: null,
	});

	// Add a ref to track the previous state
	const previousStateRef = useRef(null);

	useEffect(() => {
		if (sessionId) {
			getSchedulerSessionDetail(sessionId);
		}
	}, [sessionId]);

	useEffect(() => {
		if (sessionDetail) {
			// Map days of week to short form
			const dayMapping = {
				Monday: 'MON',
				Tuesday: 'TUE',
				Wednesday: 'WED',
				Thursday: 'THU',
				Friday: 'FRI',
				Saturday: 'SAT',
				Sunday: 'SUN',
			};

			// Initialize weekly availability with empty slots
			const weeklyAvailability = {
				MON: { enabled: false, slots: [] },
				TUE: { enabled: false, slots: [] },
				WED: { enabled: false, slots: [] },
				THU: { enabled: false, slots: [] },
				FRI: { enabled: false, slots: [] },
				SAT: { enabled: false, slots: [] },
				SUN: { enabled: false, slots: [] },
			};

			// Map availability slots if they exist
			if (sessionDetail.availabilitySlots && sessionDetail.availabilitySlots.length > 0) {
				sessionDetail.availabilitySlots?.forEach((slot) => {
					const day = dayMapping[slot.dayOfWeek];
					if (day) {
						weeklyAvailability[day] = {
							enabled: true,
							slots: slot.timeRanges?.map((range) => ({
								start: range.startTime,
								end: range.endTime,
							})),
						};
					}
				});
			} else {
				// If no slots exist, set default for Monday
				weeklyAvailability.MON = {
					enabled: true,
					slots: [
						{
							start: dayjs().format('HH:mm'),
							end: dayjs().add(30, 'minute').format('HH:mm'),
						},
					],
				};
			}

			// Map session type
			let sessionType = 'In Person';
			let location = '';
			let phoneNumber = '';
			let videoLink = '';

			if (sessionDetail.sessionTypeInfo) {
				switch (sessionDetail.sessionTypeInfo.sessionType.toLowerCase()) {
					case 'virtual':
						sessionType = 'Video Call';
						videoLink = sessionDetail.sessionTypeInfo.meetingLink || '';
						break;
					case 'phone':
						sessionType = 'Phone Call';
						phoneNumber = sessionDetail.sessionTypeInfo.phone || '';
						break;
					case 'in person':
					case 'in_person':
						sessionType = 'In Person';
						location = sessionDetail.sessionTypeInfo.location || '';
						break;
					default:
						sessionType = sessionDetail.sessionTypeInfo.sessionType || 'In Person';
						location = sessionDetail.sessionTypeInfo.location || '';
				}
			}

			setInfo((prev) => ({
				...prev,
				startTime: dayjs(sessionDetail.sessionWindow?.startDate || new Date()),
				endTime: dayjs(sessionDetail.sessionWindow?.endDate || new Date()),
				duration: `${sessionDetail.sessionDuration?.unitCount || 30} ${
					(sessionDetail.sessionDuration?.unitType || 'minutes').charAt(0).toUpperCase() +
					(sessionDetail.sessionDuration?.unitType || 'minutes').slice(1)
				}`,
				sessionDescription: sessionDetail.sessionDescription || '',
				addDescription: !!sessionDetail.sessionDescription,
				sessionType,
				location,
				phoneNumber,
				videoLink,
				timezone: sessionDetail.sessionTimezone || prev.timezone,
				maxParticipants: sessionDetail.sessionMetadata?.maxParticipants || 1,
				allowRescheduling: sessionDetail.bookingRules?.allowRescheduling ?? true,
				allowCanceling: sessionDetail.bookingRules?.allowCanceling ?? true,
				minCancelNotice:
					sessionDetail.bookingRules?.cancellationPolicy?.minCancelNotice?.unitCount ||
					30,
				minBookingNotice:
					sessionDetail.availabilityRules?.minBookingNotice?.unitCount || 15,
				maxBookingAdvance:
					sessionDetail.availabilityRules?.maxBookingAdvance?.unitCount || 5,
				maxBookingsPerSession: sessionDetail.availabilityRules?.maxBookingsPerSession || 1,
				preparationInstructions:
					sessionDetail.sessionMetadata?.preparationInstructions || '',
				weeklyAvailability,
				bookingPeriod: 'Day',
				sessionDetail,
			}));
		}
	}, [sessionDetail]);

	useEffect(() => {
		return () => {
			setInfo((prev) => ({
				...prev,
				sessionDetail: null,
			}));
		};
	}, []);

	// Function to handle start date change
	const handleStartDateChange = (value) => {
		setInfo((prev) => {
			// If selected start date is after current end date, reset end date
			if (prev.endTime && value && value.isAfter(prev.endTime)) {
				return {
					...prev,
					startTime: value,
					endTime: null,
				};
			}
			return {
				...prev,
				startTime: value,
			};
		});
	};

	// Function to handle end date change
	const handleEndDateChange = (value) => {
		setInfo((prev) => {
			// If selected end date is before current start date, reset start date
			if (prev.startTime && value && value.isBefore(prev.startTime)) {
				return {
					...prev,
					startTime: null,
					endTime: value,
				};
			}
			return {
				...prev,
				endTime: value,
			};
		});
	};

	const handleSessionTypeChange = useCallback((type) => {
		setInfo((prev) => ({
			...prev,
			sessionType: type,
			sessionTypeOpen: false,
			location: '',
			phoneNumber: '',
			videoLink: '',
		}));
	}, []);

	const renderSessionTypeInput = () => {
		const config = sessionTypeInputConfig[info.sessionType];
		return (
			<InputComponent
				type={config.type}
				value={info[config.value]}
				onChange={(e) =>
					setInfo((prev) => ({
						...prev,
						[config.value]: e.target.value,
					}))
				}
				placeholder={config.placeholder}
				className="inputHeight"
			/>
		);
	};

	// Function to get changed fields between two states
	const getChangedFields = (currentState, previousState) => {
		if (!previousState) return currentState;

		const changes = {};

		// Helper function to check if two values are different
		const isDifferent = (val1, val2) => {
			if (typeof val1 !== typeof val2) return true;
			if (typeof val1 === 'object' && val1 !== null) {
				return JSON.stringify(val1) !== JSON.stringify(val2);
			}
			return val1 !== val2;
		};

		// Check each field for changes
		Object.entries(currentState).forEach(([key, value]) => {
			if (key === 'sessionDetail' || key === 'timeout') return; // Skip internal fields

			if (isDifferent(value, previousState[key])) {
				changes[key] = value;
			}
		});

		return changes;
	};

	// Function to transform weekly availability to API format
	const transformWeeklyAvailabilityToApi = (weeklyAvailability) => {
		const dayMapping = {
			MON: 'Monday',
			TUE: 'Tuesday',
			WED: 'Wednesday',
			THU: 'Thursday',
			FRI: 'Friday',
			SAT: 'Saturday',
			SUN: 'Sunday',
		};

		// Include all days in the payload
		return Object.entries(weeklyAvailability)?.map(([day, value]) => ({
			dayOfWeek: dayMapping[day],
			// If day is enabled, include its slots, otherwise send empty array
			timeRanges: value.enabled
				? value.slots?.map((slot) => ({
						startTime: slot.start,
						endTime: slot.end,
				  }))
				: [],
		}));
	};

	// Function to prepare update payload with only changed fields
	const prepareUpdatePayload = (currentInfo, changedFields) => {
		const payload = {};

		// Map changed fields to API payload format
		Object.entries(changedFields).forEach(([key, value]) => {
			switch (key) {
				case 'sessionType':
					payload.sessionType = value.toLowerCase().replace(' ', '_');
					payload.sessionTypeInfo = {
						sessionType: value.toLowerCase().replace(' ', '_'),
						...(value === 'In Person' && { location: currentInfo.location }),
						...(value === 'Phone Call' && { phone: currentInfo.phoneNumber }),
						...(value === 'Video Call' && { meetingLink: currentInfo.videoLink }),
					};
					break;

				case 'duration':
					payload.sessionDuration = {
						unitCount: parseInt(value),
						unitType: 'minutes',
					};
					break;

				case 'startTime':
				case 'endTime':
					payload.sessionWindow = {
						type: 'fixed_date_range',
						startDate: currentInfo.startTime.toISOString(),
						endDate: currentInfo.endTime.toISOString(),
					};
					break;

				case 'maxBookingsPerSession':
				case 'minBookingNotice':
				case 'maxBookingAdvance':
					payload.availabilityRules = {
						...payload.availabilityRules,
						[key]:
							key === 'maxBookingsPerSession'
								? value
								: {
										unitCount: value,
										unitType: key === 'minBookingNotice' ? 'minutes' : 'days',
								  },
					};
					break;

				case 'allowRescheduling':
				case 'allowCanceling':
				case 'minCancelNotice':
					payload.bookingRules = {
						...payload.bookingRules,
						[key]: value,
						...(key === 'allowCanceling' &&
							value && {
								cancellationPolicy: {
									minCancelNotice: {
										unitCount: currentInfo.minCancelNotice,
										unitType: 'minutes',
									},
								},
							}),
					};
					break;

				case 'maxParticipants':
				case 'preparationInstructions':
					payload.sessionMetadata = {
						...payload.sessionMetadata,
						[key]: value,
					};
					break;

				case 'timezone':
					payload.sessionTimezone = value;
					break;

				default:
					// Skip fields that aren't part of the API schema
					break;
			}
		});

		return payload;
	};

	// Function to handle debounced update
	const handleDebouncedUpdate = useCallback(() => {
		if (updateTimeoutRef.current) {
			clearTimeout(updateTimeoutRef.current);
		}

		const timeout = setTimeout(() => {
			if (sessionId && info.sessionDetail) {
				const changedFields = getChangedFields(info, previousStateRef.current);
				if (Object.keys(changedFields).length > 0) {
					const payload = prepareUpdatePayload(info, changedFields);
					// Only call API if there are valid changes
					if (Object.keys(payload)?.length > 0) {
						updateSchedulerSession(sessionId, payload);
						previousStateRef.current = { ...info };
					}
				}
			}
		}, 800);

		updateTimeoutRef.current = timeout;
	}, [sessionId, info.sessionDetail]);

	// Separate function to handle availability updates
	const handleAvailabilityUpdate = useCallback(() => {
		if (availabilityUpdateTimeoutRef.current) {
			clearTimeout(availabilityUpdateTimeoutRef.current);
		}

		const timeout = setTimeout(() => {
			if (sessionId && info.sessionDetail) {
				const availabilitySlots = transformWeeklyAvailabilityToApi(info.weeklyAvailability);
				// Only call API if there are enabled slots
				if (availabilitySlots.length > 0) {
					const payload = {
						availabilitySlots,
					};
					updateSchedulerSession(sessionId, payload);
				}
			}
		}, 800);

		availabilityUpdateTimeoutRef.current = timeout;
	}, [sessionId, info.weeklyAvailability]);

	// Update effect to trigger availability update
	useEffect(() => {
		// Only trigger update if there are actual changes in weeklyAvailability
		const hasChanges = Object.entries(info.weeklyAvailability).some(([day, value]) => {
			const prevValue = previousStateRef.current?.weeklyAvailability[day];
			return JSON.stringify(value) !== JSON.stringify(prevValue);
		});

		if (hasChanges) {
			handleAvailabilityUpdate();
			previousStateRef.current = { ...info };
		}

		return () => {
			if (availabilityUpdateTimeoutRef.current) {
				clearTimeout(availabilityUpdateTimeoutRef.current);
			}
		};
	}, [info.weeklyAvailability, handleAvailabilityUpdate]);

	// Modify the weekly availability handlers to work with both new and existing sessions
	const handleWeeklyAvailabilityChange = (day, enabled) => {
		setInfo((prev) => {
			const newInfo = {
				...prev,
				weeklyAvailability: {
					...prev.weeklyAvailability,
					[day]: {
						enabled,
						// If enabling and no slots exist, add default slot
						slots:
							enabled && prev.weeklyAvailability[day].slots.length === 0
								? [{ start: '09:00', end: '17:00' }]
								: prev.weeklyAvailability[day].slots,
					},
				},
			};
			return newInfo;
		});
	};

	const handleTimeSlotChange = (day, index, field, value) => {
		setInfo((prev) => {
			const newSlots = [...prev.weeklyAvailability[day].slots];
			newSlots[index] = {
				...newSlots[index],
				[field]: value,
			};
			return {
				...prev,
				weeklyAvailability: {
					...prev.weeklyAvailability,
					[day]: {
						...prev.weeklyAvailability[day],
						slots: newSlots,
					},
				},
			};
		});
	};

	const handleAddTimeSlot = (day) => {
		setInfo((prev) => {
			const newSlots = [
				...prev.weeklyAvailability[day].slots,
				{ start: '00:00', end: '00:00' },
			];
			return {
				...prev,
				weeklyAvailability: {
					...prev.weeklyAvailability,
					[day]: {
						...prev.weeklyAvailability[day],
						slots: newSlots,
					},
				},
			};
		});
	};

	const handleRemoveTimeSlot = (day, index) => {
		setInfo((prev) => {
			const newSlots = [...prev.weeklyAvailability[day].slots];
			newSlots.splice(index, 1);
			return {
				...prev,
				weeklyAvailability: {
					...prev.weeklyAvailability,
					[day]: {
						...prev.weeklyAvailability[day],
						slots: newSlots,
					},
				},
			};
		});
	};

	const handleCopyTimeSlot = (day, index) => {
		setInfo((prev) => {
			const currentSlot = prev.weeklyAvailability[day].slots[index];
			const updatedAvailability = { ...prev.weeklyAvailability };

			// Copy the slot to all other days and enable them
			['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].forEach((d) => {
				if (d !== day) {
					// Check if the slot already exists to avoid duplicates
					const slotExists = prev.weeklyAvailability[d].slots.some(
						(slot) => slot.start === currentSlot.start && slot.end === currentSlot.end,
					);

					if (!slotExists) {
						updatedAvailability[d] = {
							enabled: true, // Enable the day when copying slot
							slots: [...prev.weeklyAvailability[d].slots, { ...currentSlot }],
						};
					}
				}
			});

			console.log('Updated availability:', updatedAvailability);

			return {
				...prev,
				weeklyAvailability: updatedAvailability,
			};
		});
	};

	console.log('weeklyAvailability', info.weeklyAvailability);

	return (
		<div className="editSchedulerParentContainer">
			<div className="editSchedulerHeader">
				<Back onClick={() => navigate(-1)} className="backArrow" />
				<SessionInfoCard sessionData={info?.sessionDetail} />
			</div>

			<div className="updateSessionDetails">
				<div className="sessionDurationContainer">
					<span>Session Duration Range</span>
					<div className="sessionDetailsRow">
						<div className="sessionInputWrapper">
							<span>From</span>
							<DatePicker
								format="DD MMM YYYY"
								allowClear
								showTime={false}
								value={info.startTime}
								onChange={handleStartDateChange}
								className="session-input"
								suffixIcon={<DateSvg />}
								disabledDate={(current) => {
									return (
										current &&
										(current.isBefore(dayjs().startOf('day')) ||
											(info.endTime && current.isAfter(info.endTime)))
									);
								}}
							/>
						</div>
						<div className="sessionInputWrapper">
							<span>To</span>
							<DatePicker
								format="DD MMM YYYY"
								allowClear
								showTime={false}
								value={info.endTime}
								onChange={handleEndDateChange}
								className="session-input"
								suffixIcon={<DateSvg />}
								disabledDate={(current) => {
									return (
										current &&
										current.isBefore(info.startTime || dayjs().startOf('day'))
									);
								}}
							/>
						</div>
						<div className="sessionInputWrapper">
							<span>Duration</span>
							<Tooltip
								placement="bottom"
								trigger="click"
								open={info.isDurationOpen}
								onOpenChange={(open) =>
									setInfo((prev) => ({
										...prev,
										isDurationOpen: open,
									}))
								}
								overlayClassName="duration-dropdown"
								title={
									<div className="duration-options">
										{durationOptions?.map((duration) => (
											<div
												key={duration}
												className="duration-item"
												onClick={() => {
													setInfo((prev) => ({
														...prev,
														duration,
														isDurationOpen: false,
													}));
												}}
											>
												{duration}
											</div>
										))}
									</div>
								}
								arrow={false}
								color={'transparent'}
								overlayStyle={{ minWidth: 'fit-content', padding: '0' }}
							>
								<div className="session-input duration-selector">
									{info.duration}
									<DownArrow className={info.isDurationOpen ? 'open' : ''} />
								</div>
							</Tooltip>
						</div>
					</div>

					<div className="updateSessionDesc">
						<div
							className={`addSessionDesc ${info?.addDescription ? 'hidden' : ''}`}
							onClick={() =>
								setInfo((prev) => ({
									...prev,
									addDescription: !prev.addDescription,
								}))
							}
						>
							Add Instruction
						</div>

						<div
							className={`sessionDescriptionWrapper ${
								info?.addDescription ? 'visible' : ''
							}`}
						>
							<InputComponent
								className="inputHeight"
								value={info?.sessionDescription}
								onChange={(e) =>
									setInfo((prev) => ({
										...prev,
										sessionDescription: e.target.value,
									}))
								}
								placeholder={'Session description'}
							/>
						</div>
					</div>

					<div className="sessionOptionContainer">
						<div className="sessionTypeWrapper">
							<span>Session Type</span>
							<Tooltip
								open={info?.sessionTypeOpen}
								onOpenChange={(visible) =>
									setInfo((prev) => ({
										...prev,
										sessionTypeOpen: visible,
									}))
								}
								placement="bottom"
								title={
									<div className="sessionType-dropdown">
										{sessionTypeOptions?.map((option) => (
											<div
												key={option}
												className="sessionType-dropdown-item"
												onClick={() => handleSessionTypeChange(option)}
											>
												{option}
											</div>
										))}
									</div>
								}
								arrow={false}
								trigger={'click'}
								color={'transparent'}
								overlayStyle={{ minWidth: 'fit-content', padding: '0' }}
							>
								<div className="typeOfSession-lable">
									{info?.sessionType}
									<Down className={`${info?.sessionTypeOpen ? 'open' : ''}`} />
								</div>
							</Tooltip>
						</div>
						<div className="sessionTypeWrapper">
							<span>{sessionTypeInputConfig[info?.sessionType]?.tag}</span>
							{renderSessionTypeInput()}
						</div>
					</div>
				</div>

				<div className="SessionAvailabilityContainer">
					<span className="availability-title">Session Availability</span>
					<div className="availability-content">
						<div className="timezone-info">
							<span>
								Timezone:{' '}
								{info?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}
							</span>
						</div>
						<div className="weekly-hours">
							<span className="weekly-title">WEEKLY HOURS</span>
							<div className="days-container">
								{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
									<div key={day} className="day-slot">
										<div className="day-header">
											<input
												type="checkbox"
												checked={info.weeklyAvailability[day].enabled}
												onChange={(e) =>
													handleWeeklyAvailabilityChange(
														day,
														e.target.checked,
													)
												}
											/>
											<span>{day}</span>
										</div>
										{info?.weeklyAvailability[day]?.enabled && (
											<div className="time-slots">
												{info?.weeklyAvailability[day]?.slots?.map(
													(slot, index) => (
														<React.Fragment key={index}>
															{index > 0 && <span>and</span>}
															<DatePicker
																showTime
																format="HH:mm"
																picker="time"
																className="timePicker"
																value={dayjs(slot.start, 'HH:mm')}
																onChange={(time) =>
																	handleTimeSlotChange(
																		day,
																		index,
																		'start',
																		time.format('HH:mm'),
																	)
																}
																suffixIcon={
																	<Clock width={16} height={16} />
																}
															/>
															<span>to</span>
															<DatePicker
																showTime
																format="HH:mm"
																picker="time"
																className="timePicker"
																value={dayjs(slot.end, 'HH:mm')}
																onChange={(time) =>
																	handleTimeSlotChange(
																		day,
																		index,
																		'end',
																		time.format('HH:mm'),
																	)
																}
																suffixIcon={
																	<Clock width={16} height={16} />
																}
															/>
															<div className="slot-actions">
																<Tooltip
																	title="Add another time slot"
																	placement="top"
																	color="#292b2e"
																	overlayInnerStyle={{
																		padding: '6px 12px',
																		fontSize: '12px',
																		fontFamily: 'Inter',
																	}}
																>
																	<div
																		className="add-slot"
																		onClick={() =>
																			handleAddTimeSlot(day)
																		}
																	>
																		+
																	</div>
																</Tooltip>
																{info?.weeklyAvailability[day]
																	?.slots?.length > 1 && (
																	<Tooltip
																		title="Remove time slot"
																		placement="top"
																		color="#292b2e"
																		overlayInnerStyle={{
																			padding: '6px 12px',
																			fontSize: '12px',
																			fontFamily: 'Inter',
																		}}
																	>
																		<div
																			className="add-slot"
																			onClick={() =>
																				handleRemoveTimeSlot(
																					day,
																					index,
																				)
																			}
																		>
																			-
																		</div>
																	</Tooltip>
																)}
																<Tooltip
																	title="Copy time slot to other enabled days"
																	placement="top"
																	color="#292b2e"
																	overlayInnerStyle={{
																		padding: '6px 12px',
																		fontSize: '12px',
																		fontFamily: 'Inter',
																	}}
																>
																	<div
																		className="copy-slot"
																		onClick={() =>
																			handleCopyTimeSlot(
																				day,
																				index,
																			)
																		}
																	>
																		<Duplicate />
																	</div>
																</Tooltip>
															</div>
														</React.Fragment>
													),
												)}
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="sessionBookingLimitContainer">
					<span className="booking-title">Booking Limits</span>
					<div className="booking-options">
						<div className="booking-option">
							<input
								type="checkbox"
								id="additional-attendees"
								checked={info.maxParticipants > 1}
								onChange={(e) =>
									setInfo((prev) => ({
										...prev,
										maxParticipants: e.target.checked ? 2 : 1,
									}))
								}
							/>
							<label htmlFor="additional-attendees">
								Allow guests to add additional attendees
							</label>
						</div>
						<div className="booking-option">
							<input
								type="checkbox"
								id="next-booking"
								checked={info.minBookingNotice > 0}
								onChange={(e) =>
									setInfo((prev) => ({
										...prev,
										minBookingNotice: e.target.checked ? 15 : 0,
									}))
								}
							/>
							<label htmlFor="next-booking">
								Don't let guests book in the next {info.minBookingNotice} minutes
							</label>
						</div>
						<div className="booking-option">
							<input
								type="checkbox"
								id="allow-reschedule"
								checked={info.allowRescheduling}
								onChange={(e) =>
									setInfo((prev) => ({
										...prev,
										allowRescheduling: e.target.checked,
									}))
								}
							/>
							<label htmlFor="allow-reschedule">Allow guests to reschedule</label>
						</div>
						<div className="booking-option">
							<input
								type="checkbox"
								id="allow-cancel"
								checked={info.allowCanceling}
								onChange={(e) =>
									setInfo((prev) => ({
										...prev,
										allowCanceling: e.target.checked,
									}))
								}
							/>
							<label htmlFor="allow-cancel">
								Allow guests to cancel (up to {info.minCancelNotice} minutes before)
							</label>
						</div>
						<div className="booking-limit-option">
							<div className="limit-input">
								<input
									type="checkbox"
									id="booking-limit"
									checked={info.maxBookingsPerSession > 0}
									onChange={(e) =>
										setInfo((prev) => ({
											...prev,
											maxBookingsPerSession: e.target.checked ? 1 : 0,
										}))
									}
								/>
								<label htmlFor="booking-limit">Only allow</label>
								<input
									type="number"
									value={info.maxBookingsPerSession}
									onChange={(e) =>
										setInfo((prev) => ({
											...prev,
											maxBookingsPerSession: parseInt(e.target.value) || 0,
										}))
									}
									className="number-input"
									min="1"
									disabled={!info.maxBookingsPerSession}
								/>
								<span>bookings per</span>
							</div>
							<Tooltip
								placement="bottom"
								trigger="click"
								overlayClassName="booking-period-dropdown"
								title={
									<div className="period-options">
										{['Day', 'Week', 'Month'].map((period) => (
											<div
												key={period}
												className="period-item"
												onClick={() =>
													setInfo((prev) => ({
														...prev,
														bookingPeriod: period.toLowerCase(),
													}))
												}
											>
												{period}
											</div>
										))}
									</div>
								}
								arrow={false}
								color={'transparent'}
								overlayStyle={{ minWidth: 'fit-content', padding: '0' }}
							>
								<div className="period-selector">
									{info.bookingPeriod || 'Day'}
									<Down />
								</div>
							</Tooltip>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(EditScheduler);

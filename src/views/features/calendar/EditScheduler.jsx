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
		maxBookingsPerSession: 5,
		preparationInstructions: '',
		weeklyAvailability: {
			MON: { enabled: true, slots: [{ start: '00:00', end: '00:00' }] },
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
	// Add debounce ref for session type input
	const sessionTypeInputTimeoutRef = useRef(null);

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
							enabled: slot.timeRanges && slot.timeRanges.length > 0,
							slots:
								slot.timeRanges?.map((range) => ({
									start: range.startTime,
									end: range.endTime,
								})) || [],
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
					case 'inperson':
						sessionType = 'In Person';
						location = sessionDetail.sessionTypeInfo.location || '';
						break;
					default:
						sessionType = 'In Person';
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

	// Update effect to trigger availability update
	useEffect(() => {
		// Only trigger update if there are actual changes in weeklyAvailability
		const hasChanges = Object.entries(info.weeklyAvailability)?.some(([day, value]) => {
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
	}, [info.weeklyAvailability]);

	useEffect(() => {
		return () => {
			setInfo((prev) => ({
				...prev,
				sessionDetail: null,
			}));
			// Cleanup previousStateRef
			previousStateRef.current = null;
		};
	}, []);

	useEffect(() => {
		return () => {
			if (sessionTypeInputTimeoutRef.current) {
				clearTimeout(sessionTypeInputTimeoutRef.current);
			}
		};
	}, []);

	// Initialize previousStateRef when sessionDetail is loaded
	useEffect(() => {
		if (sessionDetail) {
			previousStateRef.current = { ...info };
		}
	}, [sessionDetail]);

	// Add useEffect to trigger updates when relevant fields change
	useEffect(() => {
		// Only trigger update if there are actual changes in the monitored fields
		const monitoredFields = [
			'sessionType',
			'duration',
			'startTime',
			'endTime',
			'maxBookingsPerSession',
			'minBookingNotice',
			'maxBookingAdvance',
			'allowRescheduling',
			'allowCanceling',
			'minCancelNotice',
			'maxParticipants',
			'preparationInstructions',
			'timezone',
			'sessionDescription',
			'location',
			'phoneNumber',
			'videoLink',
		];

		const hasChanges = monitoredFields?.some((field) => {
			const currentValue = info[field];
			const previousValue = previousStateRef.current?.[field];

			// Special handling for dayjs objects
			if (field === 'startTime' || field === 'endTime') {
				return currentValue?.toISOString() !== previousValue?.toISOString();
			}

			return JSON.stringify(currentValue) !== JSON.stringify(previousValue);
		});

		if (hasChanges) {
			handleDebouncedUpdate();
		}
	}, [
		info.sessionType,
		info.duration,
		info.startTime,
		info.endTime,
		info.maxBookingsPerSession,
		info.minBookingNotice,
		info.maxBookingAdvance,
		info.allowRescheduling,
		info.allowCanceling,
		info.minCancelNotice,
		info.maxParticipants,
		info.preparationInstructions,
		info.timezone,
		info.sessionDescription,
		info.location,
		info.phoneNumber,
		info.videoLink,
	]);

	// Function to handle start date change
	const handleStartDateChange = useCallback(
		(value) => {
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

			// Update session window
			if (sessionId && info.sessionDetail) {
				const payload = {
					sessionWindow: {
						type: 'fixed_date_range',
						startDate: value.toISOString(),
						endDate: info.endTime?.toISOString(),
					},
				};
				updateSchedulerSession(sessionId, payload);
			}
		},
		[sessionId, info.sessionDetail, info.endTime],
	);

	// Function to handle end date change
	const handleEndDateChange = useCallback(
		(value) => {
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

			// Update session window
			if (sessionId && info.sessionDetail) {
				const payload = {
					sessionWindow: {
						type: 'fixed_date_range',
						startDate: info.startTime?.toISOString(),
						endDate: value.toISOString(),
					},
				};
				updateSchedulerSession(sessionId, payload);
			}
		},
		[sessionId, info.sessionDetail, info.startTime],
	);

	// Function to handle session type change
	const handleSessionTypeOption = useCallback((type) => {
		setInfo((prev) => ({
			...prev,
			sessionType: type,
			sessionTypeOpen: false,
			// Reset related fields when changing session type
			location: '',
			phoneNumber: '',
			videoLink: '',
		}));
	}, []);

	// Function to handle session type specific info changes
	const handleSessionTypeInput = useCallback(
		(field, value) => {
			if (!value) return; // Don't proceed if value is empty

			setInfo((prev) => ({
				...prev,
				[field]: value,
			}));

			// Map UI session types to API session types
			const sessionTypeMapping = {
				'Video Call': 'virtual',
				'Phone Call': 'phone',
				'In Person': 'inperson',
			};

			const apiSessionType = sessionTypeMapping[info.sessionType];
			if (!apiSessionType) return; // Don't proceed if invalid session type

			// Update session type info
			if (sessionId && info.sessionDetail) {
				const payload = {
					sessionTypeInfo: {
						sessionType: apiSessionType,
						...(field === 'location' && { location: value }),
						...(field === 'phoneNumber' && { phone: value }),
						...(field === 'videoLink' && { meetingLink: value }),
					},
				};
				updateSchedulerSession(sessionId, payload);
			}
		},
		[sessionId, info.sessionDetail, info.sessionType],
	);

	// Function to handle duration change
	const handleDurationChange = useCallback(
		(duration) => {
			setInfo((prev) => ({
				...prev,
				duration,
				isDurationOpen: false,
			}));

			// Update session duration
			if (sessionId && info.sessionDetail) {
				const payload = {
					sessionDuration: {
						unitCount: parseInt(duration),
						unitType: 'minutes',
					},
				};
				updateSchedulerSession(sessionId, payload);
			}
		},
		[sessionId, info.sessionDetail],
	);

	// Function to handle availability rules changes
	const handleAvailabilityRulesChange = useCallback(
		(field, value) => {
			setInfo((prev) => ({
				...prev,
				[field]: value,
			}));

			// Update availability rules
			if (sessionId && info.sessionDetail) {
				const payload = {
					availabilityRules: {
						...(field === 'maxBookingsPerSession' && { maxBookingsPerSession: value }),
						...(field === 'minBookingNotice' && {
							minBookingNotice: {
								unitCount: value,
								unitType: 'minutes',
							},
						}),
						...(field === 'maxBookingAdvance' && {
							maxBookingAdvance: {
								unitCount: value,
								unitType: 'days',
							},
						}),
					},
				};
				updateSchedulerSession(sessionId, payload);
			}
		},
		[sessionId, info.sessionDetail],
	);

	// Function to handle booking rules changes
	const handleBookingRulesChange = useCallback(
		(field, value) => {
			setInfo((prev) => ({
				...prev,
				[field]: value,
			}));

			// Update booking rules
			if (sessionId && info.sessionDetail) {
				const payload = {
					bookingRules: {
						...(field === 'allowRescheduling' && { allowRescheduling: value }),
						...(field === 'allowCanceling' && {
							allowCanceling: value,
							...(value && {
								cancellationPolicy: {
									minCancelNotice: {
										unitCount: info.minCancelNotice,
										unitType: 'minutes',
									},
								},
							}),
						}),
					},
				};
				updateSchedulerSession(sessionId, payload);
			}
		},
		[sessionId, info.sessionDetail, info.minCancelNotice],
	);

	// Function to handle session metadata changes
	const handleSessionMetadataChange = useCallback(
		(field, value) => {
			setInfo((prev) => ({
				...prev,
				[field]: value,
			}));

			// Update session metadata
			if (sessionId && info.sessionDetail) {
				const payload = {
					sessionMetadata: {
						...(field === 'maxParticipants' && { maxParticipants: value }),
						...(field === 'preparationInstructions' && {
							preparationInstructions: value,
						}),
					},
				};
				updateSchedulerSession(sessionId, payload);
			}
		},
		[sessionId, info.sessionDetail],
	);

	// Function to handle timezone change
	const handleTimezoneChange = useCallback(
		(timezone) => {
			setInfo((prev) => ({
				...prev,
				timezone,
			}));

			// Update session timezone
			if (sessionId && info.sessionDetail) {
				const payload = {
					sessionTimezone: timezone,
				};
				updateSchedulerSession(sessionId, payload);
			}
		},
		[sessionId, info.sessionDetail],
	);

	// Function to handle session description change
	const handleSessionDescriptionChange = useCallback(
		(description) => {
			setInfo((prev) => ({
				...prev,
				sessionDescription: description,
			}));

			// Update session description
			if (sessionId && info.sessionDetail) {
				const payload = {
					sessionDescription: description,
				};
				updateSchedulerSession(sessionId, payload);
			}
		},
		[sessionId, info.sessionDetail],
	);

	// Create a debounced handler for session type input
	const handleDebouncedSessionTypeInput = useCallback(
		(field, value) => {
			if (sessionTypeInputTimeoutRef.current) {
				clearTimeout(sessionTypeInputTimeoutRef.current);
			}

			// Update the input value immediately in the UI
			setInfo((prev) => ({
				...prev,
				[field]: value,
			}));

			// Debounce the API call
			sessionTypeInputTimeoutRef.current = setTimeout(() => {
				handleSessionTypeInput(field, value);
			}, 800);
		},
		[handleSessionTypeInput],
	);

	// Update the renderSessionTypeInput function to use the debounced handler
	const renderSessionTypeInput = () => {
		const config = sessionTypeInputConfig[info.sessionType];
		return (
			<InputComponent
				type={config?.type}
				value={info[config?.value]}
				onChange={(e) => handleDebouncedSessionTypeInput(config?.value, e.target.value)}
				placeholder={config?.placeholder}
				className="inputHeight"
			/>
		);
	};

	// Update the duration selector to use the new handler
	const handleDurationSelect = (duration) => {
		handleDurationChange(duration);
	};

	// Function to get changed fields between two states
	const getChangedFields = (currentState, previousState) => {
		if (!previousState) return currentState;

		const changes = {};

		// Helper function to check if two values are different
		const isDifferent = (val1, val2) => {
			if (val1 === null || val2 === null) return val1 !== val2;
			if (typeof val1 !== typeof val2) return true;
			if (typeof val1 === 'object') {
				if (val1 instanceof Date || val2 instanceof Date) {
					return val1.getTime() !== val2.getTime();
				}
				return JSON.stringify(val1) !== JSON.stringify(val2);
			}
			return val1 !== val2;
		};

		// Check each field for changes
		Object.entries(currentState).forEach(([key, value]) => {
			// Skip internal fields and undefined values
			if (key === 'sessionDetail' || key === 'timeout' || value === undefined) return;

			// Special handling for dayjs objects
			if (key === 'startTime' || key === 'endTime') {
				if (isDifferent(value?.toISOString(), previousState[key]?.toISOString())) {
					changes[key] = value;
				}
			} else if (isDifferent(value, previousState[key])) {
				changes[key] = value;
			}
		});

		return changes;
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
						// Update previous state after successful API call
						previousStateRef.current = { ...info };
					}
				}
			}
		}, 800);

		updateTimeoutRef.current = timeout;
	}, [sessionId, info.sessionDetail]);

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

	// Modify the weekly availability handlers to work with both new and existing sessions
	const handleWeeklyAvailabilityChange = useCallback((day, enabled) => {
		setInfo((prev) => {
			const changedSlots = {
				...prev,
				weeklyAvailability: {
					...prev.weeklyAvailability,
					[day]: {
						enabled,
						// If enabling and no slots exist, add default slot
						slots:
							enabled && prev.weeklyAvailability[day].slots.length === 0
								? [{ start: '09:00', end: '17:00' }]
								: enabled
								? prev.weeklyAvailability[day].slots
								: [],
					},
				},
			};
			return changedSlots;
		});
	}, []);

	const handleTimeSlotChange = useCallback((day, index, field, value) => {
		setInfo((prev) => {
			const newSlots = [...prev.weeklyAvailability[day].slots];
			newSlots[index] = {
				...newSlots[index],
				[field]: value || '00:00', // Default to '00:00' if value is null
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
	}, []);

	const handleAddTimeSlot = useCallback((day) => {
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
	}, []);

	const handleRemoveTimeSlot = useCallback((day, index) => {
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
	}, []);

	const handleCopyTimeSlot = useCallback((day, index) => {
		setInfo((prev) => {
			const currentSlot = prev.weeklyAvailability[day].slots[index];
			const updatedAvailability = { ...prev.weeklyAvailability };

			// Copy the slot to all other days
			['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].forEach((d) => {
				if (d !== day) {
					updatedAvailability[d] = {
						enabled: true,
						slots: [{ ...currentSlot }],
					};
				}
			});

			return {
				...prev,
				weeklyAvailability: updatedAvailability,
			};
		});
	}, []);

	// Function to prepare update payload with only changed fields
	const prepareUpdatePayload = (currentInfo, changedFields) => {
		const payload = {};

		// Map changed fields to API payload format
		Object.entries(changedFields)?.forEach(([key, value]) => {
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

				case 'sessionDescription':
					payload.sessionDescription = value;
					break;

				case 'location':
				case 'phoneNumber':
				case 'videoLink':
					// These fields are part of sessionTypeInfo
					payload.sessionTypeInfo = {
						...payload.sessionTypeInfo,
						...(key === 'location' && { location: value }),
						...(key === 'phoneNumber' && { phone: value }),
						...(key === 'videoLink' && { meetingLink: value }),
					};
					break;

				default:
					// Skip fields that aren't part of the API schema
					break;
			}
		});

		return payload;
	};

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
													handleDurationSelect(duration);
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
								onChange={(e) => handleSessionDescriptionChange(e.target.value)}
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
												onClick={() => handleSessionTypeOption(option)}
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
														<div
															key={index}
															className="time-slot-wrapper"
														>
															{/* {index > 0 && <span>and</span>} */}
															<DatePicker
																showTime
																format="HH:mm"
																picker="time"
																className="timePicker"
																value={
																	slot.start
																		? dayjs(slot.start, 'HH:mm')
																		: null
																}
																onChange={(time) =>
																	handleTimeSlotChange(
																		day,
																		index,
																		'start',
																		time
																			? time.format('HH:mm')
																			: null,
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
																value={
																	slot.end
																		? dayjs(slot.end, 'HH:mm')
																		: null
																}
																onChange={(time) =>
																	handleTimeSlotChange(
																		day,
																		index,
																		'end',
																		time
																			? time.format('HH:mm')
																			: null,
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
														</div>
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
									handleSessionMetadataChange(
										'maxParticipants',
										e.target.checked ? 5 : 1,
									)
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
									handleAvailabilityRulesChange(
										'minBookingNotice',
										e.target.checked ? 15 : 0,
									)
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
									handleBookingRulesChange('allowRescheduling', e.target.checked)
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
									handleBookingRulesChange('allowCanceling', e.target.checked)
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
										handleAvailabilityRulesChange(
											'maxBookingsPerSession',
											e.target.checked ? 1 : 0,
										)
									}
								/>
								<label htmlFor="booking-limit">Only allow</label>
								<input
									type="number"
									value={info.maxBookingsPerSession}
									onChange={(e) =>
										handleAvailabilityRulesChange(
											'maxBookingsPerSession',
											parseInt(e.target.value) || 0,
										)
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
													handleAvailabilityRulesChange(
														'bookingPeriod',
														period.toLowerCase(),
													)
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

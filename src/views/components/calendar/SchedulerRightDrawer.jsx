import { memo, useCallback, useState, useEffect, useContext, useRef } from 'react';
import '../../../assets/scss/calendar/schedulerRightDrawer.scss';
import { Collapse, Drawer, Tooltip, DatePicker } from 'antd';
import Context from '../../../context/context';
import { message } from '../globalComponents/CustomToast';
import { ReactComponent as CloseIcon } from '../../../assets/svg/calendar/CaretDoubleRight.svg';
import { ReactComponent as EyeIcon } from '../../../assets/svg/calendar/eye.svg';
import { ReactComponent as ShareIcon } from '../../../assets/svg/calendar/share.svg';
import { ReactComponent as BinIcon } from '../../../assets/svg/calendar/bin.svg';
import { ReactComponent as ClockIcon } from '../../../assets/svg/activity/clock.svg';
import { ReactComponent as VideoIcon } from '../../../assets/svg/calendar/eye.svg';
import { ReactComponent as CalendarIcon } from '../../../assets/svg/tasks/calendar.svg';
import { ReactComponent as SettingsIcon } from '../../../assets/svg/calendar/settings.svg';
import { ReactComponent as UserIcon } from '../../../assets/svg/chat/UserSound.svg';
import { ReactComponent as GlobalIcon } from '../../../assets/svg/calendar/Globe.svg';
import PhoneInput from 'react-phone-number-input';
import dayjs from 'dayjs';
import moment from 'moment-timezone';
import Spinner from '../loaders/Spinner';
import { isURL } from '../../../helpers';
import AvailabilitySection from './AvailabilitySection';
import ShareModal from '../globalComponents/globalShareModal';

const sessionTypeOptions = ['In Person', 'Phone Call', 'Video Call'];
const sessionTypeInputConfig = {
	'In Person': {
		value: 'location',
		tag: 'Location',
		type: 'text',
		placeholder: 'E.g. Office Conference Room',
	},
	'Phone Call': {
		value: 'phoneNumber',
		tag: 'Phone Number',
		type: 'number',
		placeholder: '',
	},
	'Video Call': {
		value: 'meetingLink',
		tag: 'Platform Link',
		type: 'url',
		placeholder: 'Meeting link',
	},
};

const initialInfo = {
	creatingSessionLoading: false,
	sessionName: '',
	sessionDescription: '',
	sessionType: 'In Person',
	sessionTypeOpen: false,
	location: '',
	phoneNumber: '',
	meetingLink: '',
	scheduleFrom: null,
	scheduleTo: null,
	errors: {
		sessionName: false,
		sessionTypeInput: false,
		phoneNumber: false,
		meetingLink: false,
		dateRange: false,
	},
	bufferEnabled: false,
	bufferValue: 60,
	bufferUnit: 'Minutes',
	bufferUnitOpen: false,
	maxBookingsEnabled: false,
	maxBookings: 60,
	guestPermission: false,
	durationValue: 12,
	durationUnit: 'hrs',
	durationUnitOpen: false,
	allDayEvent: false,
	timeZone: moment.tz.guess(),
	timeZoneOpen: false,
	sessionColor: '#4287F5',
	colorsArray: [
		'#8BC34A',
		'#E91E63',
		'#08B6DE',
		'#887fff',
		'#0158ff',
		'#00fad8',
		'#ff9fd3',
		'#ff2727',
		'#2196F3',
		'#964444',
	],
};

const COLLAPSE_CONFIG = {
	'one-on-one': [
		{ key: 'duration', icon: <ClockIcon className="collapse-icon" />, label: 'Duration' },
		{
			key: 'mode',
			icon: <VideoIcon className="collapse-icon" />,
			label: 'Mode of Interaction',
		},
		{
			key: 'availability',
			icon: <CalendarIcon className="collapse-icon" />,
			label: 'Availability',
		},
		{ key: 'host', icon: <UserIcon className="collapse-icon" />, label: 'Host' },
	],
	group: [
		{ key: 'duration', icon: <ClockIcon className="collapse-icon" />, label: 'Duration' },
		{
			key: 'mode',
			icon: <VideoIcon className="collapse-icon" />,
			label: 'Mode of Interaction',
		},
		{
			key: 'availability',
			icon: <CalendarIcon className="collapse-icon" />,
			label: 'Availability',
		},
		{ key: 'invitee', icon: <UserIcon className="collapse-icon" />, label: 'Invitee limit' },
		{ key: 'host', icon: <UserIcon className="collapse-icon" />, label: 'Host' },
	],
	'round-robin': [
		{ key: 'duration', icon: <ClockIcon className="collapse-icon" />, label: 'Duration' },
		{
			key: 'mode',
			icon: <VideoIcon className="collapse-icon" />,
			label: 'Mode of Interaction',
		},
		{
			key: 'availability',
			icon: <CalendarIcon className="collapse-icon" />,
			label: 'Availability',
		},
		{ key: 'host', icon: <UserIcon className="collapse-icon" />, label: 'Host' },
	],
};

const durationUnitOptions = ['hrs', 'min'];
const bufferUnitOptions = ['Minutes', 'Hours'];

// Get all timezones with their offsets
const getTimezonesWithOffsets = () => {
	// List of valid IANA timezone regions
	const validRegions = [
		'Africa',
		'America',
		'Antarctica',
		'Asia',
		'Atlantic',
		'Australia',
		'Europe',
		'Indian',
		'Pacific',
	];

	// Filter and map timezones
	return moment.tz
		.names()
		.filter((name) => {
			// Only include timezones that start with valid regions
			return validRegions.some((region) => name.startsWith(region));
		})
		.map((name) => {
			const offset = moment.tz(name).format('Z');
			const formattedName = `${name} (UTC${offset})`;
			return {
				value: name,
				label: formattedName,
			};
		})
		.sort((a, b) => {
			// Sort by UTC offset
			const offsetA = moment.tz(a.value).utcOffset();
			const offsetB = moment.tz(b.value).utcOffset();
			return offsetB - offsetA;
		});
};

const SchedulerRightDrawer = ({
	open,
	onClose,
	mode = 'create',
	sessionData,
	onSessionCreated,
	onSessionUpdated,
	onSessionDeleted,
	initialTab = 'one-on-one',
	sessionId,
}) => {
	const {
		calendarInfo: {
			createdSession,
			createSchedulerSession,
			getSchedulerSessionDetail,
			updateSchedulerSession,
			deleteSchedulerSession,
			sessionDetail,
		},
		profileInfo: { tennantSettingsData },
	} = useContext(Context);
	const [info, setInfo] = useState({
		...initialInfo,
		isShareModalOpen: false,
		isPublished: false,
		slug: sessionId || '',
		prevSlug: sessionId || '',
		slugError: '',
		publishLoading: false,
		slugValue: '',
	});
	const [activeTab, setActiveTab] = useState(initialTab);
	const [availabilitySummary, setAvailabilitySummary] = useState('');
	const [originalData, setOriginalData] = useState(null);
	const [updating, setUpdating] = useState(false);
	const updateTimer = useRef(null);
	const slugDebounceRef = useRef(null);

	// Update activeTab when initialTab changes
	useEffect(() => {
		if (mode === 'create') {
			setActiveTab(initialTab);
		}
	}, [initialTab, mode]);

	// Fetch session details in edit mode
	useEffect(() => {
		if (mode === 'edit' && sessionId && open) {
			if (!sessionDetail || sessionDetail._id !== sessionId) {
				getSchedulerSessionDetail(sessionId);
			}
		}
	}, [mode, sessionId, open, sessionDetail, getSchedulerSessionDetail]);

	// Populate form with fetched session details
	useEffect(() => {
		if (mode === 'edit' && sessionDetail && sessionDetail._id === sessionId) {
			// Determine session type based on the data
			let sessionType = 'In Person';
			if (sessionDetail.sessionTypeInfo?.meetingLink) {
				sessionType = 'Video Call';
			} else if (sessionDetail.sessionTypeInfo?.phone) {
				sessionType = 'Phone Call';
			}

			// Convert duration from minutes to appropriate unit
			const durationInMinutes = sessionDetail.sessionDuration?.unitCount || 0;
			const durationValue =
				durationInMinutes >= 60 ? Math.floor(durationInMinutes / 60) : durationInMinutes;
			const durationUnit = durationInMinutes >= 60 ? 'hrs' : 'min';

			// Format session window dates only in edit mode
			const startDate = sessionDetail.sessionWindow?.startDate
				? dayjs(sessionDetail.sessionWindow.startDate).format('YYYY-MM-DD')
				: null;
			const endDate = sessionDetail.sessionWindow?.endDate
				? dayjs(sessionDetail.sessionWindow.endDate).format('YYYY-MM-DD')
				: null;

			// Set initial slugValue
			const domain =
				tennantSettingsData?.customDomain || `${localStorage.getItem('workspaceId')}.ve.ai`;
			const initialSlugValue = `${domain}/meet/${sessionDetail.slug || sessionId}`;

			setInfo({
				...initialInfo,
				...sessionDetail,
				sessionType: sessionType,
				location: sessionDetail.sessionTypeInfo?.location || '',
				phoneNumber: sessionDetail.sessionTypeInfo?.phone || '',
				meetingLink: sessionDetail.sessionTypeInfo?.meetingLink || '',
				schedulerWindowStart: startDate,
				schedulerWindowEnd: endDate,
				availability: {
					availabilitySlots: sessionDetail.availabilitySlots || [],
					customExceptions: sessionDetail.customExceptions || [],
				},
				// Duration mapping
				durationValue: durationValue,
				durationUnit: durationUnit,
				// Buffer mapping
				bufferEnabled: !!sessionDetail.bufferTime?.after?.unitCount,
				bufferValue: sessionDetail.bufferTime?.after?.unitCount || 60,
				bufferUnit:
					sessionDetail.bufferTime?.after?.unitType === 'Hours' ? 'Hours' : 'Minutes',
				// Invitee mapping
				inviteeLimit: sessionDetail.sessionMetadata?.maxParticipants || '',
				// Timezone mapping
				timeZone: sessionDetail.sessionTimezone || moment.tz.guess(),
				// Max bookings per day
				maxBookingsEnabled: sessionDetail.availabilityRules?.maxBookingsPerSession != null,
				maxBookings: sessionDetail.availabilityRules?.maxBookingsPerSession || 1,
				// Slug mapping
				slug: sessionDetail.slug || sessionId,
				prevSlug: sessionDetail.slug || sessionId,
				isPublished: sessionDetail.isPublished || false,
				slugValue: initialSlugValue,
			});
			setActiveTab(sessionDetail.sessionTypeInfo?.sessionType || initialTab);
			setOriginalData(sessionDetail);
		} else if (mode === 'create') {
			// In create mode, set default values without API data
			setInfo({
				...initialInfo,
				schedulerWindowStart: dayjs().format('YYYY-MM-DD'),
				schedulerWindowEnd: dayjs().add(13, 'day').format('YYYY-MM-DD'),
				slug: sessionId || '',
				prevSlug: sessionId || '',
			});
		}
	}, [mode, sessionDetail, sessionId, initialTab, tennantSettingsData]);

	// On field change, only update local state
	const handleFieldChange = (field, value) => {
		setInfo((prev) => ({ ...prev, [field]: value }));
	};

	const handleAvailabilityChange = (val) => {
		setInfo((prev) => ({ ...prev, availability: val }));
	};

	useEffect(() => {
		if (createdSession && mode === 'create') {
			message.success('Session created successfully!');
			setInfo({ ...initialInfo });
			handleClose();
			onSessionCreated?.(createdSession);
		}
	}, [createdSession]);

	useEffect(() => {
		if (mode === 'create' && open) {
			setInfo((prev) => ({
				...prev,
				sessionName: prev.sessionName || 'Add Title',
				sessionDescription: prev.sessionDescription || 'Add a description for the session',
			}));
		}
	}, [mode, open]);

	const handleClose = useCallback(() => {
		setInfo({ ...initialInfo });
		onClose();
	}, [onClose]);

	const buildUpdatePayload = (currentInfo, originalData) => {
		const payload = {};

		// Compare and add changed fields
		if (currentInfo.sessionName !== originalData.sessionName) {
			payload.sessionName = currentInfo.sessionName;
		}

		if (currentInfo.sessionDescription !== originalData.sessionDescription) {
			payload.sessionDescription = currentInfo.sessionDescription;
		}

		// Add color change to payload
		if (currentInfo.sessionColor !== originalData.sessionColor) {
			payload.sessionColor = currentInfo.sessionColor;
		}

		// Compare session window
		const currentStartDate = currentInfo.schedulerWindowStart;
		const currentEndDate = currentInfo.schedulerWindowEnd;
		const originalStartDate = originalData.sessionWindow?.startDate;
		const originalEndDate = originalData.sessionWindow?.endDate;

		if (currentStartDate !== originalStartDate || currentEndDate !== originalEndDate) {
			payload.sessionWindow = {
				type: 'fixed_date_range',
				startDate: currentStartDate,
				endDate: currentEndDate,
			};
		}

		// Compare session type info individually
		const sessionTypeInfo = {
			sessionType: activeTab,
		};
		if (currentInfo.location !== originalData.sessionTypeInfo?.location) {
			sessionTypeInfo.location = currentInfo.location;
		}
		if (currentInfo.phoneNumber !== originalData.sessionTypeInfo?.phone) {
			sessionTypeInfo.phone = currentInfo.phoneNumber;
		}
		if (currentInfo.meetingLink !== originalData.sessionTypeInfo?.meetingLink) {
			sessionTypeInfo.meetingLink = currentInfo.meetingLink;
		}

		// Only add sessionTypeInfo if there are changes
		if (Object.keys(sessionTypeInfo).length > 1) {
			payload.sessionTypeInfo = sessionTypeInfo;
		}

		// Compare timezone
		const currentTimezone = currentInfo.timeZone;
		if (currentTimezone && currentTimezone !== originalData.sessionTimezone) {
			const validRegions = [
				'Africa',
				'America',
				'Antarctica',
				'Asia',
				'Atlantic',
				'Australia',
				'Europe',
				'Indian',
				'Pacific',
			];

			const isValidTimezone = validRegions.some((region) =>
				currentTimezone.startsWith(region),
			);

			if (isValidTimezone) {
				payload.sessionTimezone = currentTimezone;
			} else {
				payload.sessionTimezone = 'Asia/Kolkata';
			}
		}

		// Compare duration
		const currentDuration =
			info.durationUnit === 'hrs' ? info.durationValue * 60 : info.durationValue;
		const originalDuration = originalData.sessionDuration?.unitCount;

		if (currentDuration !== originalDuration) {
			payload.sessionDuration = {
				unitCount: currentDuration,
				unitType: 'minutes',
			};
		}

		// Compare buffer time
		const currentBufferValue = parseInt(currentInfo.bufferValue) || 15;
		const originalBufferValue = originalData.bufferTime?.after?.unitCount;

		if (currentBufferValue !== originalBufferValue) {
			payload.bufferTime = {
				before: {
					unitCount: 5,
					unitType: 'minutes',
				},
				after: {
					unitCount: currentBufferValue,
					unitType: 'minutes',
				},
			};
		}

		// Compare max participants
		const currentMaxParticipants =
			activeTab === 'one-on-one' ? 1 : currentInfo.inviteeLimit || 5;
		const originalMaxParticipants = originalData.sessionMetadata?.maxParticipants;

		if (currentMaxParticipants !== originalMaxParticipants) {
			payload.sessionMetadata = {
				maxParticipants: currentMaxParticipants,
			};
		}

		// Handle availability based on mode
		if (currentInfo.availability?.mode === 'custom') {
			// For custom mode, only send customExceptions
			payload.customExceptions = [
				{
					date: currentInfo.availability.custom.start,
					overrideAvailability: true,
					customTimeRanges: [
						{
							startTime: '09:00',
							endTime: '17:00',
						},
					],
				},
			];
		} else if (currentInfo.availability?.mode === 'weekly') {
			// For weekly mode, only send availabilitySlots
			const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
			const dayMap = {
				Sun: 'Sunday',
				Mon: 'Monday',
				Tue: 'Tuesday',
				Wed: 'Wednesday',
				Thu: 'Thursday',
				Fri: 'Friday',
				Sat: 'Saturday',
			};

			payload.availabilitySlots = WEEKDAYS.map((d) => {
				const day = currentInfo.availability.weekly.find((w) => w.day === d);
				return {
					dayOfWeek: dayMap[d],
					timeRanges:
						day && day.slots.length > 0
							? day.slots.map((slot) => ({
									startTime: slot.from,
									endTime: slot.to,
							  }))
							: [],
				};
			});
		}

		// Only include availabilityRules if buffer or max bookings were changed
		const hasBufferChanged = currentBufferValue !== originalBufferValue;
		const hasMaxBookingsChanged =
			(currentInfo.maxBookingsEnabled !==
				originalData.availabilityRules?.maxBookingsPerSession) !=
				null ||
			(currentInfo.maxBookingsEnabled &&
				currentInfo.maxBookings !== originalData.availabilityRules?.maxBookingsPerSession);

		if (hasBufferChanged || hasMaxBookingsChanged) {
			payload.availabilityRules = {};

			if (
				currentInfo.maxBookingsEnabled &&
				currentInfo.maxBookings &&
				!isNaN(Number(currentInfo.maxBookings))
			) {
				payload.availabilityRules.maxBookingsPerSession = Number(currentInfo.maxBookings);
			}
		}

		return payload;
	};

	const handleCreateOrUpdate = useCallback(async () => {
		if (info.creatingSessionLoading) return; // Prevent multiple rapid clicks

		// Validate date range only if custom availability
		if (
			info.availability?.mode === 'custom' &&
			(!info.availability?.custom?.start ||
				(!info.availability?.custom?.never && !info.availability?.custom?.end))
		) {
			setInfo((prev) => ({
				...prev,
				errors: { ...prev.errors, dateRange: true },
			}));
			message.error('Please select a valid date range for custom availability');
			return;
		}
		if (
			info.availability?.mode === 'custom' &&
			!info.availability?.custom?.never &&
			info.availability?.custom?.end <= info.availability?.custom?.start
		) {
			setInfo((prev) => ({
				...prev,
				errors: { ...prev.errors, dateRange: true },
			}));
			message.error('End date must be after start date');
			return;
		}

		// Validate required fields
		const errors = {
			sessionName: !info?.sessionName,
			sessionTypeInput: !info[sessionTypeInputConfig[info.sessionType].value],
		};
		if (errors.sessionName || errors.sessionTypeInput) {
			setInfo((prev) => ({
				...prev,
				errors,
			}));
			if (errors.sessionName) {
				message.error('Please enter a session name');
			}
			if (errors.sessionTypeInput) {
				message.error(
					`Please enter ${sessionTypeInputConfig[info.sessionType].tag.toLowerCase()}`,
				);
			}
			return;
		}

		// Group invitee validation
		if (activeTab === 'group' && (!info.inviteeLimit || info.inviteeLimit < 2)) {
			setInfo((prev) => ({
				...prev,
				errors: { ...prev.errors, inviteeLimit: true },
			}));
			message.error('Group sessions must have at least 2 invitees');
			return;
		}

		setInfo((prev) => ({
			...prev,
			creatingSessionLoading: true,
			errors: { ...prev.errors, dateRange: false },
		}));

		// Convert duration to minutes
		const durationInMinutes =
			info.durationUnit === 'hrs' ? info.durationValue * 60 : info.durationValue;

		// Map abbreviated days to full names
		const dayMap = {
			Sun: 'Sunday',
			Mon: 'Monday',
			Tue: 'Tuesday',
			Wed: 'Wednesday',
			Thu: 'Thursday',
			Fri: 'Friday',
			Sat: 'Saturday',
		};

		// Prepare availability data based on mode
		let availabilityData = {};
		if (info.availability?.mode === 'weekly') {
			const validSlots = info.availability.weekly
				.filter((day) => day.slots.length > 0) // Only include days with slots
				.map((day) => ({
					dayOfWeek: dayMap[day.day],
					timeRanges: day.slots.map((slot) => ({
						startTime: slot.from,
						endTime: slot.to,
					})),
				}));

			if (validSlots.length > 0) {
				availabilityData = {
					availabilitySlots: validSlots,
				};
			} else {
				// Default availability: Monday to Friday, 9 AM to 5 PM
				availabilityData = {
					availabilitySlots: [
						{
							dayOfWeek: 'Monday',
							timeRanges: [{ startTime: '09:00', endTime: '17:00' }],
						},
						{
							dayOfWeek: 'Tuesday',
							timeRanges: [{ startTime: '09:00', endTime: '17:00' }],
						},
						{
							dayOfWeek: 'Wednesday',
							timeRanges: [{ startTime: '09:00', endTime: '17:00' }],
						},
						{
							dayOfWeek: 'Thursday',
							timeRanges: [{ startTime: '09:00', endTime: '17:00' }],
						},
						{
							dayOfWeek: 'Friday',
							timeRanges: [{ startTime: '09:00', endTime: '17:00' }],
						},
					],
				};
			}
		} else if (info.availability?.mode === 'custom') {
			availabilityData = {
				customExceptions: [
					{
						date: info.availability.custom.start,
						overrideAvailability: true,
						customTimeRanges: [
							{
								startTime: '09:00',
								endTime: '17:00',
							},
						],
					},
				],
			};
		} else {
			// Default availability for when no mode is selected: Monday to Friday, 9 AM to 5 PM
			availabilityData = {
				availabilitySlots: [
					{ dayOfWeek: 'Monday', timeRanges: [{ startTime: '09:00', endTime: '17:00' }] },
					{
						dayOfWeek: 'Tuesday',
						timeRanges: [{ startTime: '09:00', endTime: '17:00' }],
					},
					{
						dayOfWeek: 'Wednesday',
						timeRanges: [{ startTime: '09:00', endTime: '17:00' }],
					},
					{
						dayOfWeek: 'Thursday',
						timeRanges: [{ startTime: '09:00', endTime: '17:00' }],
					},
					{ dayOfWeek: 'Friday', timeRanges: [{ startTime: '09:00', endTime: '17:00' }] },
				],
			};
		}

		// Always include session window: for custom use custom dates, otherwise use today + 2 weeks
		let sessionWindow;
		if (info.schedulerWindowStart && info.schedulerWindowEnd) {
			sessionWindow = {
				type: 'fixed_date_range',
				startDate: info.schedulerWindowStart,
				endDate: info.schedulerWindowEnd,
			};
		} else {
			sessionWindow = {
				type: 'fixed_date_range',
				startDate: dayjs().format('YYYY-MM-DD'),
				endDate: dayjs().add(13, 'day').format('YYYY-MM-DD'),
			};
		}

		const sessionPayload = {
			sessionName: info?.sessionName,
			sessionDescription: info?.sessionDescription,
			sessionTypeInfo: {
				sessionType: activeTab,
				location: info?.location,
				phone: info?.phoneNumber,
				meetingLink: info?.meetingLink,
			},
			sessionWindow,
			sessionTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			sessionColor: info.sessionColor,
			sessionDuration: {
				unitCount: durationInMinutes,
				unitType: 'minutes',
			},
			bufferTime: {
				before: {
					unitCount: 5,
					unitType: 'minutes',
				},
				after: {
					unitCount: parseInt(info.bufferValue) || 15,
					unitType: 'minutes',
				},
			},
			sessionMetadata: {
				maxParticipants: activeTab === 'one-on-one' ? 1 : info.inviteeLimit || 5,
			},
			...availabilityData,
		};

		if (mode === 'create') {
			try {
				await createSchedulerSession(sessionPayload);
			} catch (err) {
				const errorMsg = err?.response?.data?.message || 'Failed to create session.';
				message.error(errorMsg);
				setInfo((prev) => ({ ...prev, creatingSessionLoading: false }));
				return;
			}
		} else if (mode === 'edit') {
			const payload = buildUpdatePayload(info, originalData);
			if (Object.keys(payload).length === 0) {
				message.success('No changes to update.');
				setInfo((prev) => ({ ...prev, creatingSessionLoading: false }));
				return;
			}
			setInfo((prev) => ({ ...prev, creatingSessionLoading: true }));
			updateSchedulerSession(sessionId, payload)
				.then((updatedSession) => {
					message.success('Session updated successfully!');
					onSessionUpdated?.(updatedSession);
					setInfo((prev) => ({ ...prev, creatingSessionLoading: false }));
				})
				.catch((err) => {
					const errorMsg = err?.response?.data?.message || 'Failed to update session.';
					message.error(errorMsg);
					setInfo((prev) => ({ ...prev, creatingSessionLoading: false }));
				});
		}
	}, [
		info,
		mode,
		createSchedulerSession,
		onSessionUpdated,
		handleClose,
		activeTab,
		originalData,
		sessionId,
		updateSchedulerSession,
	]);

	const handleSessionTypeChange = useCallback((type) => {
		setInfo((prev) => ({
			...prev,
			sessionType: type,
			sessionTypeOpen: false,
			location: '',
			phoneNumber: '',
			meetingLink: '',
		}));
	}, []);

	const renderSessionTypeInput = () => {
		const config = sessionTypeInputConfig[info.sessionType];
		const validateInput = (value) => {
			if (config.value === 'meetingLink') {
				const err = !isURL(value);
				setInfo((prev) => ({
					...prev,
					errors: { ...prev.errors, meetingLink: err },
				}));
			}
			return true;
		};
		const handleChange = (value) => {
			setInfo((prev) => ({
				...prev,
				[config.value]: value,
				errors: { ...prev.errors, sessionTypeInput: false },
			}));
			validateInput(value);
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
					style={{ backgroundColor: 'var(--popup)' }}
				/>
			);
		}
		return (
			<input
				type={config.type}
				value={info[config.value] || ''}
				onChange={(e) => handleChange(e.target.value)}
				placeholder={config.placeholder}
				className={`inputHeight ${
					info.errors.sessionTypeInput || info.errors[config.value] ? 'error' : ''
				}`}
			/>
		);
	};

	// Tabs for create mode only
	const tabs = [
		{ id: 'one-on-one', label: 'One-on-One' },
		{ id: 'group', label: 'Group' },
		// { id: 'round-robin', label: 'Round Robin' },
	];

	const handleBufferEnabledChange = (e) =>
		setInfo((prev) => ({ ...prev, bufferEnabled: e.target.checked }));
	const handleBufferValueChange = (e) =>
		setInfo((prev) => ({ ...prev, bufferValue: e.target.value }));
	const handleBufferUnitChange = (e) =>
		setInfo((prev) => ({ ...prev, bufferUnit: e.target.value }));
	const handleMaxBookingsEnabledChange = (e) =>
		setInfo((prev) => ({ ...prev, maxBookingsEnabled: e.target.checked }));
	const handleMaxBookingsChange = (e) =>
		setInfo((prev) => ({ ...prev, maxBookings: e.target.value }));
	const handleGuestPermissionChange = (e) =>
		setInfo((prev) => ({ ...prev, guestPermission: e.target.checked }));

	const handleColorChange = (color) => {
		setInfo((prev) => ({
			...prev,
			sessionColor: color,
			showColorPicker: false,
		}));
	};

	// DELETE HANDLER
	const handleDelete = async () => {
		try {
			await deleteSchedulerSession(sessionId);
			message.success('Session deleted successfully');
			onSessionDeleted?.(sessionId);
			handleClose();
		} catch (err) {
			message.error('Failed to delete session.');
		}
	};

	const handleCopyLink = () => {
		if (!info?.slug?.trim()) {
			message.error('Please enter a slug');
			return;
		}
		const domain =
			tennantSettingsData?.customDomain || `${localStorage.getItem('workspaceId')}.ve.ai`;
		navigator.clipboard.writeText(`https://${domain}/meet/${info?.prevSlug}`);
		message.success('Link copied to clipboard');
	};

	const handleViewSite = () => {
		const domain =
			tennantSettingsData?.customDomain || `${localStorage.getItem('workspaceId')}.ve.ai`;
		window.open(`https://${domain}/meet/${info?.prevSlug}`, '_blank');
	};

	const handleSlugChange = (value) => {
		// Update local state with the full URL
		const domain =
			tennantSettingsData?.customDomain || `${localStorage.getItem('workspaceId')}.ve.ai`;
		const fullValue = `${domain}/meet/${value}`;
		setInfo((prev) => ({ ...prev, slugValue: fullValue }));

		// Clear any existing timeout
		if (slugDebounceRef.current) {
			clearTimeout(slugDebounceRef.current);
		}

		// Set new timeout for API call
		slugDebounceRef.current = setTimeout(async () => {
			try {
				const response = await updateSchedulerSession(sessionId, {
					slug: value,
				});

				if (response?.data?.success) {
					setInfo((prev) => ({
						...prev,
						slug: value,
						prevSlug: value,
						slugError: '',
					}));
					message.success('Slug updated successfully');
				}
			} catch (error) {
				setInfo((prev) => ({
					...prev,
					slugError: error?.response?.data?.message || 'Failed to update slug',
				}));
				message.error(error?.response?.data?.message || 'Failed to update slug');
			}
		}, 1000);
	};

	return (
		<Drawer
			open={open}
			onClose={handleClose}
			placement="right"
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
			rootClassName="scheduler-right-drawer-wrapper"
		>
			<div className="scheduler-right-drawer-container">
				<div className="scheduler-right-drawer-header-container">
					<CloseIcon className="close-icon" onClick={handleClose} />
					{mode === 'edit' && (
						<div className="scheduler-right-drawer-header-title-container">
							<EyeIcon className="eye-icon" onClick={() => handleViewSite()} />
							<ShareIcon
								className="share-icon"
								onClick={() =>
									setInfo((prev) => ({ ...prev, isShareModalOpen: true }))
								}
							/>
							<BinIcon className="bin-icon" onClick={handleDelete} />
						</div>
					)}
				</div>
				<div className="scheduler-right-drawer-header">
					<div className="session-color-picker">
						<div
							className="color-preview"
							style={{ backgroundColor: info.sessionColor }}
							onClick={() => setInfo((prev) => ({ ...prev, showColorPicker: true }))}
						/>
						<input
							type="text"
							className="scheduler-right-drawer-title rightDrawerInputHeight"
							value={info.sessionName}
							onChange={(e) => handleFieldChange('sessionName', e.target.value)}
							autoComplete="off"
						/>
					</div>
					<div className="scheduler-right-drawer-title-container">
						<p className="scheduler-description">
							<input
								type="text"
								className="rightDrawerInputHeight"
								value={info.sessionDescription}
								onFocus={(e) => {
									if (e.target.value === 'Add a description for the session')
										handleFieldChange('sessionDescription', '');
								}}
								onBlur={(e) => {
									if (!e.target.value)
										handleFieldChange('sessionDescription', '');
								}}
								onChange={(e) =>
									handleFieldChange('sessionDescription', e.target.value)
								}
								autoComplete="off"
							/>
						</p>
					</div>
				</div>
				{mode === 'create' && (
					<div className="scheduler-tabs">
						<div className="tabs-container">
							{tabs.map((tab) => (
								<button
									key={tab.id}
									className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
									onClick={() => setActiveTab(tab.id)}
								>
									{tab.label}
								</button>
							))}
						</div>
					</div>
				)}
				{mode === 'edit' && (
					<div className="scheduler-tabs">
						<div className="tabs-container">
							{tabs.map((tab) => (
								<button
									key={tab.id}
									className={`tab-button ${
										activeTab === tab.id ? 'active' : ''
									} disabled`}
									disabled
									style={{ cursor: 'not-allowed', opacity: 0.5 }}
								>
									{tab.label}
								</button>
							))}
						</div>
					</div>
				)}
				<div className="scheduler-content">
					<Collapse className="scheduler-collapse" defaultActiveKey={['']}>
						{COLLAPSE_CONFIG[activeTab].map((section) => {
							let dynamicValue = '';
							switch (section.key) {
								case 'duration':
									if (info.scheduleFrom && info.scheduleTo) {
										const hours = dayjs(info.scheduleTo).diff(
											dayjs(info.scheduleFrom),
											'hour',
										);
										dynamicValue = hours > 0 ? `${hours} Hrs` : '';
									} else {
										dynamicValue = '';
									}
									break;
								case 'mode':
									dynamicValue = info.sessionType || 'Choose a platform';
									break;
								case 'availability':
									dynamicValue =
										availabilitySummary || 'Set your available days and times.';
									break;
								case 'invitee':
									dynamicValue = info.inviteeLimit
										? `${info.inviteeLimit} Invitees`
										: 'No limit';
									break;
								case 'host':
									dynamicValue = sessionData?.email || '(you)';
									break;
								default:
									dynamicValue = '';
							}
							let content = null;
							switch (section.key) {
								case 'duration':
									content = (
										<div className="collapse-content duration-collapse-content">
											<div className="duration-row">
												<div className="duration-label">
													Scheduler Window
												</div>
												<div className="scheduler-window-container">
													<div className="scheduler-window-row">
														<div className="scheduler-window-label">
															Start Date
														</div>
														<DatePicker
															className="scheduler-window-input"
															value={
																info.schedulerWindowStart
																	? dayjs(
																			info.schedulerWindowStart,
																	  )
																	: null
															}
															onChange={(date) =>
																handleFieldChange(
																	'schedulerWindowStart',
																	date
																		? date.format('YYYY-MM-DD')
																		: null,
																)
															}
															format="YYYY-MM-DD"
															disabledDate={(current) =>
																current &&
																current < dayjs().startOf('day')
															}
														/>
													</div>
													<div className="scheduler-window-row">
														<div className="scheduler-window-label">
															End Date
														</div>
														<DatePicker
															className="scheduler-window-input"
															value={
																info.schedulerWindowEnd
																	? dayjs(info.schedulerWindowEnd)
																	: null
															}
															onChange={(date) =>
																handleFieldChange(
																	'schedulerWindowEnd',
																	date
																		? date.format('YYYY-MM-DD')
																		: null,
																)
															}
															format="YYYY-MM-DD"
															disabledDate={(current) =>
																current &&
																current < dayjs().startOf('day')
															}
														/>
													</div>
												</div>
											</div>
											<div className="duration-row">
												<div className="duration-label">Time Zone</div>
												<div className="duration-field">
													<div className="timeZone-container">
														<GlobalIcon />
														<Tooltip
															open={info.timeZoneOpen}
															onOpenChange={(visible) =>
																handleFieldChange(
																	'timeZoneOpen',
																	visible,
																)
															}
															placement="bottom"
															distance={0}
															arrowContent={null}
															arrow={true}
															borderRadius={8}
															title={
																<div className="createSession-sessionType-dropdown timezone-dropdown">
																	{getTimezonesWithOffsets().map(
																		(option) => (
																			<div
																				key={option.value}
																				className="sessionType-dropdown-item"
																				onClick={(e) => {
																					e.stopPropagation();
																					handleFieldChange(
																						'timeZone',
																						option.value,
																					);
																					setInfo(
																						(prev) => ({
																							...prev,
																							timeZoneOpen: false,
																						}),
																					);
																				}}
																			>
																				{option.label}
																			</div>
																		),
																	)}
																</div>
															}
															trigger={'click'}
															color={'transparent'}
															overlayStyle={{
																width: '100%',
																padding: '0',
																overflow: 'hidden',
																border: '1px solid var(--stroke)',
																borderRadius: 8,
															}}
														>
															<div
																className="typeOfSession-lable timezone-select"
																style={{
																	width: '100%',
																	cursor: 'pointer',
																	padding: '12px',
																	display: 'flex',
																	alignItems: 'center',
																	justifyContent: 'space-between',
																	gap: '8px',
																}}
															>
																<span>
																	{moment
																		.tz(info.timeZone)
																		.format('z')}{' '}
																	({info.timeZone})
																</span>
																<svg
																	width="12"
																	height="12"
																	viewBox="0 0 12 12"
																	fill="none"
																	xmlns="http://www.w3.org/2000/svg"
																>
																	<path
																		d="M3 4.5L6 7.5L9 4.5"
																		stroke="currentColor"
																		strokeWidth="1.5"
																		strokeLinecap="round"
																		strokeLinejoin="round"
																	/>
																</svg>
															</div>
														</Tooltip>
													</div>
												</div>
											</div>
											<div className="duration-row">
												<div className="duration-label">
													Appointment duration
												</div>
												{/* <div className="duration-field">
													<input
														className="inputHeight duration-appointment-input"
														placeholder="Custom"
													/>
												</div> */}
											</div>
											<div className="duration-row duration-custom-row">
												<div className="duration-number-input-container">
													<input
														className="inputHeight duration-number-input"
														type="number"
														min="1"
														max="24"
														value={info.durationValue}
														onChange={(e) =>
															handleFieldChange(
																'durationValue',
																e.target.value,
															)
														}
														placeholder="12"
													/>
												</div>
												<div
													className="duration-field"
													style={{
														border: '1px solid var(--stroke)',
														borderRadius: 8,
														padding: 12,
													}}
												>
													<div className="duration-unit-container">
														<Tooltip
															open={info.durationUnitOpen}
															onOpenChange={(visible) =>
																handleFieldChange(
																	'durationUnitOpen',
																	visible,
																)
															}
															placement="bottom"
															distance={0}
															title={
																<div className="createSession-sessionType-dropdown">
																	{durationUnitOptions.map(
																		(option) => (
																			<div
																				key={option}
																				className="sessionType-dropdown-item"
																				onClick={() =>
																					handleFieldChange(
																						'durationUnit',
																						option,
																					)
																				}
																			>
																				{option}
																			</div>
																		),
																	)}
																</div>
															}
															trigger={'click'}
															color={'transparent'}
															overlayStyle={{
																width: '100%',
																padding: '0',
															}}
														>
															<div className="typeOfSession-lable">
																{info.durationUnit}
															</div>
														</Tooltip>
													</div>
												</div>
											</div>

											{/* <div className="duration-allday-row">
												<div className="custom-checkbox">
													<input
														type="checkbox"
														id="allday-event"
														checked={info.allDayEvent}
														onChange={(e) =>
															handleFieldChange(
																'allDayEvent',
																e.target.checked,
															)
														}
													/>
													<label
														htmlFor="allday-event"
														className="checkbox-label"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="12"
															height="10"
															viewBox="0 0 12 10"
															fill="none"
														>
															<path
																d="M0.959839 5.86677L4.15976 8.7467L11.0396 1.54688"
																stroke="#E8E8E8"
																style={{
																	stroke: 'color(display-p3 0.9097 0.9096 0.9096)',
																	strokeOpacity: 1,
																}}
																strokeWidth="1.19997"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
														</svg>
													</label>
												</div>
												<label
													htmlFor="allday-event"
													className="duration-allday-label"
												>
													All Day Event
												</label>
											</div> */}
										</div>
									);
									break;
								case 'mode':
									content = (
										<div className="collapse-content mode-interaction-collapse-content">
											<div className="mode-row">
												<div className="mode-label">Type</div>
												<div className="mode-field">
													<Tooltip
														open={info?.sessionTypeOpen}
														onOpenChange={(visible) =>
															handleFieldChange(
																'sessionTypeOpen',
																visible,
															)
														}
														placement="bottom"
														distance={0}
														title={
															<div className="createSession-sessionType-dropdown">
																{sessionTypeOptions?.map(
																	(option) => (
																		<div
																			key={option}
																			className="sessionType-dropdown-item"
																			onClick={() =>
																				handleSessionTypeChange(
																					option,
																				)
																			}
																		>
																			{option}
																		</div>
																	),
																)}
															</div>
														}
														trigger={'click'}
														color={'transparent'}
														overlayStyle={{
															width: '100%',
															padding: '0',
														}}
													>
														<div className="typeOfSession-lable">
															{info?.sessionType}
														</div>
													</Tooltip>
												</div>
											</div>
											<div className="mode-row">
												<div className="mode-label">Location</div>
												<div className="mode-field">
													{renderSessionTypeInput()}
												</div>
											</div>
										</div>
									);
									break;
								case 'availability':
									content = (
										<div className="collapse-content availability-collapse-content">
											<AvailabilitySection
												key={sessionId}
												value={info.availability}
												onChange={handleAvailabilityChange}
												onSummaryChange={setAvailabilitySummary}
											/>
										</div>
									);
									break;
								case 'invitee':
									content = (
										<div className="collapse-content invitee-collapse-content">
											<div className="invitee-row">
												<div className="invitee-label">
													Set max invitees for groups
												</div>
												<input
													className={`inputHeight invitee-input${
														info.errors.inviteeLimit ? ' error' : ''
													}`}
													type="number"
													min="1"
													value={info.inviteeLimit || ''}
													onChange={(e) => {
														handleFieldChange(
															'inviteeLimit',
															e.target.value,
														);
														setInfo((prev) => ({
															...prev,
															errors: {
																...prev.errors,
																inviteeLimit: false,
															},
														}));
													}}
													placeholder="Enter limit"
												/>
											</div>
											{info.errors.inviteeLimit && (
												<div
													style={{
														color: '#ff4d4f',
														fontSize: 12,
														marginTop: 4,
													}}
												>
													Group sessions must have at least 2 invitees.
												</div>
											)}
										</div>
									);
									break;
								case 'host':
									content = (
										<div className="collapse-content host-collapse-content">
											<div className="host-row">
												<div className="host-label">Host</div>
												<div className="host-value">
													{sessionData?.email || '(you)'}
												</div>
											</div>
										</div>
									);
									break;
								default:
									content = null;
							}
							return (
								<Collapse.Panel
									header={
										<div className="collapse-header">
											{section.icon}
											<div className="collapse-header-title-container">
												<span className="collapse-header-title">
													{section.label}
												</span>
												<span className="collapse-value">
													{dynamicValue}
												</span>
											</div>
										</div>
									}
									key={section.key}
								>
									{content}
								</Collapse.Panel>
							);
						})}
						{/* Booked appointment settings collapse here, using info state and handlers */}
						<Collapse.Panel
							header={
								<div className="collapse-header">
									<SettingsIcon className="collapse-icon" />
									<div className="collapse-header-title-container">
										<span className="collapse-header-title">
											Booked appointment settings
										</span>
										<span className="collapse-value">
											{`${
												info.bufferEnabled
													? `Buffer: ${
															info.bufferValue
													  } ${info.bufferUnit.toLowerCase()}`
													: 'No buffer time'
											} - ${
												info.maxBookingsEnabled
													? `Maximum bookings per day: ${info.maxBookings}`
													: 'No max booking per day'
											} - ${
												info.guestPermission
													? 'Guests can invite others'
													: 'No guest permission'
											}`}
										</span>
									</div>
								</div>
							}
							key="settings"
						>
							<div className="collapse-content booked-settings-collapse-content">
								<div className="settings-row">
									<div className="settings-label">Buffer time</div>
									<div className="settings-desc">
										Add time between appointment slots
									</div>
									<div className="settings-control">
										<div className="custom-checkbox">
											<input
												type="checkbox"
												id="bufferEnabled"
												checked={info.bufferEnabled}
												onChange={(e) =>
													handleFieldChange(
														'bufferEnabled',
														e.target.checked,
													)
												}
											/>
											<label
												htmlFor="bufferEnabled"
												className="checkbox-label"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="12"
													height="10"
													viewBox="0 0 12 10"
													fill="none"
												>
													<path
														d="M0.959839 5.86677L4.15976 8.7467L11.0396 1.54688"
														stroke="#E8E8E8"
														style={{
															stroke: 'color(display-p3 0.9097 0.9096 0.9096)',
															strokeOpacity: 1,
														}}
														strokeWidth="1.19997"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</label>
										</div>
										<input
											type="number"
											className="settings-input"
											value={info.bufferValue}
											onChange={(e) =>
												handleFieldChange('bufferValue', e.target.value)
											}
											disabled={!info.bufferEnabled}
											min={1}
											max={1440}
										/>
										<div className="typeOfSession-lable">
											<Tooltip
												open={info.bufferUnitOpen}
												onOpenChange={(visible) =>
													handleFieldChange('bufferUnitOpen', visible)
												}
												placement="bottom"
												distance={0}
												title={
													<div className="createSession-sessionType-dropdown">
														{bufferUnitOptions.map((option) => (
															<div
																key={option}
																className="sessionType-dropdown-item"
																onClick={() =>
																	handleFieldChange(
																		'bufferUnit',
																		option,
																	)
																}
															>
																{option}
															</div>
														))}
													</div>
												}
												trigger={'click'}
												color={'transparent'}
												overlayStyle={{ width: '100%', padding: '0' }}
											>
												<div className="typeOfSession-lable">
													{info.bufferUnit}
												</div>
											</Tooltip>
										</div>
									</div>
								</div>
								<div className="settings-row">
									<div className="settings-label">Maximum bookings per day</div>
									<div className="settings-desc">
										Limit how many booked appointments to accept in a single day
									</div>
									<div className="settings-control">
										<div className="custom-checkbox">
											<input
												type="checkbox"
												id="maxBookingsEnabled"
												checked={info.maxBookingsEnabled}
												onChange={(e) =>
													handleFieldChange(
														'maxBookingsEnabled',
														e.target.checked,
													)
												}
											/>
											<label
												htmlFor="maxBookingsEnabled"
												className="checkbox-label"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="12"
													height="10"
													viewBox="0 0 12 10"
													fill="none"
												>
													<path
														d="M0.959839 5.86677L4.15976 8.7467L11.0396 1.54688"
														stroke="#E8E8E8"
														style={{
															stroke: 'color(display-p3 0.9097 0.9096 0.9096)',
															strokeOpacity: 1,
														}}
														strokeWidth="1.19997"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</label>
										</div>
										<input
											type="number"
											className="settings-input"
											value={info.maxBookings}
											onChange={handleMaxBookingsChange}
											disabled={!info.maxBookingsEnabled}
											min={1}
											max={1000}
										/>
									</div>
								</div>
								{/* <div className="settings-row">
									<div className="settings-label">Guest permissions</div>
									<div className="settings-control">
										<input
											type="checkbox"
											checked={info.guestPermission}
											onChange={handleGuestPermissionChange}
										/>
										<span className="settings-checkbox-label">
											Guests can invite others
										</span>
									</div>
									<div className="settings-desc settings-desc-guest">
										After booking an appointment guests can modify the calendar
										event to invite others
									</div>
								</div> */}
							</div>
						</Collapse.Panel>
					</Collapse>
				</div>
				<div className="scheduler-footer">
					<div className="discard-button" onClick={handleClose}>
						Discard
					</div>
					<button
						className="update-button"
						onClick={handleCreateOrUpdate}
						disabled={
							info?.creatingSessionLoading ||
							(activeTab === 'group' && info.errors.inviteeLimit)
						}
						style={{
							cursor:
								info?.creatingSessionLoading ||
								(activeTab === 'group' && info.errors.inviteeLimit)
									? 'not-allowed'
									: 'pointer',
							opacity:
								info?.creatingSessionLoading ||
								(activeTab === 'group' && info.errors.inviteeLimit)
									? 0.6
									: 1,
						}}
					>
						{info?.creatingSessionLoading ? (
							<>
								<Spinner width="16px" height="16px" />
								{mode === 'create' ? 'Creating...' : 'Updating...'}
							</>
						) : mode === 'create' ? (
							'Create Session'
						) : (
							'Update'
						)}
					</button>
				</div>

				{info.showColorPicker && (
					<div className="color-picker-modal">
						<div className="color-picker-content">
							<div className="color-picker-header">
								<h3>Pick a color</h3>
								<CloseIcon
									className="close-icon"
									onClick={() =>
										setInfo((prev) => ({ ...prev, showColorPicker: false }))
									}
								/>
							</div>
							<div className="colorPicker">
								{info.colorsArray.map((colorCode) => (
									<label
										htmlFor={colorCode}
										className="colorCircle"
										style={{ backgroundColor: colorCode }}
										key={colorCode}
									>
										<input
											type="radio"
											name="color"
											value={colorCode}
											id={colorCode}
											checked={colorCode === info.sessionColor}
											onChange={(e) => {
												setInfo((prev) => ({
													...prev,
													sessionColor: e.target.value,
													showColorPicker: false,
												}));
											}}
										/>
										<div className="innerCircle"></div>
									</label>
								))}
							</div>
						</div>
					</div>
				)}
			</div>

			<ShareModal
				isOpen={info?.isShareModalOpen}
				onClose={() => setInfo((prev) => ({ ...prev, isShareModalOpen: false }))}
				// Tabs
				tabs={[{ value: 'share', label: 'Share' }]}
				activeTab="share"
				showSlugField={true}
				copySlug={`${
					tennantSettingsData?.customDomain ||
					`${localStorage.getItem('workspaceId')}.ve.ai`
				}/meet/${info?.prevSlug}`}
				slugValue={info?.slugValue}
				showShareTab={true}
				showPublishTab={false}
				showCopyLink={true}
				onCopyLink={handleCopyLink}
				copyLinkText="Copy Link"
				customStyles={{ overflow: 'hidden' }}
				showInviteSection={false}
				onSlugChange={handleSlugChange}
				slugError={info.slugError}
				tennantSettingsData={tennantSettingsData}
			/>
		</Drawer>
	);
};

export default memo(SchedulerRightDrawer);

import { memo, useCallback, useState, useEffect, useContext, useRef } from 'react';
import '../../../assets/scss/calendar/schedulerRightDrawer.scss';
import { Collapse, Drawer, Tooltip } from 'antd';
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
import PhoneInput from 'react-phone-number-input';
import dayjs from 'dayjs';
import Spinner from '../loaders/Spinner';
import { isURL } from '../../../helpers';
import AvailabilitySection from './AvailabilitySection';

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
	timeZone: 'India, Sri Lanka Time',
	timeZoneOpen: false,
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
		// { key: 'host', icon: <UserIcon className="collapse-icon" />, label: 'Host' },
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
		// { key: 'host', icon: <UserIcon className="collapse-icon" />, label: 'Host' },
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
const timeZoneOptions = ['India, Sri Lanka Time', 'UTC', 'US Pacific Time', 'Europe Central Time'];

const SchedulerRightDrawer = ({
	open,
	onClose,
	mode = 'create',
	sessionData,
	onSessionCreated,
	onSessionUpdated,
	initialTab = 'one-on-one',
	sessionId,
}) => {
	const {
		calendarInfo: {
			createdSession,
			createSchedulerSession,
			getSchedulerSessionDetail,
			updateSchedulerSession,
			sessionDetail,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({ ...initialInfo });
	const [activeTab, setActiveTab] = useState(initialTab);
	const [availabilitySummary, setAvailabilitySummary] = useState('');
	const [originalData, setOriginalData] = useState(null);
	const [updating, setUpdating] = useState(false);
	const updateTimer = useRef(null);

	// Fetch session details in edit mode
	useEffect(() => {
		if (mode === 'edit' && sessionId && open) {
			getSchedulerSessionDetail(sessionId);
		}
	}, [mode, sessionId, open]);

	// Populate form with fetched session details
	useEffect(() => {
		if (mode === 'edit' && sessionDetail && sessionDetail._id === sessionId) {
			setInfo({
				...initialInfo,
				...sessionDetail,
				sessionType: backendToUiSessionType(sessionDetail.sessionTypeInfo?.sessionType),
				location: sessionDetail.sessionTypeInfo?.location || '',
				phoneNumber: sessionDetail.sessionTypeInfo?.phone || '',
				meetingLink: sessionDetail.sessionTypeInfo?.meetingLink || '',
				scheduleFrom: sessionDetail.sessionWindow?.startDate || null,
				scheduleTo: sessionDetail.sessionWindow?.endDate || null,
				availability: sessionDetail.availability || {},
				// Buffer mapping
				bufferEnabled: !!sessionDetail.bufferTime?.after?.unitCount,
				bufferValue: sessionDetail.bufferTime?.after?.unitCount || 60,
				bufferUnit:
					sessionDetail.bufferTime?.after?.unitType === 'Hours' ? 'Hours' : 'Minutes',
				// Invitee mapping
				inviteeLimit: sessionDetail.sessionMetadata?.maxParticipants || '',
			});
			setActiveTab(sessionDetail.sessionTypeInfo?.sessionType || 'one-on-one');
			setOriginalData(sessionDetail);
		}
	}, [mode, sessionDetail, sessionId]);

	// Add mapping function
	const backendToUiSessionType = (backendType) => {
		if (backendType === 'one-on-one') return 'In Person';
		if (backendType === 'group') return 'In Person'; // Adjust if needed
		if (backendType === 'round-robin') return 'In Person'; // Adjust if needed
		return 'In Person'; // fallback
	};

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

	const handleCreateOrUpdate = useCallback(() => {
		// Log all form data for debugging, including duration and all fields
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
				.filter((day) => day.slots.length > 0)
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
				setInfo((prev) => ({
					...prev,
					creatingSessionLoading: false,
					errors: { ...prev.errors, availability: true },
				}));
				return;
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
		}

		// Always include sessionWindow: for custom use custom dates, otherwise use today + 2 weeks
		let sessionWindow;
		if (info.availability?.mode === 'custom') {
			sessionWindow = {
				type: 'fixed_date_range',
				startDate: info.availability.custom.start,
				endDate: info.availability.custom.never ? null : info.availability.custom.end,
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
				sessionType: activeTab, // Use activeTab instead of info.sessionType
				location: info?.location,
				phone: info?.phoneNumber,
				meetingLink: info?.meetingLink,
			},
			sessionWindow,
			sessionTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			sessionColor: '#4287F5', // Default for now
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
			createSchedulerSession(sessionPayload);
		} else if (mode === 'edit') {
			const payload = buildUpdatePayload(info, originalData);
			if (Object.keys(payload).length === 0) {
				message.info('No changes to update.');
				setInfo((prev) => ({ ...prev, creatingSessionLoading: false }));
				return;
			}
			setInfo((prev) => ({ ...prev, creatingSessionLoading: true }));
			updateSchedulerSession(sessionId, payload)
				.then(() => {
					message.success('Session updated successfully!');
					getSchedulerSessionDetail(sessionId);
				})
				.catch(() => {
					message.error('Failed to update session.');
				})
				.finally(() => setInfo((prev) => ({ ...prev, creatingSessionLoading: false })));
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
		getSchedulerSessionDetail,
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
					style={{ backgroundColor: 'var(--popup)', border: '1px solid var(--stroke)' }}
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

	return (
		<Drawer
			open={open}
			onClose={handleClose}
			placement="right"
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
			rootClassName="ai-suggestions-drawer"
		>
			<div className="scheduler-right-drawer-container">
				<div className="scheduler-right-drawer-header-container">
					<CloseIcon className="close-icon" onClick={handleClose} />
					<div className="scheduler-right-drawer-header-title-container">
						<EyeIcon className="eye-icon" />
						<ShareIcon className="share-icon" />
						<BinIcon className="bin-icon" />
					</div>
				</div>
				<div className="scheduler-right-drawer-header">
					<input
						type="text"
						className="scheduler-right-drawer-title rightDrawerInputHeight"
						value={info.sessionName}
						onChange={(e) => handleFieldChange('sessionName', e.target.value)}
						autoComplete="off"
					/>
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
								if (!e.target.value) handleFieldChange('sessionDescription', '');
							}}
							onChange={(e) =>
								handleFieldChange('sessionDescription', e.target.value)
							}
							autoComplete="off"
						/>
					</p>
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
									dynamicValue = info.hostName || 'Avinash (you)';
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
												<div className="duration-label">Time Zone</div>
												<div className="duration-field">
													<div className="typeOfSession-lable">
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
															title={
																<div className="createSession-sessionType-dropdown">
																	{timeZoneOptions.map(
																		(option) => (
																			<div
																				key={option}
																				className="sessionType-dropdown-item"
																				onClick={() =>
																					handleFieldChange(
																						'timeZone',
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
																{info.timeZone}
															</div>
														</Tooltip>
													</div>
												</div>
											</div>
											<div className="duration-row">
												<div className="duration-label">
													Appointment duration
												</div>
												<div className="duration-field">
													<input
														className="inputHeight duration-appointment-input"
														placeholder="Custom"
													/>
												</div>
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
												<div className="duration-field">
													<div className="typeOfSession-lable">
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
											<div className="duration-allday-row">
												<input
													type="checkbox"
													id="allday-event"
													className="duration-allday-checkbox"
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
													className="duration-allday-label"
												>
													All Day Event
												</label>
											</div>
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
													className="inputHeight invitee-input"
													type="number"
													min="1"
													value={info.inviteeLimit || ''}
													onChange={(e) =>
														handleFieldChange(
															'inviteeLimit',
															e.target.value,
														)
													}
													placeholder="Enter limit"
												/>
											</div>
										</div>
									);
									break;
								case 'host':
									content = (
										<div className="collapse-content host-collapse-content">
											<div className="host-row">
												<div className="host-label">Host</div>
												<div className="host-value">
													{info.hostName || 'Avinash (you)'}
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
					<div
						className="update-button"
						onClick={handleCreateOrUpdate}
						disabled={info?.creatingSessionLoading}
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
					</div>
				</div>
			</div>
		</Drawer>
	);
};

export default memo(SchedulerRightDrawer);

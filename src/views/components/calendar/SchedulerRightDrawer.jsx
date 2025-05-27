import { memo, useCallback, useState, useEffect, useContext } from 'react';
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
	maxBookingsEnabled: false,
	maxBookings: 60,
	guestPermission: false,
	durationValue: 12,
	durationUnit: 'hrs',
	allDayEvent: false,
	timeZone: 'India, Sri Lanka Time',
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

const SchedulerRightDrawer = ({
	open,
	onClose,
	mode = 'create',
	sessionData,
	onSessionCreated,
	onSessionUpdated,
}) => {
	const {
		calendarInfo: { createdSession, createSchedulerSession },
	} = useContext(Context);

	const [info, setInfo] = useState({ ...initialInfo });
	const [activeTab, setActiveTab] = useState('one-on-one');
	const [availabilitySummary, setAvailabilitySummary] = useState('');

	useEffect(() => {
		if (mode === 'edit' && sessionData) {
			setInfo({
				...initialInfo,
				...sessionData,
				sessionType: sessionData.sessionTypeInfo?.sessionType || 'In Person',
				location: sessionData.sessionTypeInfo?.location || '',
				phoneNumber: sessionData.sessionTypeInfo?.phone || '',
				meetingLink: sessionData.sessionTypeInfo?.meetingLink || '',
				scheduleFrom: sessionData.sessionWindow?.startDate || null,
				scheduleTo: sessionData.sessionWindow?.endDate || null,
			});
		} else if (mode === 'create') {
			setInfo({ ...initialInfo });
		}
	}, [mode, sessionData, open]);

	useEffect(() => {
		if (createdSession && mode === 'create') {
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
		console.log('Scheduler Form Data:', info);
		// Validate date range
		if (info?.scheduleFrom && info?.scheduleTo && info?.scheduleTo <= info?.scheduleFrom) {
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
		const sessionPayload = {
			sessionName: info?.sessionName,
			sessionDescription: info?.sessionDescription,
			sessionTypeInfo: {
				sessionType: info?.sessionType,
				location: info?.location,
				phone: info?.phoneNumber,
				meetingLink: info?.meetingLink,
			},
			sessionWindow: {
				type: 'fixed_date_range',
				startDate: info?.scheduleFrom,
				endDate: info?.scheduleTo,
			},
			sessionTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		};
		if (mode === 'create') {
			createSchedulerSession(sessionPayload);
		} else if (mode === 'edit') {
			onSessionUpdated?.(sessionPayload);
			setInfo((prev) => ({ ...prev, creatingSessionLoading: false }));
			handleClose();
		}
	}, [info, mode, createSchedulerSession, onSessionUpdated, handleClose]);

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
		{ id: 'round-robin', label: 'Round Robin' },
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
						onFocus={(e) => {
							if (e.target.value === 'Add Title')
								setInfo((prev) => ({ ...prev, sessionName: '' }));
						}}
						onBlur={(e) => {
							if (!e.target.value) setInfo((prev) => ({ ...prev, sessionName: '' }));
						}}
						onChange={(e) =>
							setInfo((prev) => ({
								...prev,
								sessionName: e.target.value,
								errors: { ...prev.errors, sessionName: false },
							}))
						}
						disabled={mode === 'edit' && !info.sessionName}
						autoComplete="off"
					/>
					<p className="scheduler-description">
						<input
							type="text"
							className="rightDrawerInputHeight"
							value={info.sessionDescription}
							onFocus={(e) => {
								if (e.target.value === 'Add a description for the session')
									setInfo((prev) => ({ ...prev, sessionDescription: '' }));
							}}
							onBlur={(e) => {
								if (!e.target.value)
									setInfo((prev) => ({ ...prev, sessionDescription: '' }));
							}}
							onChange={(e) =>
								setInfo((prev) => ({ ...prev, sessionDescription: e.target.value }))
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
													<select
														className="inputHeight duration-timezone-select"
														value={info.timeZone}
														onChange={(e) =>
															setInfo((prev) => ({
																...prev,
																timeZone: e.target.value,
															}))
														}
													>
														<option>India, Sri Lanka Time</option>
														<option>UTC</option>
														<option>US Pacific Time</option>
														<option>Europe Central Time</option>
													</select>
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
															setInfo((prev) => ({
																...prev,
																durationValue: e.target.value,
															}))
														}
														placeholder="12"
													/>
												</div>
												<select
													className="inputHeight duration-unit-select"
													value={info.durationUnit}
													onChange={(e) =>
														setInfo((prev) => ({
															...prev,
															durationUnit: e.target.value,
														}))
													}
												>
													<option>hrs</option>
													<option>min</option>
												</select>
											</div>
											<div className="duration-allday-row">
												<input
													type="checkbox"
													id="allday-event"
													className="duration-allday-checkbox"
													checked={info.allDayEvent}
													onChange={(e) =>
														setInfo((prev) => ({
															...prev,
															allDayEvent: e.target.checked,
														}))
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
															setInfo((prev) => ({
																...prev,
																sessionTypeOpen: visible,
															}))
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
												onChange={(val) =>
													setInfo((prev) => ({
														...prev,
														availability: val,
													}))
												}
												onSummaryChange={setAvailabilitySummary}
											/>
										</div>
									);
									break;
								case 'invitee':
									content = (
										<div className="collapse-content invitee-collapse-content">
											<div className="invitee-row">
												<div className="invitee-label">Invitee limit</div>
												<input
													className="inputHeight invitee-input"
													type="number"
													min="1"
													value={info.inviteeLimit || ''}
													onChange={(e) =>
														setInfo((prev) => ({
															...prev,
															inviteeLimit: e.target.value,
														}))
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
										<input
											type="checkbox"
											checked={info.bufferEnabled}
											onChange={handleBufferEnabledChange}
										/>
										<input
											type="number"
											className="settings-input"
											value={info.bufferValue}
											onChange={handleBufferValueChange}
											disabled={!info.bufferEnabled}
											min={1}
											max={1440}
										/>
										<select
											className="settings-select"
											value={info.bufferUnit}
											onChange={handleBufferUnitChange}
											disabled={!info.bufferEnabled}
										>
											<option>Minutes</option>
											<option>Hours</option>
										</select>
									</div>
								</div>
								<div className="settings-row">
									<div className="settings-label">Maximum bookings per day</div>
									<div className="settings-desc">
										Limit how many booked appointments to accept in a single day
									</div>
									<div className="settings-control">
										<input
											type="checkbox"
											checked={info.maxBookingsEnabled}
											onChange={handleMaxBookingsEnabledChange}
										/>
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
								<div className="settings-row">
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
								</div>
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

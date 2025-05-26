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
};

const COLLAPSE_CONFIG = {
	'one-on-one': [
		{
			key: 'duration',
			icon: <ClockIcon className="collapse-icon" />,
			label: 'Duration',
			value: '12 Hrs',
			description: 'Duration details here.',
		},
		{
			key: 'mode',
			icon: <VideoIcon className="collapse-icon" />,
			label: 'Mode of Interaction',
			value: 'Choose a platform',
			description: 'Choose a platform for the meeting.',
		},
		{
			key: 'availability',
			icon: <CalendarIcon className="collapse-icon" />,
			label: 'Availability',
			value: 'Weekdays, 9 AM - 5 AM',
			description: 'Set your available days and times.',
		},
		{
			key: 'settings',
			icon: <SettingsIcon className="collapse-icon" />,
			label: 'Booked appointment settings',
			value: 'No buffer time - No max booking per day - No guest permission',
			description: 'Appointment settings details.',
		},
		{
			key: 'host',
			icon: <UserIcon className="collapse-icon" />,
			label: 'Host',
			value: 'Avinash (you)',
			description: 'Host details.',
		},
	],
	group: [
		{
			key: 'duration',
			icon: <ClockIcon className="collapse-icon" />,
			label: 'Duration',
			value: '12 Hrs',
			description: 'Duration details here.',
		},
		{
			key: 'mode',
			icon: <VideoIcon className="collapse-icon" />,
			label: 'Mode of Interaction',
			value: 'Choose a platform',
			description: 'Choose a platform for the meeting.',
		},
		{
			key: 'availability',
			icon: <CalendarIcon className="collapse-icon" />,
			label: 'Availability',
			value: 'Weekdays, 9 AM - 5 AM',
			description: 'Set your available days and times.',
		},
		{
			key: 'invitee',
			icon: <UserIcon className="collapse-icon" />,
			label: 'Invitee limit',
			value: '2 Invitees',
			description: 'Set the maximum number of invitees.',
		},
		{
			key: 'settings',
			icon: <SettingsIcon className="collapse-icon" />,
			label: 'Booked appointment settings',
			value: 'No buffer time - No max booking per day - No guest permission',
			description: 'Appointment settings details.',
		},
		{
			key: 'host',
			icon: <UserIcon className="collapse-icon" />,
			label: 'Host',
			value: 'Avinash (you)',
			description: 'Host details.',
		},
	],
	'round-robin': [
		{
			key: 'duration',
			icon: <ClockIcon className="collapse-icon" />,
			label: 'Duration',
			value: '12 Hrs',
			description: 'Duration details here.',
		},
		{
			key: 'mode',
			icon: <VideoIcon className="collapse-icon" />,
			label: 'Mode of Interaction',
			value: 'Choose a platform',
			description: 'Choose a platform for the meeting.',
		},
		{
			key: 'availability',
			icon: <CalendarIcon className="collapse-icon" />,
			label: 'Availability',
			value: 'Weekdays, 9 AM - 5 AM',
			description: 'Set your available days and times.',
		},
		{
			key: 'settings',
			icon: <SettingsIcon className="collapse-icon" />,
			label: 'Booked appointment settings',
			value: 'No buffer time - No max booking per day - No guest permission',
			description: 'Appointment settings details.',
		},
		{
			key: 'host',
			icon: <UserIcon className="collapse-icon" />,
			label: 'Host',
			value: 'Avinash (you)',
			description: 'Host details.',
		},
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

	const handleClose = useCallback(() => {
		setInfo({ ...initialInfo });
		onClose();
	}, [onClose]);

	const handleCreateOrUpdate = useCallback(() => {
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
						className="scheduler-right-drawer-title inputHeight"
						value={info.sessionName}
						onChange={(e) =>
							setInfo((prev) => ({
								...prev,
								sessionName: e.target.value,
								errors: { ...prev.errors, sessionName: false },
							}))
						}
						placeholder="Add title"
						disabled={mode === 'edit' && !info.sessionName}
						autoComplete="off"
					/>
					<p className="scheduler-description">
						<input
							type="text"
							className="inputHeight"
							value={info.sessionDescription}
							onChange={(e) =>
								setInfo((prev) => ({ ...prev, sessionDescription: e.target.value }))
							}
							placeholder="Join us for a brief tech meeting where we'll discuss the latest innovations and strategies in our field."
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
				<div className="sessionOptionContainer">
					<div className="sessionTypeWrapper">
						<span>Session Type</span>
						<Tooltip
							open={info?.sessionTypeOpen}
							onOpenChange={(visible) =>
								setInfo((prev) => ({ ...prev, sessionTypeOpen: visible }))
							}
							placement="bottom"
							distance={0}
							title={
								<div className="createSession-sessionType-dropdown">
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
							trigger={'click'}
							color={'transparent'}
							overlayStyle={{ width: '100%', padding: '0' }}
						>
							<div className="typeOfSession-lable">
								{info?.sessionType}
								{/* Down arrow icon */}
							</div>
						</Tooltip>
					</div>
					<div className="sessionTypeWrapper">
						<span>{sessionTypeInputConfig[info?.sessionType]?.tag}</span>
						{renderSessionTypeInput()}
					</div>
				</div>
				<div className="sessionDateTimeContainer">
					<div className="sessionTypeWrapper">
						<span>Start Date & Time</span>
						<div className="events-popup-time-wrapper">
							<input
								type="date"
								className="events-popup-date-input"
								value={
									info?.scheduleFrom
										? dayjs(info.scheduleFrom).format('YYYY-MM-DD')
										: ''
								}
								min={dayjs().format('YYYY-MM-DD')}
								onChange={(e) => {
									const newDate = e.target.value;
									const currentTime = info?.scheduleFrom
										? dayjs(info.scheduleFrom).format('HH:mm')
										: dayjs().format('HH:mm');
									const newDateTime = dayjs(`${newDate} ${currentTime}`);
									if (newDateTime.isBefore(dayjs(), 'minute')) return;
									setInfo((prev) => ({
										...prev,
										scheduleFrom: newDateTime,
										errors: { ...prev.errors, dateRange: false },
									}));
								}}
							/>
							<div className="time-date-divider"></div>
							<input
								type="time"
								className="events-popup-time-input"
								value={
									info?.scheduleFrom
										? dayjs(info.scheduleFrom).format('HH:mm')
										: ''
								}
								onChange={(e) => {
									const newTime = e.target.value;
									const currentDate = info?.scheduleFrom
										? dayjs(info.scheduleFrom).format('YYYY-MM-DD')
										: dayjs().format('YYYY-MM-DD');
									const newDateTime = dayjs(`${currentDate} ${newTime}`);
									if (newDateTime.isBefore(dayjs(), 'minute')) return;
									setInfo((prev) => ({
										...prev,
										scheduleFrom: newDateTime,
										errors: { ...prev.errors, dateRange: false },
									}));
								}}
							/>
						</div>
					</div>
					<div className="sessionTypeWrapper">
						<span>End Date & Time</span>
						<div className="events-popup-time-wrapper">
							<input
								type="date"
								className="events-popup-date-input"
								value={
									info?.scheduleTo
										? dayjs(info.scheduleTo).format('YYYY-MM-DD')
										: ''
								}
								min={
									info?.scheduleFrom
										? dayjs(info.scheduleFrom).format('YYYY-MM-DD')
										: dayjs().format('YYYY-MM-DD')
								}
								onChange={(e) => {
									const newDate = e.target.value;
									const currentTime = info?.scheduleTo
										? dayjs(info.scheduleTo).format('HH:mm')
										: dayjs().format('HH:mm');
									const newDateTime = dayjs(`${newDate} ${currentTime}`);
									if (newDateTime.isBefore(dayjs(), 'minute')) return;
									setInfo((prev) => ({
										...prev,
										scheduleTo: newDateTime,
										errors: { ...prev.errors, dateRange: false },
									}));
								}}
							/>
							<div className="time-date-divider"></div>
							<input
								type="time"
								className="events-popup-time-input"
								value={
									info?.scheduleTo ? dayjs(info.scheduleTo).format('HH:mm') : ''
								}
								onChange={(e) => {
									const newTime = e.target.value;
									const currentDate = info?.scheduleTo
										? dayjs(info.scheduleTo).format('YYYY-MM-DD')
										: dayjs().format('YYYY-MM-DD');
									const newDateTime = dayjs(`${currentDate} ${newTime}`);
									if (newDateTime.isBefore(dayjs(), 'minute')) return;
									setInfo((prev) => ({
										...prev,
										scheduleTo: newDateTime,
										errors: { ...prev.errors, dateRange: false },
									}));
								}}
							/>
						</div>
					</div>
				</div>
				{info.errors.dateRange && (
					<div
						className="error-message"
						style={{ color: 'red', marginTop: '5px', textAlign: 'center' }}
					>
						End date must be greater than start date
					</div>
				)}
				<div className="scheduler-content">
					<Collapse className="scheduler-collapse" defaultActiveKey={['duration']}>
						<Collapse.Panel
							header={
								<div className="collapse-header">
									<ClockIcon className="collapse-icon" />
									<span>Duration</span>
									<span className="collapse-value">
										{info.scheduleFrom && info.scheduleTo
											? dayjs(info.scheduleTo).diff(
													dayjs(info.scheduleFrom),
													'hour',
											  ) + ' Hrs'
											: ''}
									</span>
								</div>
							}
							key="duration"
						>
							<div className="collapse-content">Duration details here.</div>
						</Collapse.Panel>
						<Collapse.Panel
							header={
								<div className="collapse-header">
									<VideoIcon className="collapse-icon" />
									<span>Mode of Interaction</span>
									<span className="collapse-value">{info.sessionType}</span>
								</div>
							}
							key="mode"
						>
							<div className="collapse-content">
								Choose a platform for the meeting.
							</div>
						</Collapse.Panel>
						<Collapse.Panel
							header={
								<div className="collapse-header">
									<CalendarIcon className="collapse-icon" />
									<span>Availability</span>
									<span className="collapse-value">
										{info.scheduleFrom && info.scheduleTo
											? `${dayjs(info.scheduleFrom).format(
													'dddd, h:mm A',
											  )} - ${dayjs(info.scheduleTo).format('dddd, h:mm A')}`
											: ''}
									</span>
								</div>
							}
							key="availability"
						>
							<div className="collapse-content">
								Set your available days and times.
							</div>
						</Collapse.Panel>
						<Collapse.Panel
							header={
								<div className="collapse-header">
									<SettingsIcon className="collapse-icon" />
									<span>Booked appointment settings</span>
									<span className="collapse-value">
										No buffer time - No max booking per day - No guest
										permission
									</span>
								</div>
							}
							key="settings"
						>
							<div className="collapse-content">Appointment settings details.</div>
						</Collapse.Panel>
						<Collapse.Panel
							header={
								<div className="collapse-header">
									<UserIcon className="collapse-icon" />
									<span>Host</span>
									<span className="collapse-value">Avinash (you)</span>
								</div>
							}
							key="host"
						>
							<div className="collapse-content">Host details.</div>
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

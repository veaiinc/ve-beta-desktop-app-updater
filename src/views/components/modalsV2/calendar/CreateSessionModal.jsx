import { memo, useCallback, useContext, useEffect, useState } from 'react';
import ReactModal from '../index';
import '../../../../assets/scss/calendar/modal/createSessionModal.scss';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import { ReactComponent as Down } from '../../../../assets/svg/calendar/down.svg';
import { ReactComponent as DateSvg } from '../../../../assets/svg/calendar/date.svg';
import InputComponent from '../../ai_assistant/InputComponent';
import { Tooltip, DatePicker } from 'antd';
import dayjs from 'dayjs';
import Context from '../../../../context/context';
import Spinner from '../../loaders/Spinner';
import PhoneInput from 'react-phone-number-input';
import { isURL } from '../../../../helpers';

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
	sessionName: null,
	sessionDescription: null,
	sessionType: 'In Person',
	sessionTypeOpen: false,
	location: null,
	phoneNumber: null,
	meetingLink: null,
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

const CreateSessionModal = ({ open, closeModal, onSessionCreated }) => {
	const {
		calendarInfo: { createdSession, createSchedulerSession },
	} = useContext(Context);

	const [info, setInfo] = useState({
		...initialInfo,
	});

	useEffect(() => {
		if (createdSession) {
			ModifyCloseModal();
			onSessionCreated?.(createdSession);
		}
	}, [createdSession]);

	const handleCreateSession = useCallback(() => {
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
		createSchedulerSession(sessionPayload);
	}, [info]);

	const ModifyCloseModal = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			...initialInfo,
		}));
		closeModal();
	}, [closeModal]);

	const handleSessionTypeChange = useCallback((type) => {
		if (type === info?.sessionDescription) return;
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
			//no need to validate phone number
			// if (config.value === 'phoneNumber') {
			// 	setInfo((prev) => ({
			// 		...prev,
			// 		errors: { ...prev.errors, phoneNumber: false },
			// 	}));
			// 	return true;
			// } else
			if (config.value === 'meetingLink') {
				// Validate URL format
				const err = !isURL(value);
				setInfo((prev) => ({
					...prev,
					errors: { ...prev.errors, meetingLink: err },
				}));
			}
			return true;
		};

		const handleChange = (value) => {
			if (config.value === 'phoneNumber') {
				setInfo((prev) => ({
					...prev,
					[config.value]: value,
					errors: { ...prev.errors, sessionTypeInput: false },
				}));
			} else {
				setInfo((prev) => ({
					...prev,
					[config.value]: value,
					errors: { ...prev.errors, sessionTypeInput: false },
				}));
			}
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

	return (
		<ReactModal
			isOpen={open}
			closeModal={ModifyCloseModal}
			modalType={'center'}
			customStyles={{
				content: { zIndex: 1003, borderRadius: '24px' },
				overlay: { zIndex: 1002 },
			}}
		>
			<header className="popup-header">
				<span>Create a Session</span>
				<Close onClick={ModifyCloseModal} />
			</header>
			<div className="calendar-create-session-modal-container">
				<div className="sessionNameContainer">
					<div className="sessionNameLabel">Session Name</div>
					<input
						type="text"
						className={`inputHeight ${info.errors.sessionName ? 'error' : ''}`}
						value={info?.sessionName || ''}
						onChange={(e) =>
							setInfo((prev) => ({
								...prev,
								sessionName: e.target.value,
								errors: { ...prev.errors, sessionName: false },
							}))
						}
						placeholder={'E.g. Screening'}
						autoComplete="off"
					/>
				</div>

				<div className="sessionDescriptionWrapper">
					<div className="sessionDescriptionLabel">Description</div>
					<input
						type="text"
						className="inputHeight"
						value={info?.sessionDescription || ''}
						onChange={(e) =>
							setInfo((prev) => ({
								...prev,
								sessionDescription: e.target.value,
							}))
						}
						placeholder={'Add a description for the session'}
						autoComplete="off"
					/>
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
								<Down className={`${info?.sessionTypeOpen ? 'open' : ''}`} />
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
								onChange={(e) => {
									const newDate = e.target.value;
									const currentTime = info?.scheduleFrom
										? dayjs(info.scheduleFrom).format('HH:mm')
										: '00:00';
									const newDateTime = dayjs(`${newDate} ${currentTime}`);
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
								onChange={(e) => {
									const newDate = e.target.value;
									const currentTime = info?.scheduleTo
										? dayjs(info.scheduleTo).format('HH:mm')
										: '00:00';
									const newDateTime = dayjs(`${newDate} ${currentTime}`);
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

				<div className="scheduleBtnContainer">
					<div
						className="csm-action-button csm-action-button--secondary"
						onClick={ModifyCloseModal}
					>
						Discard
					</div>
					<div
						className={`csm-action-button csm-action-button--primary ${
							info?.creatingSessionLoading ? 'csm-action-button--disabled' : ''
						}`}
						onClick={handleCreateSession}
						disabled={info?.creatingSessionLoading}
					>
						{info?.creatingSessionLoading ? (
							<>
								<Spinner width="16px" height="16px" />
								Creating...
							</>
						) : (
							'Create'
						)}
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(CreateSessionModal);

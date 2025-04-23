import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
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

const sessionTypeOptions = ['In Person', 'Phone Call', 'Video Call'];

const sessionTypeInputConfig = {
	'In Person': {
		value: 'location',
		tag: 'Location',
		type: 'text',
		placeholder: '',
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
		placeholder: '',
	},
};

const initialInfo = {
	creatingSessionLoading: false,
	sessionName: null,
	sessionDescription: null,
	addDiscription: false,
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
			console.log('createdSession==>', createdSession);
			ModifyCloseModal();
			onSessionCreated?.(createdSession);
		}
	}, [createdSession]);

	const handleCreateSession = useCallback(() => {
		// Validate date range
		if (info.scheduleFrom && info.scheduleTo && info.scheduleTo <= info.scheduleFrom) {
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
			if (config.value === 'phoneNumber') {
				setInfo((prev) => ({
					...prev,
					errors: { ...prev.errors, phoneNumber: false },
				}));
				return true;
			} else if (config.value === 'meetingLink') {
				// Validate URL format
				try {
					new URL(value);
					setInfo((prev) => ({
						...prev,
						errors: { ...prev.errors, meetingLink: false },
					}));
					return true;
				} catch {
					setInfo((prev) => ({
						...prev,
						errors: { ...prev.errors, meetingLink: true },
					}));
					return false;
				}
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
				/>
			);
		}

		return (
			<InputComponent
				type={config.type}
				value={info[config.value]}
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
			<div className="createSessionModalParentContainer">
				<div className="sessionHeader">
					<span>Create a Session</span>
					<Close onClick={ModifyCloseModal} />
				</div>
				<div className="sessionNameContainer">
					<div className="sessionNameLabel">Session Name</div>
					<InputComponent
						className={`inputHeight ${info.errors.sessionName ? 'error' : ''}`}
						value={info?.sessionName}
						onChange={(e) =>
							setInfo((prev) => ({
								...prev,
								sessionName: e.target.value,
								errors: { ...prev.errors, sessionName: false },
							}))
						}
						placeholder={''}
					/>
					<div
						className={`addSessionDesc ${info?.addDiscription ? 'hidden' : ''}`}
						onClick={() =>
							setInfo((prev) => ({ ...prev, addDiscription: !prev.addDiscription }))
						}
					>
						Add Instruction
					</div>
				</div>

				<div
					className={`sessionDescriptionWrapper ${info?.addDiscription ? 'visible' : ''}`}
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

				<div className="sessionOptionContainer">
					<div className="sessionTypeWrapper">
						<span>From</span>
						<DatePicker
							format="DD MMM YYYY hh:mm A"
							allowClear
							showTime={true}
							value={info?.scheduleFrom}
							onChange={(value) => {
								setInfo((prev) => ({
									...prev,
									scheduleFrom: value,
									errors: { ...prev.errors, dateRange: false },
								}));
							}}
							className="typeOfSession-lable"
							suffixIcon={<DateSvg />}
							disabledDate={(current) => {
								return current && current < dayjs().startOf('day');
							}}
						/>
					</div>
					<div className="sessionTypeWrapper">
						<span>To</span>
						<DatePicker
							format="DD MMM YYYY hh:mm A"
							allowClear
							showTime={true}
							value={info.scheduleTo}
							onChange={(value) => {
								setInfo((prev) => ({
									...prev,
									scheduleTo: value,
									errors: { ...prev.errors, dateRange: false },
								}));
							}}
							className="typeOfSession-lable"
							suffixIcon={<DateSvg />}
							disabledDate={(current) => {
								return (
									current &&
									current < (info?.scheduleFrom || dayjs().startOf('day'))
								);
							}}
						/>
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
					<button
						className={`scheduleBtn `}
						style={info?.creatingSessionLoading ? { background: 'grey' } : {}}
						onClick={handleCreateSession}
					>
						{info?.creatingSessionLoading ? (
							<span className="loading">
								<Spinner width="16px" height="16px" />
								Creating...
							</span>
						) : (
							'Create'
						)}
					</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(CreateSessionModal);

// Add styles for phone input
const styles = `
	.phoneInputNumber {
		width: 100%;
		height: 40px;
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 0 12px;
		font-size: 14px;
		background: var(--card);
		color: var(--primary-font);
	}

	.phoneInputNumber:focus {
		outline: none;
		border-color: var(--primary);
	}

	.phoneInputNumber.error {
		border-color: red;
	}

	.phoneInputNumber input {
		background: transparent;
		border: none;
		outline: none;
		width: 100%;
		height: 100%;
		color: var(--primary-font);
	}

	.phoneInputNumber .PhoneInputCountry {
		margin-right: 8px;
	}

	.phoneInputNumber .PhoneInputCountrySelect {
		background: transparent;
		border: none;
		outline: none;
		color: var(--primary-font);
	}
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

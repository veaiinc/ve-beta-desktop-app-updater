import React, { memo, useState, useCallback, useContext, useEffect } from 'react';
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

	const [info, setInfo] = useState({
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
		sessionDetail: null,
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
			MON: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
			TUE: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
			WED: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
			THU: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
			FRI: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
			SAT: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
			SUN: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
		},
		bookingPeriod: 'Day',
	});

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

			// Initialize weekly availability
			const weeklyAvailability = {
				MON: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
				TUE: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
				WED: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
				THU: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
				FRI: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
				SAT: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
				SUN: { enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
			};

			// Map availability slots
			sessionDetail.availabilitySlots.forEach((slot) => {
				const day = dayMapping[slot.dayOfWeek];
				if (day) {
					weeklyAvailability[day] = {
						enabled: true,
						slots: slot.timeRanges.map((range) => ({
							start: range.startTime,
							end: range.endTime,
						})),
					};
				}
			});

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
			console.log('Clearing session detail');
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
												onChange={() =>
													setInfo((prev) => ({
														...prev,
														weeklyAvailability: {
															...prev.weeklyAvailability,
															[day]: {
																...prev.weeklyAvailability[day],
																enabled:
																	!prev.weeklyAvailability[day]
																		.enabled,
															},
														},
													}))
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
																	setInfo((prev) => {
																		const newSlots = [
																			...prev
																				.weeklyAvailability[
																				day
																			].slots,
																		];
																		newSlots[index] = {
																			...newSlots[index],
																			start: time.format(
																				'HH:mm',
																			),
																		};
																		return {
																			...prev,
																			weeklyAvailability: {
																				...prev.weeklyAvailability,
																				[day]: {
																					...prev
																						.weeklyAvailability[
																						day
																					],
																					slots: newSlots,
																				},
																			},
																		};
																	})
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
																	setInfo((prev) => {
																		const newSlots = [
																			...prev
																				.weeklyAvailability[
																				day
																			].slots,
																		];
																		newSlots[index] = {
																			...newSlots[index],
																			end: time.format(
																				'HH:mm',
																			),
																		};
																		return {
																			...prev,
																			weeklyAvailability: {
																				...prev.weeklyAvailability,
																				[day]: {
																					...prev
																						.weeklyAvailability[
																						day
																					],
																					slots: newSlots,
																				},
																			},
																		};
																	})
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
																			setInfo((prev) => {
																				const newSlots = [
																					...prev
																						.weeklyAvailability[
																						day
																					].slots,
																					{
																						start: '09:00',
																						end: '17:00',
																					},
																				];
																				return {
																					...prev,
																					weeklyAvailability:
																						{
																							...prev.weeklyAvailability,
																							[day]: {
																								...prev
																									.weeklyAvailability[
																									day
																								],
																								slots: newSlots,
																							},
																						},
																				};
																			})
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
																				setInfo((prev) => {
																					const newSlots =
																						[
																							...prev
																								.weeklyAvailability[
																								day
																							].slots,
																						];
																					newSlots.splice(
																						index,
																						1,
																					);
																					return {
																						...prev,
																						weeklyAvailability:
																							{
																								...prev.weeklyAvailability,
																								[day]: {
																									...prev
																										.weeklyAvailability[
																										day
																									],
																									slots: newSlots,
																								},
																							},
																					};
																				})
																			}
																		>
																			-
																		</div>
																	</Tooltip>
																)}
																<Tooltip
																	title="Copy time slot to other days"
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
																			setInfo((prev) => {
																				const currentSlot =
																					prev
																						.weeklyAvailability[
																						day
																					].slots[index];
																				const updatedAvailability =
																					{};
																				[
																					'MON',
																					'TUE',
																					'WED',
																					'THU',
																					'FRI',
																					'SAT',
																					'SUN',
																				].forEach((d) => {
																					if (
																						d !== day &&
																						prev
																							.weeklyAvailability[
																							d
																						].enabled
																					) {
																						updatedAvailability[
																							d
																						] = {
																							...prev
																								.weeklyAvailability[
																								d
																							],
																							slots: [
																								...prev
																									.weeklyAvailability[
																									d
																								]
																									.slots,
																								{
																									...currentSlot,
																								},
																							],
																						};
																					} else {
																						updatedAvailability[
																							d
																						] =
																							prev.weeklyAvailability[
																								d
																							];
																					}
																				});
																				return {
																					...prev,
																					weeklyAvailability:
																						updatedAvailability,
																				};
																			})
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

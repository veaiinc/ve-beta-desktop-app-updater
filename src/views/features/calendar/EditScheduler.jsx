import React, { memo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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

const durationOptions = ['30 Mins', '45 Mins', '1 Hour', '2 Hours'];
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
		type: 'number',
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
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		startTime: dayjs(), // Set default start time to today
		endTime: dayjs().add(7, 'day'), // Set default end time to 7 days from now
		duration: '90 Mins',
		isDurationOpen: false,
		sessionDescription: '',
		addDescription: false,
		sessionType: 'In Person',
		sessionTypeOpen: false,
		location: '',
		phoneNumber: '',
		videoLink: '',
	});

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
				<SessionInfoCard />
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
								overlay={
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
							<span>Timezone: CST</span>
						</div>
						<div className="weekly-hours">
							<span className="weekly-title">WEEKLY HOURS</span>
							<div className="days-container">
								{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(
									(day, index) => (
										<div key={day} className="day-slot">
											<div className="day-header">
												<input
													type="checkbox"
													checked={index !== 0 && index !== 4}
												/>
												<span>{day}</span>
											</div>
											{index !== 0 && index !== 4 && (
												<div className="time-slots">
													<DatePicker
														showTime
														format="hh:mm A"
														picker="time"
														className="timePicker"
														defaultValue={dayjs().hour(9).minute(0)}
														suffixIcon={
															<Clock width={16} height={16} />
														}
													/>
													<span>to</span>
													<DatePicker
														showTime
														format="hh:mm A"
														picker="time"
														className="timePicker"
														defaultValue={dayjs().hour(17).minute(0)}
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
															<div className="add-slot">+</div>
														</Tooltip>
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
															<div className="copy-slot">
																<Duplicate />
															</div>
														</Tooltip>
													</div>
												</div>
											)}
										</div>
									),
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="sessionBookingLimitContainer">
					<span className="booking-title">Booking Limits</span>
					<div className="booking-options">
						<div className="booking-option">
							<input type="checkbox" id="single-use" />
							<label htmlFor="single-use">Make this a single-use link</label>
						</div>
						<div className="booking-option">
							<input type="checkbox" id="additional-attendees" />
							<label htmlFor="additional-attendees">
								Allow guests to add additional attendees
							</label>
						</div>
						<div className="booking-option">
							<input type="checkbox" id="next-booking" />
							<label htmlFor="next-booking">Don't let guests book in the next</label>
						</div>
						<div className="booking-option">
							<input type="checkbox" id="minute-mark" />
							<label htmlFor="minute-mark">Allow booking on the 15 minute mark</label>
						</div>
						<div className="booking-option">
							<input type="checkbox" id="no-meeting-day" />
							<label htmlFor="no-meeting-day">
								Let guests book on your no-meeting day
							</label>
						</div>
						<div className="booking-limit-option">
							<div className="limit-input">
								<input type="checkbox" id="booking-limit" />
								<label htmlFor="booking-limit">Only allow</label>
								<input type="number" defaultValue="5" className="number-input" />
								<span>bookings per</span>
							</div>
							<Tooltip
								placement="bottom"
								trigger="click"
								overlayClassName="booking-period-dropdown"
								overlay={
									<div className="period-options">
										{['Day', 'Week', 'Month'].map((period) => (
											<div key={period} className="period-item">
												{period}
											</div>
										))}
									</div>
								}
							>
								<div className="period-selector">
									Day
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

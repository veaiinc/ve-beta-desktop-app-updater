import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/scheduler/editScheduler.scss';
import { ReactComponent as Back } from '../../../assets/svg/subscription/back.svg';
import { ReactComponent as DateSvg } from '../../../assets/svg/calendar/date.svg';
import { ReactComponent as DownArrow } from '../../../assets/svg/activity/down.svg';
import SessionInfoCard from '../../components/scheduler/SessionInfoCard';
import { Tooltip, DatePicker } from 'antd';
import moment from 'moment';

const durationOptions = ['30 Mins', '45 Mins', '1 Hour', '2 Hours'];
const EditScheduler = () => {
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		startTime: null,
		endTime: null,
		duration: '90 Mins',
		isDurationOpen: false,
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
								format="DD MMM YYYY hh:mm A"
								allowClear
								showTime={false}
								value={info.startTime}
								onChange={handleStartDateChange}
								className="session-input"
								suffixIcon={<DateSvg />}
								disabledDate={(current) => {
									// Disable dates before today and after end date if it exists
									return (
										current < moment().startOf('day') ||
										(info.endTime && current > info.endTime)
									);
								}}
							/>
						</div>
						<div className="sessionInputWrapper">
							<span>To</span>
							<DatePicker
								format="DD MMM YYYY hh:mm A"
								allowClear
								showTime={false}
								value={info.endTime}
								onChange={handleEndDateChange}
								className="session-input"
								suffixIcon={<DateSvg />}
								disabledDate={(current) => {
									// Disable dates before start date if it exists, or before today
									return current < (info.startTime || moment().startOf('day'));
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
				</div>
			</div>
		</div>
	);
};

export default memo(EditScheduler);

import React from 'react';
import '../../../assets/scss/scheduler/schedulerAvailability.scss';
import { ReactComponent as Right } from '../../../assets/svg/activity/right.svg';
import { ReactComponent as Left } from '../../../assets/svg/activity/left.svg';

const SchedulerAvailability = () => {
	return (
		<div className="ScheduledAvailabilityContainer">
			<div className="headerContainer">
				<div className="headerLeftContainer">
					<div className="headerTitle">Time Slots</div>
					<div className="headerSubTitle">
						Effortlessly manage your time with AI scheduling.
					</div>
				</div>
				<div className="headerRightContainer">
					<div>July 7</div>
					<Left />
					<Right />
				</div>
			</div>
			<div className="weeklySlotsContainer">Week Views</div>
		</div>
	);
};

export default SchedulerAvailability;

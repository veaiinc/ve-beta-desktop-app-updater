import React, { memo } from 'react';
import '../../../assets/scss/calendar/calendarHeader.scss';
import { ReactComponent as Down } from '../../../assets/svg/activity/down.svg';

const CalendarHeader = () => {
	return (
		<>
			{/* <!-- Header Section --> */}
			<div className="calendarHeaderParentContainer">
				<div className="calendarHeaderContainer">
					<div className="calendarControls">
						<div className="calendarDate">September, 2024</div>
						<div className="viewToggleWrapper">
							<div className="viewToggle">
								<span className="toggleButton active">Month</span>
								<span className="toggleButton">Week</span>
								<span className="toggleButton">Day</span>
							</div>
						</div>
						<div className="calendarHeaderRight">
							<div className="dropDown">
								<span>Workflow</span>
								<Down />
							</div>
							<div className="dropDown">
								<span>Team</span>
								<Down />
							</div>
						</div>
					</div>

					<div className="weekHeader">
						<div className="weekHeader">
							<div className="dayHeader">
								<span>Sunday</span>
							</div>
							<div className="dayHeader">
								<span>Monday</span>
							</div>
							<div className="dayHeader">
								<span>Tuesday</span>
							</div>
							<div className="dayHeader">
								<span>Wednesday</span>
							</div>
							<div className="dayHeader">
								<span>Thursday</span>
							</div>
							<div className="dayHeader">
								<span>Friday</span>
							</div>
							<div className="dayHeader">
								<span>Saturday</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default memo(CalendarHeader);

import React, { memo } from 'react';
import '../../../assets/scss/calendar/calendarHeader.scss';
import { ReactComponent as Down } from '../../../assets/svg/activity/down.svg';
import WeekHeader from './WeekHeader';
import DayHeader from './DaysHeader';
import WeekDayHeader from './WeekDayHeader';

const CalendarHeader = ({
	label,
	onView,
	view,
	views,
	selectedWeek,
	selectedDate,
	userWorkSpaceList,
	tenantsUserList,
}) => {
	const viewsHeaders = {
		month: <WeekHeader />,
		week: <WeekDayHeader selectedWeek={selectedWeek} selectedDate={selectedDate} />,
		day: <DayHeader />,
	};
	return (
		<>
			{/* <!-- Header Section --> */}
			<div className="calendarHeaderParentContainer">
				<div className="calendarHeaderContainer">
					<div className="calendarControls">
						<div className="calendarDate">{label}</div>
						<div className="viewToggleWrapper">
							<div className="viewToggle">
								{views?.length !== 0
									? views.map((viewName) => (
											<span
												key={viewName}
												className={`toggleButton ${
													view === viewName ? 'active' : ''
												}`}
												onClick={() => onView(viewName)}
											>
												{viewName?.[0].toUpperCase() + viewName?.slice(1)}
											</span>
									  ))
									: ''}
							</div>
						</div>
						{/* <div className="calendarHeaderRight">
							<div className="dropDown">
								<span>Workflow</span>
								<Down />
							</div>
							<div className="dropDown">
								<span>Team</span>
								<Down />
							</div>
						</div> */}
					</div>

					{/* Render the active calendar day Header */}
					{viewsHeaders[view]}
				</div>
			</div>
		</>
	);
};

export default memo(CalendarHeader);

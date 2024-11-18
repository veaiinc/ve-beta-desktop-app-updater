import React, { memo, useState, useEffect } from 'react';
import '../../../assets/scss/calendar/calendarHeader.scss';
import { ReactComponent as Down } from '../../../assets/svg/activity/down.svg';
import WeekHeader from './WeekHeader';
import DayHeader from './DaysHeader';
import WeekDayHeader from './WeekDayHeader';
import moment from 'moment';

const CalendarHeader = ({
	activeView,
	selectedWeek,
	selectedDate,
	handleToggleView,
	getCurrentWeek,
}) => {
	const views = {
		Month: <WeekHeader />,
		Week: (
			<WeekDayHeader
				activeView={activeView}
				selectedWeek={selectedWeek}
				selectedDate={selectedDate}
				getCurrentWeek={getCurrentWeek}
			/>
		),
		Day: <DayHeader />,
	};
	return (
		<>
			{/* <!-- Header Section --> */}
			<div className="calendarHeaderParentContainer">
				<div className="calendarHeaderContainer">
					<div className="calendarControls">
						<div className="calendarDate">
							{moment(selectedDate).format('MMMM YYYY') || 'CALENDAR'}
						</div>
						<div className="viewToggleWrapper">
							<div className="viewToggle">
								{/* map on views Object  */}
								{Object.keys(views)?.map((view) => (
									<span
										key={view}
										className={`toggleButton ${
											activeView === view ? 'active' : ''
										}`}
										onClick={() => handleToggleView(view)}
									>
										{view}
									</span>
								))}
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

					{/* Render the active calendar day Header */}
					{views[activeView]}
				</div>
			</div>
		</>
	);
};

export default memo(CalendarHeader);

import React, { memo, useCallback, useState } from 'react';
import '../../../assets/scss/calendar/calendarHeader.scss';
import { ReactComponent as Down } from '../../../assets/svg/activity/down.svg';
import WeekHeader from './WeekHeader';
import DayHeader from './DaysHeader';
import WeekDayHeader from './WeekDayHeader';

const CalendarHeader = () => {
	const [info, setInfo] = useState({
		activeView: 'Month',
	});

	const handleToggleView = useCallback((view) => {
		setInfo((prevInfo) => ({ ...prevInfo, activeView: view }));
	}, []);

	const views = {
		Month: <WeekHeader />,
		Week: <WeekDayHeader />,
		Day: <DayHeader />,
	};
	return (
		<>
			{/* <!-- Header Section --> */}
			<div className="calendarHeaderParentContainer">
				<div className="calendarHeaderContainer">
					<div className="calendarControls">
						<div className="calendarDate">September, 2024</div>
						<div className="viewToggleWrapper">
							<div className="viewToggle">
								{/* map on views Object  */}
								{Object.keys(views)?.map((view) => (
									<span
										key={view}
										className={`toggleButton ${
											info?.activeView === view ? 'active' : ''
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
					{views[info?.activeView]}
				</div>
			</div>
		</>
	);
};

export default memo(CalendarHeader);

import React, { memo, useState, useEffect } from 'react';
import '../../../assets/scss/calendar/calendarHeader.scss';
import { ReactComponent as Down } from '../../../assets/svg/activity/down.svg';
import WeekHeader from './WeekHeader';
import DayHeader from './DaysHeader';
import WeekDayHeader from './WeekDayHeader';

const CalendarHeader = ({
	activeView,
	selectedWeek,
	selectedDate,
	getCurrentWeek,
	updateCalendarInfo,
}) => {
	// Initialize local state
	const [info, setInfo] = useState({ selectedDate: null });

	// Function to format and update the selected date
	const handleSelectedDate = (selectedDate) => {
		// console.log(`recevid selected date as: ${selectedDate}`);

		const formattedDate = selectedDate.toLocaleDateString('en-US', {
			month: 'long',
			year: 'numeric',
		});

		setInfo((prev) => ({
			...prev,
			selectedDate: formattedDate,
		}));
	};

	// Update state when selectedDate prop changes
	useEffect(() => {
		if (selectedDate) {
			handleSelectedDate(selectedDate);
		}
	}, [selectedDate]);

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
						<div className="calendarDate">{info?.selectedDate || 'CALENDAR'}</div>
						<div className="viewToggleWrapper">
							<div className="viewToggle">
								{/* map on views Object  */}
								{Object.keys(views)?.map((view) => (
									<span
										key={view}
										className={`toggleButton ${
											activeView === view ? 'active' : ''
										}`}
										onClick={() => updateCalendarInfo('activeView', view)}
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

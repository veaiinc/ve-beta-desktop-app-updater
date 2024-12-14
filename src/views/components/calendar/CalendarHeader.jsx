import React, { memo, useCallback, useState, useEffect } from 'react';
import '../../../assets/scss/calendar/calendarHeader.scss';
import { ReactComponent as Down } from '../../../assets/svg/activity/down.svg';
import { ReactComponent as Right } from '../../../assets/svg/activity/right.svg';
import { ReactComponent as Left } from '../../../assets/svg/activity/left.svg';
import WeekHeader from './WeekHeader';
import DayHeader from './DaysHeader';
import WeekDayHeader from './WeekDayHeader';
import moment from 'moment';

const MIN_YEAR = 1990;
const MAX_YEAR = 2050;

const CalendarHeader = ({
	label,
	onView,
	view,
	views,
	selectedWeek,
	selectedDate,
	userWorkSpaceList,
	tenantsUserList,
	currentCalendarDate,
	updateCalendarInfo,
}) => {
	const viewsHeaders = {
		month: <WeekHeader />,
		week: <WeekDayHeader selectedWeek={selectedWeek} selectedDate={selectedDate} />,
		day: <DayHeader />,
	};

	const handleNavigation = useCallback(
		(direction) => {
			const current = moment(selectedDate || currentCalendarDate);
			let newDate;

			switch (view) {
				case 'month':
					// For month view, maintain the same day of month when possible
					const currentDay = current.date();
					newDate =
						direction === 'prev'
							? current.clone().subtract(1, 'month')
							: current.clone().add(1, 'month');

					// Check if the day exists in the new month
					const daysInNewMonth = newDate.daysInMonth();
					if (currentDay > daysInNewMonth) {
						// If the current day doesn't exist in the new month, use the last day
						newDate.date(daysInNewMonth);
					} else {
						// Keep the same day of month
						newDate.date(currentDay);
					}
					break;

				case 'week':
					newDate =
						direction === 'prev'
							? current.clone().subtract(7, 'days')
							: current.clone().add(7, 'days');
					break;

				case 'day':
					newDate =
						direction === 'prev'
							? current.clone().subtract(1, 'day')
							: current.clone().add(1, 'day');
					break;

				default:
					newDate = current.clone();
					break;
			}

			if (newDate.year() >= MIN_YEAR && newDate.year() <= MAX_YEAR) {
				// Update both currentCalendarDate and selectedDate
				updateCalendarInfo('currentCalendarDate', newDate.toDate());
				updateCalendarInfo('selectedDate', newDate.toDate());
			}
		},
		[view, selectedDate, currentCalendarDate],
	);

	const goToPrevious = useCallback(() => {
		handleNavigation('prev');
	}, [handleNavigation]);

	const goToNext = useCallback(() => {
		handleNavigation('next');
	}, [handleNavigation]);

	return (
		<>
			{/* <!-- Header Section --> */}
			<div className="calendarHeaderParentContainer">
				<div className="calendarHeaderContainer">
					<div className="calendarControls">
						<div className="calendarDate">
							<Left onClick={goToPrevious} />
							{label}
							<Right onClick={goToNext} />
						</div>
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
												{viewName}
											</span>
									  ))
									: ''}
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
					{viewsHeaders[view]}
				</div>
			</div>
		</>
	);
};

export default memo(CalendarHeader);

import React, { memo } from 'react';
import '../../../assets/scss/calendar/calendarSelector.scss';
import { ReactComponent as LeftSvg } from '../../../assets/svg/activity/left.svg';
import { ReactComponent as OpenCalSvg } from '../../../assets/svg/calendar/openCalendar.svg';
import { ReactComponent as RightSvg } from '../../../assets/svg/activity/right.svg';

const CalendarSelector = () => {
	return (
		<div className="calendarSelectorParentContainer">
			<div className="calendarContainer">
				<div className="calendarHeaderContainer">
					<div className="headerLabelWrapper">
						<span>September 2024</span>

						<OpenCalSvg />
					</div>
					<div className="headerButtons">
						<span>
							<LeftSvg />
						</span>
						<span>
							<RightSvg />
						</span>
					</div>
				</div>
				<div className="calendarBody">choose calendar</div>
			</div>
		</div>
	);
};

export default memo(CalendarSelector);

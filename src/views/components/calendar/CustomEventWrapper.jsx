import React, { memo } from 'react';
import '../../../assets/scss/calendar/customEventCard.scss';
const CustomEventWrapper = ({ event, children, view }) => {
	return (
		<div
			className="customEventWrapper"
			style={{ paddingRight: '2px' }}

			// onClick={() => alert(`Event Row clicked: ${event.title}`)}
		>
			{event?.allDay && view === 'week' && <span className="allDay">All Day</span>}
			{children}
		</div>
	);
};

export default memo(CustomEventWrapper);

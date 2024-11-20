import React, { memo } from 'react';
import '../../../assets/scss/calendar/customEventCard.scss';
const CustomEventWrapper = ({ event, children }) => {
	return (
		<div
			className="customEventWrapper"
			// onClick={() => alert(`Event Row clicked: ${event.title}`)}
		>
			{children}
		</div>
	);
};

export default memo(CustomEventWrapper);

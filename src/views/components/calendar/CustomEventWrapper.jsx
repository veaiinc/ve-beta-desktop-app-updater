import React, { memo } from 'react';
import '../../../assets/scss/calendar/customEventCard.scss';
const CustomEventWrapper = ({ event, children }) => {
	return (
		<div
			className="customEventWrapper"
			// style={{ border: '2px solid red' }}
			style={{ paddingRight: '2px', marginRight: '5px' }}

			// onClick={() => alert(`Event Row clicked: ${event.title}`)}
		>
			{children}
		</div>
	);
};

export default memo(CustomEventWrapper);

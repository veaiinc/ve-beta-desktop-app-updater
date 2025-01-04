import React, { memo } from 'react';

const MonthEventWrapper = ({ event }) => {
	console.log('event data==> ', JSON.stringify(event, null, 2));
	return (
		<div className="monthEventWrapper">
			<span
				className="leftColorBar"
				style={{
					backgroundColor: event?.calendarCategory?.color || '#989898',
					boxShadow: `0px 0px 10px 0px ${event?.calendarCategory?.color || '#989898'}`,
				}}
			/>
			<div className="textContainer">{event?.title}</div>
		</div>
	);
};

export default memo(MonthEventWrapper);

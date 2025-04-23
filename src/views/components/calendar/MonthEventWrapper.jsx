import React, { memo } from 'react';

const MonthEventWrapper = ({ event }) => {
	const truncatedTitle =
		event?.title?.length > 30 ? `${event.title.substring(0, 30)}...` : event?.title;

	return (
		<div className="monthEventWrapper">
			<span
				className="leftColorBar"
				style={{
					backgroundColor: event?.calendarCategory?.color || '#989898',
					// boxShadow: `0px 0px 10px 0px ${event?.calendarCategory?.color || '#989898'}`,
				}}
			/>
			<div
				className="textContainer"
				style={{ color: 'var(--primary-font)' }}
				title={event?.title}
			>
				{truncatedTitle}
			</div>
		</div>
	);
};

export default memo(MonthEventWrapper);

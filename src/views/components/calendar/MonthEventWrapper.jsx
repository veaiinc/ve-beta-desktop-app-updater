import React, { memo } from 'react';

const MonthEventWrapper = ({ event }) => {
	return (
		<div className="monthEventWrapper">
			<span
				className="leftColorBar"
				style={{ backgroundColor: `orange`, boxShadow: `-1px 0 3px 0px ${`orange`}` }}
			/>
			<div className="textContainer">{event?.title}</div>
		</div>
	);
};

export default memo(MonthEventWrapper);

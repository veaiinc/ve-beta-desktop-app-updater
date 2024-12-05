import React, { memo } from 'react';

const MonthEventWrapper = ({ event, title }) => {
	return (
		<div className="monthEventWrapper">
			<span
				className="leftColorBar"
				style={{ backgroundColor: `orange`, boxShadow: `-1px 0 3px 0px ${`orange`}` }}
			/>
			<div className="textContainer">{title}</div>
		</div>
	);
};

export default memo(MonthEventWrapper);

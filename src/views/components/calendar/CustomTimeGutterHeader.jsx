import React, { memo } from 'react';

const CustomTimeGutterHeader = () => {
	return (
		<div className="customGutterHeader">
			<div className="allDay" style={{ color: 'var(--primary-font)', fontSize: '12px' }}>
				All Day
			</div>
			<div>GMT +05:30</div>
		</div>
	);
};

export default memo(CustomTimeGutterHeader);

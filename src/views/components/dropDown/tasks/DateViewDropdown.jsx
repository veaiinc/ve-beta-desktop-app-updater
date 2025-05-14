import React, { memo } from 'react';
import DateView from '../../tasks/listView/DateView';
const DateViewDropdown = () => {
	return (
		<div>
			<div className="title"></div>
			<DateView />
		</div>
	);
};

export default memo(DateViewDropdown);

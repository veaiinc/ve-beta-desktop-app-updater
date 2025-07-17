import React, { memo } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';

const Phone = ({ value }) => {
	return (
		<a href={`tel:${value}`} className="listItem-phone">
			{value}
		</a>
	);
};

export default memo(Phone);

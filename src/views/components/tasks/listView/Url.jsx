import React, { memo } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';

const Url = ({ value }) => {
	return (
		<a href={value} className="listItem-url">
			{value}
		</a>
	);
};

export default memo(Url);

import React from 'react';
import '../../../../assets/scss/tasks/listItems.scss';

const Email = ({ value }) => {
	return (
		<a href={`mailto:${value}`} className="listItem-email">
			{value}
		</a>
	);
};

export default Email;

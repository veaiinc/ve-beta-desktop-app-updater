import React from 'react';
import '../../../../assets/scss/tasks/listItems.scss';

const Phone = ({ value }) => {
	return (
		<a href={`tel:${value}`} className="listItem-phone">
			{value}
		</a>
	);
};

export default Phone;

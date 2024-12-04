import React from 'react';

const Phone = ({ value }) => {
	return (
		<a href={`tel:${value}`} className="phone">
			{value}
		</a>
	);
};

export default Phone;

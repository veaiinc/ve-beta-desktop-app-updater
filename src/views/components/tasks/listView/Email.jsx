import React from 'react';

const Email = ({ value }) => {
	return (
		<a href={`mailto:${value}`} className="email">
			{value}
		</a>
	);
};

export default Email;

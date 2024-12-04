import React from 'react';

const Url = ({ value }) => {
	return (
		<a href={value} className="url">
			{value}
		</a>
	);
};

export default Url;

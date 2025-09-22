// import React from 'react';

const Numbers = ({ color, size, listCount }) => {
	const sizeValues = {
		small: '12px',
		medium: '20px',
		large: '28px',
		xlarge: '60px',
		xxlarge: '100px',
	};
	const iconSize = sizeValues[size] || sizeValues.medium;

	return (
		<span style={{ fontSize: iconSize, color: color || 'gray', fontWeight: 500 }}>
			{listCount < 10 ? `0${listCount}` : listCount}
		</span>
	);
};

export default Numbers;

// import React from 'react';

const SquareCircle = ({ color, size }) => {
	const sizeValues = {
		small: '12px',
		medium: '20px',
		large: '28px',
		xlarge: '60px',
		xxlarge: '100px',
	};
	const iconSize = sizeValues[size] || sizeValues.medium;

	return (
		<svg
			width={iconSize || '28'}
			height={iconSize || '28'}
			viewBox="0 0 100 100"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect
				x="0"
				y="0"
				width="100"
				height="100"
				fill="none"
				stroke={color || 'gray'}
				strokeWidth="10"
			/>
			<circle cx="50" cy="50" r="30" fill={color || 'gray'} />
		</svg>
	);
};

export default SquareCircle;

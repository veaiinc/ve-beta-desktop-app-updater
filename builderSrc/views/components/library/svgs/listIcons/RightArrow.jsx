import React from 'react';

const RightArrow = ({ color, size }) => {
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
			xmlns="http://www.w3.org/2000/svg"
			width={iconSize || '28'}
			height={iconSize || '28'}
			viewBox="0 0 18 18"
			fill="none"
		>
			<path
				d="M13.6935 10.1571L-4.43981e-07 10.1571L-3.42824e-07 7.84289L13.6935 7.84289L7.659 1.63615L9.24975 -3.82486e-07L18 9L9.24975 18L7.659 16.3638L13.6935 10.1571Z"
				fill={color || 'gray'}
			/>
		</svg>
	);
};

export default RightArrow;

import React from 'react';

const Right = ({ color, size }) => {
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
			viewBox="0 0 20 14"
			fill="none"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M2.9974 4.66667L0.664062 7L7.66406 14L19.3307 2.33333L16.9974 0L7.66406 9.33333L2.9974 4.66667Z"
				fill={color || 'gray'}
			/>
		</svg>
	);
};

export default Right;

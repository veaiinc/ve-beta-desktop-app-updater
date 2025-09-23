// import React from 'react';

const Minus = ({ color, size }) => {
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
			viewBox="0 0 40 40"
			fill="none"
		>
			<path
				d="M11 19C11 18.7348 11.1001 18.4804 11.2782 18.2929C11.4564 18.1054 11.698 18 11.95 18H29.05C29.302 18 29.5436 18.1054 29.7218 18.2929C29.8999 18.4804 30 18.7348 30 19C30 19.2652 29.8999 19.5196 29.7218 19.7071C29.5436 19.8946 29.302 20 29.05 20H11.95C11.698 20 11.4564 19.8946 11.2782 19.7071C11.1001 19.5196 11 19.2652 11 19Z"
				fill={color || 'gray'}
			/>
		</svg>
	);
};

export default Minus;

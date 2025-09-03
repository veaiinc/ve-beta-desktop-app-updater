// import React from 'react';

const Star = ({ color, size }) => {
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
			viewBox="0 0 20 22"
			fill="none"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M11.6936 5.55337L10.0587 0.521484L8.27344 6.01581L3.50216 2.72918L5.27193 7.74366H0.118181L4.58976 10.9925L0 14.5066L5.56001 14.3669L3.91511 19.4294L8.27757 16.2599L10.1188 21.4768L11.7002 16.1585L16.2022 19.4294L14.4844 14.1426L19.8747 14.0072L15.5132 11.0029L19.9991 7.74366H14.2025L15.7854 2.42051L11.6936 5.55337Z"
				fill={color || 'gray'}
			/>
		</svg>
	);
};

export default Star;

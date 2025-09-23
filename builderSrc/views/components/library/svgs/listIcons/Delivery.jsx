// import React from 'react';

const Delivery = ({ color, size }) => {
	const sizeValues = {
		small: '12px',
		medium: '20px',
		large: '28px',
	};
	const iconSize = sizeValues[size] || sizeValues.medium;

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={iconSize || '28'}
			height={iconSize || '28'}
			viewBox="0 0 24 24"
			fill="none"
			className="stroke-icon"
		>
			<path
				d="M3.16992 7.43945L11.9999 12.5494L20.7699 7.46942"
				stroke={color || 'gray'}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
			/>
			<path
				d="M12 21.6091V12.5391"
				stroke={color || 'gray'}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
			/>
			<path
				d="M9.92963 2.48L4.58963 5.45003C3.37963 6.12003 2.38965 7.80001 2.38965 9.18001V14.83C2.38965 16.21 3.37963 17.89 4.58963 18.56L9.92963 21.53C11.0696 22.16 12.9396 22.16 14.0796 21.53L19.4196 18.56C20.6296 17.89 21.6196 16.21 21.6196 14.83V9.18001C21.6196 7.80001 20.6296 6.12003 19.4196 5.45003L14.0796 2.48C12.9296 1.84 11.0696 1.84 9.92963 2.48Z"
				stroke={color || 'gray'}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
			/>
			<path
				d="M16.9998 13.2396V9.57965L7.50977 4.09961"
				stroke={color || 'gray'}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
			/>
		</svg>
	);
};

export default Delivery;

// import React from 'react';

const X = ({ fillColor, iconSize }) => {
	const sizeValues = {
		small: '26px',
		medium: '32px',
		large: '42px',
	};
	const size = sizeValues[iconSize] || sizeValues.medium;
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size || '40'}
			height={size || '40'}
			viewBox="0 0 34 34"
			fill="none"
		>
			<path
				d="M25.9363 3.13086H30.5398L20.4826 14.6255L32.3141 30.2672H23.0501L15.7943 20.7806L7.49202 30.2672H2.88579L13.6429 17.9724L2.29297 3.13086H11.7921L18.3507 11.802L25.9363 3.13086ZM24.3207 27.5118H26.8715L10.406 5.74152H7.66875L24.3207 27.5118Z"
				fill={fillColor || 'gray'}
			/>
		</svg>
	);
};

export default X;
